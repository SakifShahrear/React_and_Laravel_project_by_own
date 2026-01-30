<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SanctumAuthController;
use App\Http\Controllers\NoteController;

/*
|--------------------------------------------------------------------------
| API Routes - Sanctum Stateful Authentication
|--------------------------------------------------------------------------
| Using cookie-based authentication with Sanctum
| No Bearer tokens needed - authentication via session cookies
*/

// Public routes - No authentication required
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Authentication routes - Public (no auth required)
Route::post('/register', [SanctumAuthController::class, 'register']);
Route::post('/signup', [SanctumAuthController::class, 'register']); // Alias for /register
Route::post('/login', [SanctumAuthController::class, 'login']);

// Protected routes - Requires authentication via session cookie
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Get authenticated user
    Route::get('/user', [SanctumAuthController::class, 'user']);
    
    // Logout
    Route::post('/logout', [SanctumAuthController::class, 'logout']);
    
    // Notes CRUD Routes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::get('/notes/search', [NoteController::class, 'search']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
});
