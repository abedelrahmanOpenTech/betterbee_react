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

    protected static $onlineDiffTimeInSeconds = 10;

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
        $users = User::where('id', '!=', auth()->id())
            ->where('type', '!=', UserTypes::ADMIN)
            ->get()->map(function ($user) {
                $lastChat = LastChat::where('uid', ChatHelper::buildUid(auth()->id(), $user->id))->first();
                $user->last_message = $lastChat->message ?? ($lastChat && $lastChat->file ? 'File' : '');
                $user->last_message_date = $lastChat->created_at ?? Carbon::create(2000, 1, 1);
                $user->last_message_from_me = $lastChat && $lastChat->from_user_id == auth()->id();
                return $user;
            })
            ->sortByDesc('last_message_date')
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
