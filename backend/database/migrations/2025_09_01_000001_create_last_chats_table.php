<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('last_chats', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('original_chat_id');
            $table->unsignedBigInteger('from_user_id');
            $table->unsignedBigInteger('to_user_id');
            $table->string('uid')->default('');
            $table->text('message')->nullable();
            $table->text('file')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unsignedBigInteger('reply_to')->default(0);
            $table->string('is_hidden')->default('');

            $table->index('reply_to', 'chats_reply_to_index');
            $table->index('is_hidden', 'chats_is_hidden_index');
            $table->index('original_chat_id');
            $table->index('from_user_id');
            $table->index('to_user_id');
            $table->index('uid');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('last_chats');
    }
};
