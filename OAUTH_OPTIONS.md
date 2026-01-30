# OAuth Authentication - Options & Guide

## 📊 **Current Status**

Your KeepNote app **previously used Laravel Passport (OAuth 2.0)** but is **now using Laravel Sanctum (cookie-based)** authentication.

### **What Changed:**

| Before                                        | Now                              |
| --------------------------------------------- | -------------------------------- |
| Laravel Passport (OAuth server)               | Laravel Sanctum (Session/Cookie) |
| OAuth 2.0 Password Grant                      | Simple login with session        |
| Bearer tokens in Authorization header         | HTTPOnly cookies                 |
| Token refresh flow                            | Automatic session management     |
| `oauth_clients`, `oauth_access_tokens` tables | Just sessions                    |

---

## 🔄 **Your Options**

You have **three main options** for authentication:

### **Option 1: Keep Sanctum Stateful (Current - RECOMMENDED)**

✅ **Best for:** SPAs on same domain, mobile apps  
✅ **Security:** HTTPOnly cookies, CSRF protection  
✅ **Simplicity:** No token management needed  
✅ **What you have now:** Already implemented and working

### **Option 2: Switch Back to Passport (OAuth)**

⚠️ **Best for:** Public APIs, third-party integrations, multiple clients  
⚠️ **Complexity:** More setup, token management required  
⚠️ **Your code:** Still exists in `routes/api_backup.php` and `AuthController.php`

### **Option 3: Use Both (Hybrid)**

🔀 **Best for:** Need both SPA authentication AND public API  
🔀 **Example:** Your web app uses Sanctum, mobile app uses Passport  
🔀 **Setup:** Keep both, use different routes/guards

### **Option 4: Social OAuth (Login with Google/Facebook)**

🌐 **Best for:** Third-party login (Google, Facebook, GitHub)  
🌐 **Works with:** Both Sanctum and Passport  
🌐 **Package:** Laravel Socialite

---

## 🎯 **Detailed Comparison**

### **Laravel Sanctum (What You Have Now)**

**When to Use:**

- SPA (React, Vue, Angular) on same domain/subdomain
- Mobile apps that can store cookies
- First-party authentication only
- Simple authentication needs

**Pros:**

- ✅ Simple setup
- ✅ No token storage needed
- ✅ HTTPOnly cookies (secure)
- ✅ Automatic CSRF protection
- ✅ Less database overhead

**Cons:**

- ❌ Same domain/subdomain only
- ❌ Not for third-party API access
- ❌ No standard OAuth flows

**Example Usage:**

```javascript
// Get CSRF cookie
await axios.get("/sanctum/csrf-cookie");

// Login
await axios.post("/api/login", { email, password });

// Make request (cookie sent automatically)
await axios.get("/api/notes");
```

---

### **Laravel Passport (What You Had Before)**

**When to Use:**

- Public API for third-party developers
- Multiple client applications
- Need OAuth 2.0 standard flows
- Cross-domain API access
- Mobile apps that prefer tokens

**Pros:**

- ✅ Full OAuth 2.0 server
- ✅ Multiple grant types (password, client credentials, etc.)
- ✅ Token scopes for permissions
- ✅ Works anywhere (cross-domain)
- ✅ Industry standard

**Cons:**

- ❌ More complex setup
- ❌ Manual token storage
- ❌ Token refresh logic needed
- ❌ More database tables/overhead

**Your Previous Setup:**

```javascript
// Login and get token
const response = await axios.post("/oauth/token", {
    grant_type: "password",
    client_id: "YOUR_CLIENT_ID",
    client_secret: "YOUR_CLIENT_SECRET",
    username: email,
    password: password,
});

const token = response.data.access_token;
localStorage.setItem("token", token);

// Use token in requests
axios.get("/api/notes", {
    headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🔧 **How to Switch Back to Passport (If Needed)**

If you need OAuth 2.0 functionality, here's how to restore it:

### **Step 1: Restore Routes**

```bash
cp routes/api_backup.php routes/api.php
```

### **Step 2: Use Old AuthController**

The old `AuthController` with Passport is still in:

```
app/Http/Controllers/AuthController.php
```

### **Step 3: Update Model**

```php
// In app/Models/Client.php
use Laravel\Passport\HasApiTokens;  // Change back to Passport
```

### **Step 4: Update Middleware**

```php
// In routes/api.php
Route::middleware('auth:api')->group(function () {
    // Your protected routes
});
```

### **Step 5: Configure Passport**

Your Passport config still exists in:

- `config/passport.php` - Client credentials
- Database tables: `oauth_clients`, `oauth_access_tokens`, etc.

---

## 🌐 **Option 4: Social OAuth (Login with Google/Facebook)**

You can add social login **with either Sanctum or Passport**:

### **Installation**

```bash
composer require laravel/socialite
```

### **Example: Google Login with Sanctum**

**1. Add Google credentials to `.env`:**

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost/KeepNote/public/auth/google/callback
```

**2. Configure in `config/services.php`:**

