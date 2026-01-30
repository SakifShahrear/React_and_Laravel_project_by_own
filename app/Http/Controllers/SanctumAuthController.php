<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Client;
use Illuminate\Validation\ValidationException;

class SanctumAuthController extends Controller
{
    /**
     * Register a new client
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'required|digits:11',
            'occupation' => 'required|string|max:255',
            'password' => 'required|string|min:6|confirmed',
            'image' => 'nullable|image|max:2048'
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 'public');
        }

        // Create client
        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'occupation' => $request->occupation,
            'password' => Hash::make($request->password),
            'image' => $imagePath
        ]);

        // Log the client in using web guard
        Auth::guard('web')->login($client);

        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful!',
            'client' => $client
        ], 201);
    }

    /**
     * Login with Sanctum stateful authentication
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $client = Client::where('email', $request->email)->first();

        if (!$client || !Hash::check($request->password, $client->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Login using web guard (creates session)
        Auth::guard('web')->login($client, $request->boolean('remember'));

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'client' => $client
        ]);
    }

    /**
     * Logout and destroy session
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated client
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
