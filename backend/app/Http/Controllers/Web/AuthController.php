<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class AuthController extends Controller
{

    public function login()
    {
        $credentials = request()->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, true)) {
            return response()->json([
                "status" => "error",
                "message" => "Invalid account"
            ]);
        }


        if (user()->isAdmin() || user()->is_disabled == 1) {
            Auth::logout();
            return response()->json([
                "status" => "error",
                "message" => "Invalid account"
            ]);
        }

        $user = Auth::user();
        $user->load('settings');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "status" => "success",
            "message" => "Login successful",
            "user" => $user,
            "access_token" => $token
        ]);
    }

    public function registerForm()
    {
        if (!Settings::has('enable_register')) {
            return redirectResponse('login');
        }

        return view('web/register');
    }



    public function register()
    {
        if (!Settings::has('enable_register')) {
            return response()->json([
                "status" => "error",
                "message" => "Registration is disabled"
            ]);
        }

        $validated = request()->validate([
            "name" => ["required", "unique:users,name"],
            "email" => ["required", "email", "unique:users,email"],
            "password" => ["required", "min:8"]
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $user->load('settings');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "status" => "success",
            "message" => "Registration successful",
            "user" => $user,
            "access_token" => $token
        ]);
    }

    public function logout()
    {
        if (Auth::check()) {
            Auth::user()->tokens()->delete();
            Auth::logout();
        }

        return response()->json([
            "status" => "success",
            "message" => "Logged out"
        ]);
    }

    public function update()
    {
        $user = Auth::user();

        $validated = request()->validate([
            "name" => ["required", "unique:users,name," . $user->id],
            "email" => ["required", "email", "unique:users,email," . $user->id],
            "password" => ["nullable", "min:8"],
            'profile' => ['nullable', 'image', 'max:2048'], // max size 2MB 

        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }


        if (request()->hasFile('profile')) {
            $file = request()->file('profile');
            $fileName = $file->getClientOriginalName();
            File::ensureDirectoryExists(uploadPath() . '/profiles');
            $file->move(uploadPath() . '/profiles', $fileName);
            $validated['profile'] = 'profiles/' . $fileName;
        }


        $user->update($validated);
        $user->load('settings');

        return response()->json([
            "status" => "success",
            "message" => "Profile Updated",
            "user" => $user
        ]);
    }

    public function updateSettings()
    {
        $user = Auth::user();

        $validated = request()->validate([
            "theme_color" => ["nullable", "string"],
            "lang" => ["nullable", "string"],
        ]);

        $user->settings()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        $user->load('settings');

        return response()->json([
            "status" => "success",
            "message" => "Settings Updated",
            "user" => $user
        ]);
    }
}
