<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Client;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Signup Method
     * নতুন Client registration এর জন্য
     */
    public function signup(Request $request)
    {
        // Validation - সব required field check করছি
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email', // Email unique হতে হবে clients table এ
            'phone' => 'required|digits:11', // 11 digit phone number
            'occupation' => 'required|string|max:255',
            'password' => 'required|string|min:6', // Minimum 6 characters
            'image' => 'nullable|image|max:2048' // Image optional, max 2MB
        ]);

        // Image upload handling - যদি image থাকে তাহলে store করছি
        $imagePath = null;
        if ($request->hasFile('image')) {
            // public storage এ uploads folder এ save হবে
            $imagePath = $request->file('image')->store('uploads', 'public');
        }

        // Client create করছি database এ
        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'occupation' => $request->occupation,
            'password' => Hash::make($request->password), // Password হ্যাশ করে save করছি (plain text নয়)
            'image' => $imagePath
        ]);

        // Success response পাঠাচ্ছি created (201) status code সহ
        return response()->json([
            'status' => 'success',
            'message' => 'Signup successful!',
            'client' => $client
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        // প্রথমে client কে email দিয়ে খুঁজছি
        $client = Client::where('email', $request->email)->first();
        info('Client fetched for login', ['client_id' => $client ? $client->id : null]);
        


        // যদি client না থাকে অথবা password সঠিক না হয়
        if (!$client || !Hash::check($request->password, $client->password)) {
            return response()->json([
                'status'=>'error',
                'message'=>'Invalid credentials or Wrong password'
            ],401);
        }

        // Passport Password Grant Token Request
        try {
            $tokenRequest = Request::create('/oauth/token', 'POST', [
                'grant_type' => 'password',
                'client_id' => config('passport.password_grant_client.id'),
                'client_secret' => config('passport.password_grant_client.secret'),
                'username' => $request->email,
                'password' => $request->password,
                'scope' => '*',
            ]);

            $response = app()->handle($tokenRequest);
            $data = json_decode($response->getContent());

            Log::info('OAuth Token Response: ' . json_encode($data));

            if ($response->getStatusCode() !== 200) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unable to create token',
                    'error' => $data
                ], 500);
            }

            return response()->json([
                'status' => 'success',
                'access_token' => $data->access_token,
                'refresh_token' => $data->refresh_token,
                'message' => 'Login successful',
                'token_type' => 'Bearer',
                'expires_in' => $data->expires_in,
                'client' => $client
            ]);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function logout(Request $request)
    {
        // Revoke the user's current token
        $request->user()->token()->revoke();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }


    /**
     * Refresh Token Method
     * পুরানো access token expire হয়ে গেলে নতুন token পাওয়ার জন্য
     */
    public function refresh(Request $request)
{
    $request->validate([
        'refresh_token' => 'required'
    ]);

    $hashed = hash('sha256', $request->refresh_token);

    $token = DB::table('refresh_tokens')
        ->where('token', $hashed)
        ->where('expires_at', '>', now())
        ->first();

    if (!$token) {
        return response()->json([
            'status' => 'error',
            'message' => 'Invalid or expired refresh token'
        ], 401);
    }

    $client = Client::find($token->client_id);

    if (!$client) {
        return response()->json([
            'status' => 'error',
            'message' => 'Client not found'
        ], 404);
    }

    // Old refresh delete
    DB::table('refresh_tokens')
        ->where('id', $token->id)
        ->delete();

    // New access token
    $newAccessToken = $client->createToken('access_token')->plainTextToken;

    // New refresh token
    $newRefreshToken = Str::random(60);

    DB::table('refresh_tokens')->insert([
        'client_id' => $client->id,
        'token' => hash('sha256', $newRefreshToken),
        'expires_at' => now()->addDays(1),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json([
        'status' => 'success',
        'access_token' => $newAccessToken,
        'refresh_token' => $newRefreshToken,
        'token_type' => 'Bearer'
    ]);
}

}
