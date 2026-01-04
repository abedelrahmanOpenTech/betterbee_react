<?php

namespace App\Http\Controllers\Web;

use App\Helpers\ChatHelper;
use App\Helpers\PushNotificationHelper;
use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\LastChat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{

    public function updateLastSeen()
    {
        User::updateLastSeen();
        return [
            'status' => 'success'
        ];
    }

    public function index()
    {
        $users = User::getList();

        return response()->json([
            "status" => "success",
            "users" => $users
        ]);
    }

    public function chatWithUser($otherUserId)
    {
        $otherUser = User::findOrFail($otherUserId);

        Chat::deleteSoftDeletedMessagesBetweenUsers(user()->id, $otherUser->id);
        Chat::where('is_edit_reflected', 0)->where('is_edited', 1)->where('updated_at', '<', now()->subHours(1))->update(['is_edit_reflected' => 1]);
        Chat::where('is_delete_reflected', 0)->where('is_deleted', 1)->where('created_at', '<', now()->subHours(1))->update(['is_delete_reflected' => 1]);

        $chat = Chat::getMessagesBetweenUsers(user()->id, $otherUser->id);

        return response()->json([
            "status" => "success",
            "otherUser" => $otherUser,
            "chat" => $chat
        ]);
    }

    public function create()
    {
        if (empty(request()->message) && !request()->hasFile('chat_file')) {
            return response()->json(["status" => "error", "message" => __('messages.message_or_file_required')], 400);
        }

        $chat = DB::transaction(function () {
            $data = [
                "to_user_id" => request()->to_user_id,
                "from_user_id" => user()->id,
                "created_at" => Carbon::now(),
                "message" => request()->message,
                "reply_to" => request()->reply_to ?? 0,
                "file" => "",
                "uid" => ChatHelper::buildUid(user()->id, request()->to_user_id)
            ];

            $chat = Chat::create($data);

            if (request()->hasFile('chat_file')) {
                $file = request()->file('chat_file');
                $fileName = $file->getClientOriginalName();
                $dir = "chat_files/{$chat->id}";
                $file->move(uploadPath($dir), $fileName);
                $filePath = "$dir/$fileName";
                $chat->update(['file' => $filePath]);
                $data['file'] = $filePath;
            }

            LastChat::add($chat->id, $data);

            return $chat;
        });

        // PushNotificationHelper logic removed

        return response()->json([
            "status" => "success",
            "message" => __('messages.message_sent'),
            "chat" => $chat
        ]);
    }

    public function getChatUpdates($otherUserId)
    {
        $unreadMessagesIds = json_decode(request()->unreadMessagesIds, true);
        $messagesInfo = collect(new Chat());

        if (!empty($unreadMessagesIds)) {
            $messagesInfo = Chat::whereIn('id', $unreadMessagesIds)->get(['id', 'is_read']);
        }


        $chat = Chat::getNewMessages($otherUserId, request()->lastMessageId);

        $editedMessages = Chat::where("uid", ChatHelper::buildUid($otherUserId, user()->id))
            ->where('is_edited', 1)
            ->where('is_edit_reflected', 0)
            ->get(['id', 'message', 'is_edited']);

        $deletedMessages = Chat::where("uid", ChatHelper::buildUid($otherUserId, user()->id))
            ->where('is_deleted', 1)
            ->where('is_delete_reflected', 0)
            ->get(['id']);

        return response()->json([
            "status" => "success",
            "chat" => $chat,
            "messagesInfo" => $messagesInfo,
            "editedMessages" => $editedMessages,
            "deletedMessages" => $deletedMessages
        ]);
    }

    public function deletedMessage($id)
    {
        Chat::softDelete($id);

        // PushNotificationHelper logic removed

        return response()->json([
            'status' => 'success',
            'message' => __('messages.deleted'),
        ]);
    }

    public function hideMessage($id)
    {
        $userId = user()->id;
        DB::table('chats')->where('id', $id)->update([
            'is_hidden' => DB::raw("CONCAT_WS(',', NULLIF(is_hidden, ''), '$userId')")
        ]);

        return response()->json([
            'status' => 'success',
            'message' => __('messages.hidden'),
        ]);
    }

    public function markAsUnread($otherUserId)
    {

        $message = Chat::where('from_user_id', $otherUserId)
            ->where('to_user_id', user()->id)
            ->orderBy('id', 'desc')
            ->first();

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'message' => __('messages.no_message_found')
            ]);
        }

        $message->update(['is_read' => 0]);

        return response()->json([
            'status' => 'success',
            'message' => __('messages.completed')
        ]);
    }

    public function editMessage($id)
    {
        $message = Chat::where('id', $id)
            ->where('from_user_id', user()->id)
            ->firstOrFail();

        $message->update([
            'message' => request()->message,
            'is_edited' => 1,
            'is_edit_reflected' => 0,
            'updated_at' => Carbon::now()
        ]);

        LastChat::where('original_chat_id', $id)->update([
            'message' => request()->message,
        ]);

        // PushNotificationHelper logic removed

        return response()->json([
            'status' => 'success',
            'message' => __('messages.message_updated'),
            'chat' => $message
        ]);
    }

    public function sendPushNotification($otherUserId)
    {
        $lastChat = LastChat::where('uid', ChatHelper::buildUid(user()->id, $otherUserId))->first();

        if ($lastChat) {
            PushNotificationHelper::sendNotification($otherUserId, [
                'message' => user()->name . ": " . ($lastChat->message ?: __('messages.sent_a_file')),
            ]);
        }

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function sendBroadcast()
    {
        $userIds = json_decode(request()->user_ids, true);

        if (empty($userIds) || !is_array($userIds)) {
            return response()->json([
                "status" => "error",
                "message" => __('messages.no_recipients_selected')
            ], 400);
        }

        if (empty(request()->message) && !request()->hasFile('chat_file')) {
            return response()->json([
                "status" => "error",
                "message" => __('messages.message_or_file_required')
            ], 400);
        }

        $successCount = 0;
        $errors = [];
        $uploadedFilePath = "";

        // Handle file upload once, outside the loop
        if (request()->hasFile('chat_file')) {
            $file = request()->file('chat_file');
            $fileName = $file->getClientOriginalName();
            $timestamp = time();
            $dir = "chat_files/broadcast_{$timestamp}";
            $file->move(uploadPath($dir), $fileName);
            $uploadedFilePath = "$dir/$fileName";
        }

        foreach ($userIds as $toUserId) {
            try {
                DB::transaction(function () use ($toUserId, $uploadedFilePath, &$successCount) {
                    $data = [
                        "to_user_id" => $toUserId,
                        "from_user_id" => user()->id,
                        "created_at" => Carbon::now(),
                        "message" => request()->message,
                        "reply_to" => 0,
                        "file" => $uploadedFilePath,
                        "uid" => ChatHelper::buildUid(user()->id, $toUserId)
                    ];

                    $chat = Chat::create($data);

                    LastChat::add($chat->id, $data);

                    // Send push notification
                    PushNotificationHelper::sendNotification($toUserId, [
                        'message' => user()->name . ": " . ($data['message'] ?: __('messages.sent_a_file')),
                    ]);

                    $successCount++;
                });
            } catch (\Exception $e) {
                $errors[] = "Failed to send to user ID: $toUserId";
            }
        }

        if ($successCount === 0) {
            return response()->json([
                "status" => "error",
                "message" => __('messages.broadcast_failed'),
                "errors" => $errors
            ], 500);
        }

        return response()->json([
            "status" => "success",
            "message" => __('messages.broadcast_sent'),
            "sent_count" => $successCount,
            "total_count" => count($userIds)
        ]);
    }
}
