<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->text('title');
            $table->string('status')->default('pending');
            $table->integer('position')->default(0)->nullable();
            $table->unsignedBigInteger('message_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->index('project_id', 'tasks_project_id_index');
            $table->index('message_id', 'tasks_message_id_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
