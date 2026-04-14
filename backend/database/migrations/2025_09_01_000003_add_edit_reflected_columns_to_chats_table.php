<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->tinyInteger('is_edited')->default(0)->after('reply_to');
            $table->tinyInteger('is_edit_reflected')->default(0)->after('is_edited');
            $table->tinyInteger('is_delete_reflected')->default(0)->after('is_edit_reflected');
        });
    }

    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->dropColumn(['is_edited', 'is_edit_reflected', 'is_delete_reflected']);
        });
    }
};
