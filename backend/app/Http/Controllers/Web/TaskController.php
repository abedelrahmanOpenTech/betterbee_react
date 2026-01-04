<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
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

        $task = Task::create([
            'project_id' => $project->id,
            'title' => $request->title,
            'status' => 'pending',
            'message_id' => $request->message_id,
        ]);

        return response()->json([
            "status" => "success",
            "task" => $task,
            "message" => __('messages.task_created')
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,working,done',
        ]);

        $task = Task::whereHas('project', function ($query) {
            $query->where('user_id', user()->id);
        })->findOrFail($id);

        $task->update(['status' => $request->status]);

        return response()->json([
            "status" => "success",
            "task" => $task,
            "message" => __('messages.task_updated')
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $task = Task::whereHas('project', function ($query) {
            $query->where('user_id', user()->id);
        })->findOrFail($id);

        $task->update(['title' => $request->title]);

        return response()->json([
            "status" => "success",
            "task" => $task,
            "message" => __('messages.task_updated')
        ]);
    }

    public function destroy($id)
    {
        $task = Task::whereHas('project', function ($query) {
            $query->where('user_id', user()->id);
        })->findOrFail($id);

        $task->delete();

        return response()->json([
            "status" => "success",
            "message" => __('messages.task_deleted')
        ]);
    }
}
