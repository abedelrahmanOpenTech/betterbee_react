<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('user_id', user()->id)
            ->with(['tasks'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            "status" => "success",
            "projects" => $projects
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $project = Project::create([
            'user_id' => user()->id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            "status" => "success",
            "project" => $project,
            "message" => __('messages.project_created')
        ]);
    }

    public function destroy($id)
    {
        $project = Project::where('user_id', user()->id)->findOrFail($id);
        $project->tasks()->delete();
        $project->delete();

        return response()->json([
            "status" => "success",
            "message" => __('messages.project_deleted')
        ]);
    }
}
