<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); // যে client note create করেছে
            $table->string('title'); // Note এর title
            $table->text('text'); // Note এর content
            $table->date('date'); // কোন তারিখে note করা হয়েছে
            $table->string('time'); // কোন সময়ে note করা হয়েছে
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('client_id')
                  ->references('id')
                  ->on('clients')
                  ->onDelete('cascade'); // Client delete হলে তার সব notes ও delete হবে
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
