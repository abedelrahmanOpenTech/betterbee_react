<?php

namespace App\Http\Controllers\Dashboard;

use App\Constants\UserTypes;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserNotificationSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function getUsers(Request $request)
    {

        return DataTables::make(User::query()->where('type', '!=', UserTypes::ADMIN))
            ->addIndexColumn()
            ->addColumn('action', function ($user) {
                return tableButtons($user);
            })
            ->rawColumns(['action', 'is_disabled'])
            ->editColumn('created_at', function ($row) {
                return $row->created_at->toDateString();
            })
            ->editColumn('is_disabled', function ($row) {
                return booleanIcon($row->is_disabled);
            })
            ->toJson();
    }

    public function form($id = null)
    {
        $user = User::make();

        if ($id) {
            $user = User::find($id);
        }

        return view('dashboard.users.form', [
            'user' => $user
        ]);
    }



    public function save(Request $request)
    {

        $id = $request->id;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'is_disabled' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return redirect(url("dashboard/users/form/$id"))
                ->withErrors($validator)
                ->withInput();
        }

        $validated = $validator->validated();
        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_disabled' => $validated['is_disabled'] ?? 0,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }


        User::updateOrCreate(
            ['id' => $id],
            $data
        );

        session()->flash("toast", ["status" => "success", "message" => "Saved"]);

        return redirectResponse("dashboard/users");
    }

    public function saveSubscription(Request $request)
    {
        $userId = user()->id;
        $subscription = $request->input('subscription');

        if (!$userId || !$subscription) {
            return response()->json(['status' => 'error', 'message' => 'Invalid data'], 400);
        }

        $subscriptionJson = json_encode($subscription);

        // Check if subscription already exists
        $exists = UserNotificationSubscription::where('user_id', $userId)
            ->where('subscription', $subscriptionJson)
            ->exists();

        if (!$exists) {
            UserNotificationSubscription::create([
                'user_id' => $userId,
                'subscription' => $subscriptionJson
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'Subscription saved']);
    }
}
