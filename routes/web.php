<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
// Route::get('/test-oauth', function() {

//     $response = Http::asForm()->post('http://localhost/KeepNote/public/oauth/token', [

//         'grant_type' => 'password',

//         'client_id' => '019c0d0b-48ed-73af-ad0e-b9e98f90c375',
//         'client_secret' => 'NPmF5SV0yTGuByFr6R7mdHpQKzqvhmK0EtMXGkeg',

//         'username' => 'sakifshahrear@gmail.com',
//         'password' => '123456',

//         'scope' => ''
//     ]);

//     Log::info('OAuth Token Response: '.$response->body());

//     return 'Check log file for token output';
// });

Route::get('/', function () {
    return view('welcome');
});
