<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Client; // client Model অবশ্যই ইমপোর্ট করতে হবে
use Illuminate\Support\Facades\Hash; // পাসওয়ার্ড সুরক্ষিত রাখার জন্য
use App\Http\Controllers\AuthController; // AuthController ইমপোর্ট করা হয়েছে

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| এখানে সব API routes define করা হয়
| Base URL: http://your-domain.com/api/
*/

// ১. টেস্ট রুট - API কাজ করছে কিনা চেক করার জন্য
// URL: GET /api/test
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Test OAuth setup
Route::get('/test-oauth', function () {
    $clients = DB::table('oauth_clients')->get();
    return response()->json([
        'message' => 'OAuth clients',
        'clients' => $clients
    ]);
});

// Debug route - check password
Route::post('/debug-login', function (Request $request) {
    $client = Client::where('email', $request->email)->first();
    
    if (!$client) {
        return response()->json(['error' => 'Client not found']);
    }
    
    $passwordCheck = Hash::check($request->password, $client->password);
    
    return response()->json([
        'email' => $client->email,
        'password_starts_with' => substr($client->password, 0, 7),
        'password_is_hashed' => str_starts_with($client->password, '$2y$'),
        'password_check_result' => $passwordCheck,
        'input_password' => $request->password
    ]);
});

Route::post('/signup', [AuthController::class,'signup']);

Route::post('/login', [AuthController::class, 'login']);


Route::post('/refresh', [AuthController::class, 'refresh']);


Route::middleware('auth:api')->group(function () {
    
    // Profile endpoint - returns authenticated user with image URL
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        
        // Add full image URL if image exists
        if ($user->image) {
            $user->image_url = url('storage/' . $user->image);
        }
        
        return response()->json($user);
    });
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Notes CRUD Routes
    Route::get('/notes', [App\Http\Controllers\NoteController::class, 'index']);
    Route::post('/notes', [App\Http\Controllers\NoteController::class, 'store']);
    Route::put('/notes/{id}', [App\Http\Controllers\NoteController::class, 'update']);
    Route::delete('/notes/{id}', [App\Http\Controllers\NoteController::class, 'destroy']);
    Route::get('/notes/search', [App\Http\Controllers\NoteController::class, 'search']);
});