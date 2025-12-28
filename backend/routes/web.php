<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\ChatController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return '';
});

// Route::view("login", 'web/login')->middleware('guest');
// Route::post("login", [AuthController::class, 'login'])->middleware('guest');
// Route::get("register", [AuthController::class, 'registerForm'])->middleware('guest');
// Route::post("register", [AuthController::class, 'register'])->middleware('guest');
// Route::get("logout", [AuthController::class, 'logout'])->middleware('auth');
// Route::post("update-profile", [AuthController::class, 'update'])->middleware('auth');



Route::prefix('chat')->middleware('auth')->group(function () {
    Route::get('', [ChatController::class, 'index']);
    Route::get('chat-with-user/{otherUserId}', [ChatController::class, 'chatWithUser']);
    Route::post("create", [ChatController::class, 'create']);
    // Route::post("get-new-messages/{otherUserId}", [ChatController::class, 'getNewMessages']);
    Route::get("get-notification/", [ChatController::class, 'getNotification']);
    Route::post("delete-message/{id}", [ChatController::class, 'deletedMessage']);
    Route::post("hide-message/{id}", [ChatController::class, 'hideMessage']);
    Route::post("mark-as-unread/{otherUserId}", [ChatController::class, 'markAsUnread']);
    Route::post("get-chat-updates/{otherUserId}", [ChatController::class, 'getChatUpdates']);
});
