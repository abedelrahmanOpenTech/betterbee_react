<?php

namespace App\Http\Controllers\Web;

use App\Helpers\ChatHelper;
use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\LastChat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ChatController extends Controller
{

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
            return response()->json(["status" => "error", "message" => "message or file required"], 400);
        }

        $filePath = "";

        if (request()->hasFile('chat_file')) {
            $file = request()->file('chat_file');
            $fileName = $file->getClientOriginalName();
            $file->move(uploadPath(), $fileName);
            $filePath = $fileName;
        }

        $data = [
            "to_user_id" => request()->to_user_id,
            "from_user_id" => user()->id,
            "created_at" => Carbon::now(),
            "message" => request()->message,
            "reply_to" => request()->reply_to ?? 0,
            "file" => $filePath,
            "uid" => ChatHelper::buildUid(user()->id, request()->to_user_id)
        ];


        $chat =   DB::transaction(function () use ($data) {
            $chat =  Chat::create($data);
            LastChat::add($chat->id, $data);
            return $chat;
        });


        return response()->json([
            "status" => "success",
            "message" => "Message sent",
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

        $editedMessages = Chat::where('to_user_id', user()->id)
            ->where('from_user_id', $otherUserId)
            ->where('is_edited', 1)
            ->where('is_edit_reflected', 0)
            ->get(['id', 'message', 'is_edited']);

        $deletedMessages = Chat::where('to_user_id', user()->id)
            ->where('from_user_id', $otherUserId)
            ->where('is_deleted', 1)
            ->where('is_delete_reflected', 0)
            ->get(['id']);

        // Mark as reflected (set to 1)
        if ($editedMessages->isNotEmpty()) {
            Chat::whereIn('id', $editedMessages->pluck('id'))->update(['is_edit_reflected' => 1]);
        }
        if ($deletedMessages->isNotEmpty()) {
            Chat::whereIn('id', $deletedMessages->pluck('id'))->update(['is_delete_reflected' => 1]);
        }

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

        return response()->json([
            'status' => 'success',
            'message' => 'Deleted',
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
            'message' => 'Hidden',
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
                'message' => 'No message found'
            ]);
        }

        $message->update(['is_read' => 0]);

        return response()->json([
            'status' => 'success',
            'message' => 'Completed'
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
            'is_edit_reflected' => 0
        ]);

        // Update last chat if needed
        LastChat::where('original_chat_id', $id)->update([
            'message' => request()->message,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Message updated',
            'chat' => $message
        ]);
    }


    public function getNotification()
    {

        if (user()->is_disabled) {
            return response()->json([
                "status" => "error",
                "message" => "Account disabled",
                "action" => "logout"
            ]);
        }


        User::updateLastSeen();

        $unreadMessages = Chat::getUnreadMessages(user()->id);

        $oldUnreadMessages = session('unreadMessages', []);

        $unreadMessagesCount = $this->getCount($unreadMessages);
        $oldUnreadMessagesCount = $this->getCount($oldUnreadMessages);
        $newMessageFound = $unreadMessagesCount > $oldUnreadMessagesCount;

        session()->put('unreadMessages', $unreadMessages);


        return response()->json([
            "status" => "success",
            "unreadMessages" => $unreadMessages,
            "newMessageFound" => $newMessageFound,
            "unreadMessagesCount" => $unreadMessagesCount,
            "onlineUsers" => User::getOnlineUsers()
        ]);
    }

    // public function getChatUpdates($otherUserId)
    // {
    //     //stoped for testing
    //     return '';
    //     $unreadMessagesIds = json_decode(request()->unreadMessagesIds, true);

    //     $messagesInfo = Chat::whereIn('id', $unreadMessagesIds)->get(['id', 'is_read']);

    //     $deletedMessages =  Chat::getDeletedMessages($otherUserId);

    //     if ($messagesInfo->isEmpty() && $deletedMessages->isEmpty()) {
    //         abort(204);
    //     }

    //     return view("components/chat-updates", [
    //         "deletedMessages" => $deletedMessages,
    //         "messagesInfo" => $messagesInfo
    //     ]);
    // }

    private function getCount($unreadMessages)
    {
        $total = 0;
        foreach ($unreadMessages as $message) {
            $total += count($message->toArray());
        }
        return $total;
    }
}
