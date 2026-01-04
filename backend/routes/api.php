<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post("login", [AuthController::class, 'login']);
Route::post("register", [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return [
            "status" => "success",
            "user" => $request->user()
        ];
    });

    Route::post("update-profile", [AuthController::class, 'update']);

    Route::prefix('chat')->group(function () {
        Route::get('users', [ChatController::class, 'index']);
        Route::get('messages/{otherUserId}', [ChatController::class, 'chatWithUser']);
        Route::post("create", [ChatController::class, 'create']);
        Route::post("broadcast", [ChatController::class, 'sendBroadcast']);
        Route::post("send-push-notification/{otherUserId}", [ChatController::class, 'sendPushNotification']);
        Route::post("delete-message/{id}", [ChatController::class, 'deletedMessage']);
        Route::post("hide-message/{id}", [ChatController::class, 'hideMessage']);
        Route::post("mark-as-unread/{otherUserId}", [ChatController::class, 'markAsUnread']);
        Route::post("get-chat-updates/{otherUserId}", [ChatController::class, 'getChatUpdates']);
        Route::post("edit-message/{id}", [ChatController::class, 'editMessage']);
        Route::get("update-last-seen", [ChatController::class, 'updateLastSeen']);
    });

    Route::post("save-notification-subscription", [\App\Http\Controllers\Dashboard\UserController::class, 'saveSubscription']);
});
