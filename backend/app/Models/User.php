<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Constants\UserTypes;
use App\Helpers\ChatHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_seen' => 'datetime',
    ];

    protected static $onlineDiffTimeInSeconds = 15;

    public function chats()
    {
        return $this->hasMany(Chat::class, "from_user_id");
    }


    public function isOnline()
    {
        return $this->last_seen && $this->last_seen->gt(now()->subSeconds(self::$onlineDiffTimeInSeconds));
    }

    public function isAdmin()
    {
        return $this->type == UserTypes::ADMIN;
    }



    public static function getList()
    {
        $currentUserId = auth()->id();

        // Update last seen for current user
        User::where('id', $currentUserId)->update(["last_seen" => now()]);

        // 1. Select all users
        $users = User::where('id', '!=', $currentUserId)
            ->where('type', '!=', UserTypes::ADMIN)
            ->where('is_disabled', 0)
            ->get();

        // 2. Select all last messages
        $uids = $users->map(fn($user) => ChatHelper::buildUid($currentUserId, $user->id))->toArray();
        $lastChats = LastChat::whereIn('uid', $uids)->get()->keyBy('uid');

        // 3. Get unread counts
        $unreadCounts = Chat::where('to_user_id', $currentUserId)
            ->where('is_read', 0)
            ->where('is_deleted', 0)
            ->selectRaw('from_user_id, count(*) as count')
            ->groupBy('from_user_id')
            ->pluck('count', 'from_user_id');

        // 4. Combine them
        $users = $users->map(function ($user) use ($currentUserId, $lastChats, $unreadCounts) {
            $uid = ChatHelper::buildUid($currentUserId, $user->id);
            $lastChat = $lastChats->get($uid);

            $user->last_message = $lastChat->message ?? ($lastChat && $lastChat->file ? 'File' : '');
            $user->last_message_date = $lastChat->created_at ?? Carbon::create(2000, 1, 1);
            $user->last_message_from_me = $lastChat && $lastChat->from_user_id == $currentUserId;
            $user->unread_count = $unreadCounts[$user->id] ?? 0;

            $user->is_online = $user->isOnline() ? 1 : 0;

            return $user;
        })
            ->sortByDesc('last_message_date')
            ->sortByDesc('is_online')
            ->values();

        return $users;
    }

    public static function updateLastSeen()
    {
        User::where('id', user()->id)->update([
            "last_seen" => Carbon::now()
        ]);
    }

    public static function getOnlineUsers()
    {
        return User::where('last_seen', '>', Carbon::now()->subSeconds(self::$onlineDiffTimeInSeconds))->get('id');
    }
}
