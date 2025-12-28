<?php

use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\SettingsController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;


Route::view('login', 'dashboard.login')->middleware('guest');
Route::post('login', [AuthController::class, 'login'])->middleware('guest');
Route::get('logout', [AuthController::class, 'logout'])->middleware('auth');

Route::middleware(['admin'])->group(function () {
    Route::view('', 'dashboard.users.index');
    Route::view('users', 'dashboard.users.index');
    Route::get('get-users', [UserController::class, 'getUsers']);
    Route::get('users/form/{id?}', [UserController::class, 'form']);
    Route::post('users/save', [UserController::class, 'save']);

    Route::get('settings', [SettingsController::class, 'form']);
    Route::post('settings/save', [SettingsController::class, 'save']);
});