```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

**3. Create Social Auth Controller:**

```php
<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    // Redirect to Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    // Handle callback
    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();

        // Find or create user
        $client = Client::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'phone' => '00000000000', // Default
                'occupation' => 'Unknown',
                'password' => bcrypt(Str::random(16)),
                'image' => $googleUser->getAvatar(),
            ]
        );

        // Login via Sanctum
        Auth::guard('web')->login($client);

        return redirect('/dashboard'); // or your frontend URL
    }
}
```

**4. Add Routes:**

```php
// In routes/web.php
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
```

---

## 🔀 **Option 3: Use Both (Hybrid Approach)**

You can use **both** Sanctum and Passport simultaneously:

### **Use Case:**

- **Sanctum:** For your web SPA (frontend)
- **Passport:** For public API or mobile apps

### **Setup:**

**1. Keep Both Packages:**

```json
// composer.json
{
    "require": {
        "laravel/sanctum": "^4.0",
        "laravel/passport": "^12.0"
    }
}
```

**2. Configure Different Guards:**

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'sanctum' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

**3. Use Different Routes:**

```php
// routes/api.php

// Sanctum routes for web SPA
Route::prefix('v1')->group(function () {
    Route::post('/login', [SanctumAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [SanctumAuthController::class, 'user']);
        Route::get('/notes', [NoteController::class, 'index']);
    });
});

// Passport routes for public API
Route::prefix('v2')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', [AuthController::class, 'profile']);
        Route::get('/notes', [NoteController::class, 'index']);
    });
});
```

**4. Update Model:**

```php
// app/Models/Client.php
use Laravel\Sanctum\HasApiTokens as SanctumHasApiTokens;
use Laravel\Passport\HasApiTokens as PassportHasApiTokens;

class Client extends Authenticatable
{
    use SanctumHasApiTokens, PassportHasApiTokens, HasFactory;
    // ...
}
```

---

## 📋 **Decision Matrix**

### **Choose Sanctum Stateful (Current) If:**

- ✅ Your frontend is a SPA on the same domain
- ✅ You don't need public API access
- ✅ You want simple authentication
- ✅ Security is a priority (HTTPOnly cookies)

### **Choose Passport If:**

- ✅ You're building a public API
- ✅ Third-party apps need to access your API
- ✅ You need OAuth 2.0 standard compliance
- ✅ You need token scopes and permissions
- ✅ Cross-domain API access required

### **Choose Both If:**

- ✅ You have a web SPA AND a mobile app
- ✅ You need internal auth (Sanctum) + public API (Passport)
- ✅ Different clients have different needs

### **Add Social OAuth If:**

- ✅ You want "Login with Google/Facebook"
- ✅ Reduce friction for user registration
- ✅ Works with either Sanctum or Passport

---

## 🚀 **Recommendation**

Based on your KeepNote app:

### **RECOMMENDED: Keep Sanctum (Current Setup)**

**Why:**

1. ✅ KeepNote is a personal note-taking app (not a public API)
2. ✅ Simpler to maintain
3. ✅ More secure with HTTPOnly cookies
4. ✅ Your frontend is likely on the same domain
5. ✅ No need for third-party API access

### **Consider Adding: Social OAuth**

Add Google/Facebook login for better UX while keeping Sanctum for session management.

### **Only Switch to Passport If:**

- You need to provide API access to third-party developers
- You're building a mobile app that requires token-based auth
- You need OAuth 2.0 compliance

---

## 🔍 **Your Current Setup**

Here's what you have RIGHT NOW:

### **Active:**

- ✅ Laravel Sanctum (stateful/cookie-based)
- ✅ Routes: `/api/login`, `/api/register`, `/api/logout`
- ✅ Middleware: `auth:sanctum`
- ✅ Test page: `public/test-auth.html`

### **Available but Inactive:**

- 📦 Laravel Passport (still installed)
- 📦 Old routes in `routes/api_backup.php`
- 📦 Old `AuthController` with OAuth logic
- 📦 OAuth database tables (`oauth_clients`, `oauth_access_tokens`)
- 📦 Passport config in `config/passport.php`

---

## 📚 **Additional Resources**

### **Laravel Documentation:**

- Sanctum: https://laravel.com/docs/11.x/sanctum
- Passport: https://laravel.com/docs/11.x/passport
- Socialite: https://laravel.com/docs/11.x/socialite

### **Your Project Docs:**

- [SANCTUM_AUTH_GUIDE.md](SANCTUM_AUTH_GUIDE.md) - Current implementation guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup
- [routes/api_backup.php](routes/api_backup.php) - Old OAuth routes

---

## ❓ **Need Help Deciding?**

Ask yourself:

1. **Who will use my API?**
    - Just my frontend → Sanctum ✅
    - Public/third-party → Passport

2. **Where is my frontend?**
    - Same domain → Sanctum ✅
    - Different domain → Passport

3. **Do I need OAuth 2.0 compliance?**
    - No → Sanctum ✅
    - Yes → Passport

4. **How complex can I handle?**
    - Simple → Sanctum ✅
    - Complex is fine → Passport

---

## 💡 **Quick Answer**

**For KeepNote (a personal note app):**

🎯 **Stick with Sanctum (what you have now)**  
It's simpler, more secure, and perfect for your use case.

**Optional:** Add social login (Google/Facebook) using Laravel Socialite.

**Don't switch to Passport unless:** You're building a public API or need OAuth 2.0 standard features.

---

**Need to restore OAuth?** Let me know and I'll help you switch back!  
**Want to add social login?** I can set that up too!  
**Happy with Sanctum?** You're all set! 🎉
