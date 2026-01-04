<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskFile;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string',
        ]);

        // Verify project belongs to user
        $project = Project::where('user_id', user()->id)->findOrFail($request->project_id);

        // Get max position for this project and status
        $maxPosition = Task::where('project_id', $project->id)
            ->where('status', 'pending')
            ->max('position') ?? -1;

        $task = Task::create([
            'project_id' => $project->id,
            'title' => $request->title,
            'status' => 'pending',
            'position' => $maxPosition + 1,
            'message_id' => $request->message_id,
        ]);

        if ($request->hasFile('task_files')) {
            foreach ($request->file('task_files') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(uploadPath(), $fileName);
                TaskFile::create([
                    'task_id' => $task->id,
                    'file' => $fileName
                ]);
            }
        } elseif ($request->message_id) {
            $chat = \App\Models\Chat::find($request->message_id);
            if ($chat && $chat->file) {
                TaskFile::create([
                    'task_id' => $task->id,
                    'file' => $chat->file
                ]);
            }
        }

        return response()->json([
            "status" => "success",
            "task" => $task->load('files'),
            "message" => __('messages.task_created')
        ]);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:pending,working,done',
        ]);

        // Verify ownership
        if ($task->project->user_id !== user()->id) {
            abort(403);
        }

        $oldStatus = $task->status;
        $oldPosition = $task->position;
        $newStatus = $request->status;

        if ($oldStatus === $newStatus) {
            return response()->json(["status" => "success", "task" => $task]);
        }

        // Reorder tasks in the old column to fill the gap
        Task::where('project_id', $task->project_id)
            ->where('status', $oldStatus)
            ->where('position', '>', $oldPosition)
            ->decrement('position');

        // Get max position in the new column
        $maxPosition = Task::where('project_id', $task->project_id)
            ->where('status', $newStatus)
            ->max('position') ?? -1;

        $task->update([
            'status' => $newStatus,
            'position' => $maxPosition + 1
        ]);

        return response()->json([
            "status" => "success",
            "task" => $task,
            "message" => __('messages.task_updated')
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        // Verify ownership
        if ($task->project->user_id !== user()->id) {
            abort(403);
        }

        $task->update(['title' => $request->title]);

        // Handle deleted files
        if ($request->has('delete_files')) {
            $deleteIds = is_array($request->delete_files) ? $request->delete_files : json_decode($request->delete_files, true);
            if ($deleteIds) {
                $filesToDelete = TaskFile::where('task_id', $task->id)->whereIn('id', $deleteIds)->get();
                foreach ($filesToDelete as $fileRecord) {
                    $filePath = uploadPath() . '/' . $fileRecord->file;
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                    $fileRecord->delete();
                }
            }
        }

        // Handle new files
        if ($request->hasFile('task_files')) {
            foreach ($request->file('task_files') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(uploadPath(), $fileName);
                TaskFile::create([
                    'task_id' => $task->id,
                    'file' => $fileName
                ]);
            }
        }

        return response()->json([
            "status" => "success",
            "task" => $task->load('files'),
            "message" => __('messages.task_updated')
        ]);
    }

    public function destroy(Task $task)
    {
        // Verify ownership
        if ($task->project->user_id !== user()->id) {
            abort(403);
        }

        // Delete files from disk
        foreach ($task->files as $fileRecord) {
            $filePath = uploadPath() . '/' . $fileRecord->file;
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        $task->files()->delete();
        $task->delete();

        // Reorder positions after delete
        Task::where('project_id', $task->project_id)
            ->where('status', $task->status)
            ->where('position', '>', $task->position)
            ->decrement('position');

        return response()->json([
            "status" => "success",
            "message" => __('messages.task_deleted')
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'new_position' => 'required|integer|min:0',
        ]);

        $task = Task::findOrFail($request->task_id);

        // Verify ownership
        if ($task->project->user_id !== user()->id) {
            abort(403);
        }

        // 1. Normalize positions for this column to ensure they are contiguous 0, 1, 2...
        $tasksInColumn = Task::where('project_id', $task->project_id)
            ->where('status', $task->status)
            ->orderBy('position', 'asc')
            ->get();

        foreach ($tasksInColumn as $idx => $t) {
            if ($t->position !== $idx) {
                $t->update(['position' => $idx]);
            }
        }

        // Refresh task after normalization
        $task->refresh();
        $oldPosition = $task->position;
        $newPosition = $request->new_position;

        if ($oldPosition === $newPosition) {
            return response()->json(["status" => "success"]);
        }

        // 2. Perform the shift
        if ($newPosition > $oldPosition) {
            Task::where('project_id', $task->project_id)
                ->where('status', $task->status)
                ->whereBetween('position', [$oldPosition + 1, $newPosition])
                ->decrement('position');
        } else {
            Task::where('project_id', $task->project_id)
                ->where('status', $task->status)
                ->whereBetween('position', [$newPosition, $oldPosition - 1])
                ->increment('position');
        }

        $task->update(['position' => $newPosition]);

        return response()->json([
            "status" => "success",
            "message" => __('messages.task_reordered')
        ]);
    }
}
