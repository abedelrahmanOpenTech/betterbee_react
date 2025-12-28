<?php

namespace App\Models;

use App\Helpers\ChatHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class Chat extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'created_at' => 'datetime',
    ];



    public function reply()
    {
        return $this->belongsTo(Chat::class, "reply_to", "id");
    }


    public function user()
    {
        return $this->belongsTo(User::class, "from_user_id");
    }

    public function scopeNotHiddenFor($query, $userId)
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            return $query->where(function ($query) use ($userId) {
                $query->where('is_hidden', '=', '')
                    ->orWhere(function ($q) use ($userId) {
                        $q->where('is_hidden', 'NOT LIKE', "{$userId},%")
                            ->where('is_hidden', 'NOT LIKE', "%,{$userId},%")
                            ->where('is_hidden', 'NOT LIKE', "%,{$userId}")
                            ->where('is_hidden', '!=', (string)$userId);
                    });
            });
        }

        return $query->whereRaw("FIND_IN_SET(?, is_hidden) = 0", [$userId]);
    }

    public static function getUnreadMessages($userId)
    {
        return  Chat::where("to_user_id", $userId)
            ->join('users', 'users.id', "=", "chats.from_user_id")
            ->where("is_read", 0)
            ->where("is_deleted", 0)
            ->orderBy('chats.created_at', 'desc')
            ->get(['from_user_id', 'users.name as user_name', 'chats.created_at'])
            ->groupBy("from_user_id");
    }

    public static function getDeletedMessages($otherUserId)
    {
        return  Chat::where("from_user_id", $otherUserId)
            ->where("to_user_id", user()->id)
            ->where("is_deleted", 1)
            ->get('id');
    }

    public static function getMessagesBetweenUsers($userID1, $userID2, $greatedThanId = 0)
    {
        $otherUserId = $userID1 == user()->id ? $userID2 : $userID1;

        Chat::markChatMessagesAsRead($otherUserId);

        $userId = user()->id;

        return Chat::where("uid", ChatHelper::buildUid($userID1, $userID2))
            ->with("user")
            ->where("is_deleted", 0)
            ->where("id", ">", $greatedThanId)
            ->notHiddenFor($userId)
            ->with('reply')
            ->orderBy('id', 'desc')
            ->take(100)
            ->get()
            ->reverse()
            ->values();
    }


    public static function getNewMessages($otherUserId, $greatedThanId = 0)
    {
        Chat::markChatMessagesAsRead($otherUserId);

        return Chat::where("uid", ChatHelper::buildUid($otherUserId, user()->id))
            ->with("user")
            ->where("is_deleted", 0)
            ->notHiddenFor(user()->id)
            ->where("id", ">", $greatedThanId)
            ->with('reply')
            ->get();
    }


    public static function softDelete($id)
    {
        return DB::transaction(function () use ($id) {
            LastChat::where("original_chat_id", $id)->delete();
            return Chat::where("id", $id)
                ->where('from_user_id', user()->id)
                ->update(['is_deleted' => 1, 'is_delete_reflected' => 0]);
        });
    }


    public static function deleteSoftDeletedMessagesBetweenUsers($userID1, $userID2)
    {
        $chats = Chat::where("uid", ChatHelper::buildUid($userID1, $userID2))
            ->where('is_deleted', 1)
            ->get();

        foreach ($chats as $chat) {

            if ($chat->file) {

                if (File::exists(uploadPath($chat->file))) {
                    File::delete(uploadPath($chat->file));
                }
            }
            $chat->delete();
        }
    }

    private  static function markChatMessagesAsRead($otherUserId)
    {
        return  Chat::where("to_user_id", user()->id)
            ->where("from_user_id", $otherUserId)
            ->where("is_read", 0)
            ->update(["is_read" => 1]);
    }
}
