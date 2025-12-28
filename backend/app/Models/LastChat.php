<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LastChat extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'created_at' => 'datetime',
    ];

    public static function add($originalChatId, $data)
    {
        self::where('uid', $data['uid'])->delete();
        return self::create([
            ...$data,
            "original_chat_id" => $originalChatId
        ]);
    }
}
