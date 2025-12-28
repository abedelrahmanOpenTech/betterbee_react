<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{


    public function login()
    {
        $credentials = Validator::validate(request()->all(), [
            'email' => ['required'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, true)) {
            session()->flash("response", ["status" => "error", "message" => "Invalid account"]);
            return back()->withInput();
        }


        if (!user()->isAdmin()) {
            Auth::logout();
            session()->flash("response", ["status" => "error", "message" => "Invalid account"]);
            return back()->withInput();
        }

        return redirectResponse('dashboard/users');
    }


    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirectResponse('dashboard/login');
    }
}
