<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'title', 'status', 'message_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function message()
    {
        return $this->belongsTo(Chat::class, 'message_id');
    }
}
