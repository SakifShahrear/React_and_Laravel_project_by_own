# 🔐 Laravel Sanctum + React Authentication Setup Guide

## লারাভেল স্যাংক্টাম + রিয়্যাক্ট অথেন্টিকেশন সেটআপ গাইড

---

## 📚 Table of Contents | সূচিপত্র

1. [What We Did | আমরা কী করেছি](#what-we-did)
2. [How It Works | এটি কীভাবে কাজ করে](#how-it-works)
3. [Files Changed | যেসব ফাইল পরিবর্তন করা হয়েছে](#files-changed)
4. [Complete Workflow | সম্পূর্ণ কাজের ধারা](#complete-workflow)
5. [Backend Requirements | বেকএন্ড প্রয়োজনীয়তা](#backend-requirements)

---

## 🎯 What We Did | আমরা কী করেছি

### Simple Explanation (English):

We connected your **React frontend** (what users see) with your **Laravel backend** (where data is stored) in a **secure way**. Think of it like putting a **lock 🔒** on your house - only people with the right **key 🔑** can enter.

### সহজ ব্যাখ্যা (বাংলা):

আমরা তোমার **React ফ্রন্টএন্ড** (যা ইউজার দেখে) কে **Laravel বেকএন্ড** (যেখানে ডেটা জমা থাকে) এর সাথে একটি **নিরাপদ উপায়ে** সংযুক্ত করেছি। এটা এমন যেন তোমার **বাড়িতে তালা 🔒** লাগানো - শুধু সঠিক **চাবি 🔑** যার আছে সেই ঢুকতে পারবে।

---

## 🔄 How It Works | এটি কীভাবে কাজ করে

### Step-by-Step Process | ধাপে ধাপে প্রক্রিয়া

#### 1. **CSRF Token (Security Cookie) | সিএসআরএফ টোকেন (নিরাপত্তা কুকি)**

**English:**

- Before logging in, we ask the server: "Give me a security cookie 🍪"
- This cookie is like a **secret handshake** that proves we're safe

**বাংলা:**

- লগইন করার আগে, আমরা সার্ভারকে জিজ্ঞেস করি: "আমাকে একটা নিরাপত্তা কুকি 🍪 দাও"
- এই কুকি হলো একটা **গোপন হ্যান্ডশেক** যা প্রমাণ করে আমরা নিরাপদ

```
📱 Frontend → 🖥️ Backend
"Can I have a security cookie please?"
"এটি কি আমি একটি সিকিউরিটি কুকি পেতে পারি?"

🖥️ Backend → 📱 Frontend
"Here's your cookie! 🍪"
"এই নাও তোমার কুকি! 🍪"
```

#### 2. **Login Process | লগইন প্রক্রিয়া**

**English:**

- User types email + password
- We send it to the backend **WITH the cookie 🍪**
- Backend checks: "Email correct? Password correct? Cookie correct?"
- If all correct ✅: Backend sends **Access Token** (like a VIP pass 🎫)

**বাংলা:**

- ইউজার ইমেইল + পাসওয়ার্ড টাইপ করে
- আমরা এটা বেকএন্ডে পাঠাই **কুকি 🍪 সহ**
- বেকএন্ড চেক করে: "ইমেইল ঠিক? পাসওয়ার্ড ঠিক? কুকি ঠিক?"
- সব ঠিক থাকলে ✅: বেকএন্ড **এক্সেস টোকেন** দেয় (একটা ভিআইপি পাসের মতো 🎫)

```
📱 Frontend → 🖥️ Backend
Email: user@example.com
Password: ****
Cookie: 🍪

🖥️ Backend → 📱 Frontend
"Login successful! Here's your VIP pass 🎫"
"লগইন সফল! এই নাও তোমার ভিআইপি পাস 🎫"
```

#### 3. **Accessing Protected Data | সুরক্ষিত ডেটা অ্যাক্সেস করা**

**English:**

- Every time we want user data or notes, we show the **VIP pass 🎫**
- Backend checks the pass and gives us the data

**বাংলা:**

- যখনই আমরা ইউজার ডেটা বা নোট চাই, আমরা **ভিআইপি পাস 🎫** দেখাই
- বেকএন্ড পাস চেক করে এবং আমাদের ডেটা দেয়

```
📱 Frontend → 🖥️ Backend
"I want my profile data. Here's my VIP pass 🎫"
"আমি আমার প্রোফাইল ডেটা চাই। এই নাও আমার ভিআইপি পাস 🎫"

🖥️ Backend → 📱 Frontend
"Pass is valid! Here's your data 📦"
"পাস ঠিক আছে! এই নাও তোমার ডেটা 📦"
```

---

## 📁 Files Changed | যেসব ফাইল পরিবর্তন করা হয়েছে

### 1. **API Configuration File | এপিআই কনফিগারেশন ফাইল**

**File Path:** `src/api.js`

**What it does | এটি কী করে:**

- Manages all communication with backend | বেকএন্ডের সাথে সব যোগাযোগ পরিচালনা করে
- Handles CSRF tokens automatically | সিএসআরএফ টোকেন স্বয়ংক্রিয়ভাবে পরিচালনা করে
- Adds VIP pass (token) to every request | প্রতিটি রিকোয়েস্টে ভিআইপি পাস (টোকেন) যোগ করে

**Key Features | প্রধান বৈশিষ্ট্য:**

```javascript
// Helper function to read cookies
// কুকি পড়ার জন্য হেল্পার ফাংশন
function getCookie(name) { ... }

// Main API instance
// মূল এপিআই ইনস্ট্যান্স
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true  // 🔑 Important for cookies
});

// Auth object for easy use
// সহজ ব্যবহারের জন্য Auth অবজেক্ট
export const auth = {
  getCsrf(),      // Get security cookie | নিরাপত্তা কুকি পাও
  login(),        // Login user | ইউজার লগইন করো
  register(),     // Register new user | নতুন ইউজার রেজিস্টার করো
  signup(),       // Signup (same as register) | সাইনআপ (রেজিস্টারের মতোই)
  logout(),       // Logout user | ইউজার লগআউট করো
  getUser()       // Get user info | ইউজারের তথ্য পাও
};
```

---

### 2. **Login Page | লগইন পেজ**

**File Path:** `src/pages/Login.jsx`

**What changed | কী পরিবর্তন হয়েছে:**

**Before | আগে:**

```javascript
// Manual axios calls - complicated!
// ম্যানুয়াল axios কল - জটিল!
await axios.get('http://localhost:8000/sanctum/csrf-cookie');
await axios.post('http://localhost:8000/api/login', {...});
```

**After | পরে:**

```javascript
// Simple one-line call!
// সহজ এক লাইনের কল!
const response = await auth.login(email, password);
```

**Benefits | সুবিধা:**

- ✅ Cleaner code | পরিষ্কার কোড
- ✅ Automatic CSRF handling | স্বয়ংক্রিয় সিএসআরএফ পরিচালনা
- ✅ Less errors | কম ভুল
- ✅ Easy to understand | বুঝতে সহজ

---

### 3. **Signup Page | সাইনআপ পেজ**

**File Path:** `src/pages/Signup.jsx`

**What changed | কী পরিবর্তন হয়েছে:**

1. **Password field name | পাসওয়ার্ড ফিল্ডের নাম:**

   ```javascript
   // Before: confirmPassword ❌
   // After: password_confirmation ✅ (Laravel expects this!)

   // আগে: confirmPassword ❌
   // পরে: password_confirmation ✅ (লারাভেল এটাই চায়!)
   ```

2. **Used auth.signup() | auth.signup() ব্যবহার করা:**

   ```javascript
   const response = await auth.signup(formData);
   ```

3. **Correct endpoint | সঠিক এন্ডপয়েন্ট:**
   - Changed from `/api/signup` ❌
   - To `/api/register` ✅
   - পরিবর্তন `/api/signup` ❌ থেকে
   - `/api/register` ✅ এ

---

### 4. **Profile Page | প্রোফাইল পেজ**

**File Path:** `src/pages/Profile.jsx`

**What changed | কী পরিবর্তন হয়েছে:**

1. **Fixed API endpoints | এপিআই এন্ডপয়েন্ট ঠিক করা:**

   ```javascript
   // Before | আগে:
   api.get("/profile"); // ❌ 404 Error
   api.get("/notes"); // ❌ Wrong

   // After | পরে:
   api.get("/api/user"); // ✅ Correct!
   api.get("/api/notes"); // ✅ Correct!
   ```

2. **Better error handling | ভালো এরর হ্যান্ডলিং:**
   ```javascript
   if (err.response?.status === 401) {
     alert("Session expired. Please login again.");
     navigate("/login");
   }
   ```

---

### 5. **KeepNote Page (Create/Edit Notes) | কিপনোট পেজ (নোট তৈরি/এডিট)**

**File Path:** `src/pages/KeepNote.jsx`

**What changed | কী পরিবর্তন হয়েছে:**

```javascript
// Before | আগে:
api.post('/notes', {...})      // ❌
api.put('/notes/${id}', {...}) // ❌

// After | পরে:
api.post('/api/notes', {...})      // ✅
api.put('/api/notes/${id}', {...}) // ✅
```

---

### 6. **Vite Configuration | ভিটে কনফিগারেশন**

**File Path:** `vite.config.js`

**What it does | এটি কী করে:**

- Acts as a bridge between frontend and backend
- ফ্রন্টএন্ড এবং বেকএন্ডের মধ্যে সেতু হিসেবে কাজ করে

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    },
    '/sanctum': {  // ← Added this for CSRF cookies
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

---

## 🔄 Complete Workflow | সম্পূর্ণ কাজের ধারা

### User Signup Flow | ইউজার সাইনআপ ফ্লো

```
Step 1: User fills signup form
ধাপ ১: ইউজার সাইনআপ ফর্ম পূরণ করে
📝 Name, Email, Phone, Password, etc.

↓

Step 2: Click "Sign Up" button
ধাপ ২: "সাইন আপ" বাটনে ক্লিক
🖱️

↓

Step 3: Frontend gets CSRF cookie from backend
ধাপ ৩: ফ্রন্টএন্ড বেকএন্ড থেকে সিএসআরএফ কুকি নেয়
📱 → 🖥️ GET /sanctum/csrf-cookie
🍪 Cookie received!

↓

Step 4: Wait 100ms (let cookie settle)
ধাপ ৪: ১০০ মিলিসেকেন্ড অপেক্ষা করো (কুকি সেট হতে দাও)
⏱️ Wait...

↓

Step 5: Send registration data WITH cookie
ধাপ ৫: কুকি সহ রেজিস্ট্রেশন ডেটা পাঠাও
📱 → 🖥️ POST /api/register
{
  name: "...",
  email: "...",
  password: "...",
  password_confirmation: "...",
  Cookie: 🍪
}

↓

Step 6: Backend validates and creates user
ধাপ ৬: বেকএন্ড ভ্যালিডেট করে এবং ইউজার তৈরি করে
🖥️ ✅ User created!

↓

Step 7: Redirect to login page
ধাপ ৭: লগইন পেজে রিডাইরেক্ট করো
🔄 Navigate to /login
```

---

### User Login Flow | ইউজার লগইন ফ্লো

```
Step 1: User enters email & password
ধাপ ১: ইউজার ইমেইল ও পাসওয়ার্ড দেয়
📝 Email + Password

↓

Step 2: Click "Login" button
ধাপ ২: "লগইন" বাটনে ক্লিক
🖱️

↓

Step 3: auth.login() is called
ধাপ ৩: auth.login() কল হয়
🔧 Function called

↓

Step 4: Get CSRF cookie (automatic)
ধাপ ৪: সিএসআরএফ কুকি নাও (স্বয়ংক্রিয়)
📱 → 🖥️ GET /sanctum/csrf-cookie
🍪 Cookie received!

↓

Step 5: Wait 100ms
ধাপ ৫: ১০০ মিলিসেকেন্ড অপেক্ষা করো
⏱️ Wait...

↓

Step 6: Send login request WITH cookie
ধাপ ৬: কুকি সহ লগইন রিকোয়েস্ট পাঠাও
📱 → 🖥️ POST /api/login
{
  email: "...",
  password: "...",
  Cookie: 🍪
}

↓

Step 7: Backend checks credentials
ধাপ ৭: বেকএন্ড ক্রেডেন্শিয়াল চেক করে
🖥️
  ✓ Email correct?
  ✓ Password correct?
  ✓ Cookie correct?

↓

Step 8: Backend sends Access Token
ধাপ ৮: বেকএন্ড এক্সেস টোকেন পাঠায়
🎫 access_token: "abc123..."
🎫 refresh_token: "xyz789..."

↓

Step 9: Frontend saves tokens to localStorage
ধাপ ৯: ফ্রন্টএন্ড টোকেন localStorage এ সেভ করে
💾 Saved!

↓

Step 10: Redirect to Profile page
ধাপ ১০: প্রোফাইল পেজে রিডাইরেক্ট করো
🔄 Navigate to /profile
```

---

### Loading Profile Data Flow | প্রোফাইল ডেটা লোড ফ্লো

```
Step 1: Profile page loads
ধাপ ১: প্রোফাইল পেজ লোড হয়
📄 Page mounted

↓

Step 2: useEffect() runs automatically
ধাপ ২: useEffect() স্বয়ংক্রিয়ভাবে চলে
⚙️ Fetch data!

↓

Step 3: Request user data
ধাপ ৩: ইউজার ডেটা রিকোয়েস্ট করো
📱 → 🖥️ GET /api/user
Headers: {
  Authorization: "Bearer abc123...",  🎫 VIP Pass
  X-XSRF-TOKEN: "...",                🍪 Cookie
}

↓

Step 4: Backend validates token
ধাপ ৪: বেকএন্ড টোকেন ভ্যালিডেট করে
🖥️ ✓ Token valid?

↓

Step 5: Backend sends user data
ধাপ ৫: বেকএন্ড ইউজার ডেটা পাঠায়
📦 {
  name: "...",
  email: "...",
  phone: "...",
  occupation: "..."
}

↓

Step 6: Frontend displays data
ধাপ ৬: ফ্রন্টএন্ড ডেটা দেখায়
✨ Profile loaded!
Name, Email, Phone visible!
```

---

### Creating/Editing Notes Flow | নোট তৈরি/এডিট ফ্লো

```
Step 1: User clicks "+ Add Note"
ধাপ ১: ইউজার "+ এড নোট" এ ক্লিক করে
🖱️

↓

Step 2: Navigate to /keepnote
ধাপ ২: /keepnote এ নেভিগেট করো
🔄

↓

Step 3: User writes title & note
ধাপ ৩: ইউজার টাইটেল ও নোট লেখে
📝 Title + Text

↓

Step 4: Click "Save Note"
ধাপ ৪: "সেভ নোট" এ ক্লিক করো
💾

↓

Step 5: Send note to backend WITH token
ধাপ ৫: টোকেন সহ নোট বেকএন্ডে পাঠাও
📱 → 🖥️ POST /api/notes
Headers: { Authorization: "Bearer abc123..." } 🎫
Body: { title: "...", text: "...", date: "...", time: "..." }

↓

Step 6: Backend saves note to database
ধাপ ৬: বেকএন্ড ডাটাবেসে নোট সেভ করে
🖥️ 💾 Saved to database!

↓

Step 7: Success! Navigate back to profile
ধাপ ৭: সফল! প্রোফাইলে ফিরে যাও
✅ Note created!
🔄 Navigate to /profile
```

---

## 🖥️ Backend Requirements | বেকএন্ড প্রয়োজনীয়তা

### Laravel Routes Required | লারাভেল রুট প্রয়োজন

**File:** `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;

// Public routes (no authentication needed)
// পাবলিক রুট (অথেন্টিকেশন দরকার নেই)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (need authentication)
// সুরক্ষিত রুট (অথেন্টিকেশন দরকার)
Route::middleware('auth:api')->group(function () {

    // Get logged-in user info
    // লগইন ইউজারের তথ্য পাও
    Route::get('/user', [AuthController::class, 'user']);

    // Logout
    // লগআউট
    Route::post('/logout', [AuthController::class, 'logout']);

    // Notes CRUD
    // নোট ক্রাড
    Route::get('/notes', [NoteController::class, 'index']);         // Get all notes | সব নোট পাও
    Route::post('/notes', [NoteController::class, 'store']);        // Create note | নোট তৈরি করো
    Route::put('/notes/{id}', [NoteController::class, 'update']);   // Update note | নোট আপডেট করো
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']); // Delete note | নোট ডিলিট করো
});
```

---

### Laravel Environment Settings | লারাভেল এনভায়রনমেন্ট সেটিংস

**File:** `.env`

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost

SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000
```

---

### CORS Configuration | কর্স কনফিগারেশন

**File:** `config/cors.php`

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
    ],

    'supports_credentials' => true, // 🔑 Very important!
];
```

---

### Sanctum Configuration | স্যাংক্টাম কনফিগারেশন

**File:** `config/sanctum.php`

```php
<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
        'localhost,localhost:3000,localhost:5173,127.0.0.1'
    )),

    // Other settings...
];
```

---

## 🎯 Summary | সারসংক্ষেপ

### What We Built | আমরা কী তৈরি করেছি

**English:**
We created a **secure authentication system** where:

- Users can register (signup)
- Users can login
- Users can view their profile
- Users can create, read, update, and delete notes
- All data is **protected** with tokens and cookies

**বাংলা:**
আমরা একটি **নিরাপদ অথেন্টিকেশন সিস্টেম** তৈরি করেছি যেখানে:

- ইউজাররা রেজিস্টার (সাইনআপ) করতে পারে
- ইউজাররা লগইন করতে পারে
- ইউজাররা তাদের প্রোফাইল দেখতে পারে
- ইউজাররা নোট তৈরি, পড়া, আপডেট এবং ডিলিট করতে পারে
- সব ডেটা টোকেন এবং কুকি দিয়ে **সুরক্ষিত**

---

### Key Files Modified | প্রধান ফাইল পরিবর্তিত

| File                     | Purpose                          | উদ্দেশ্য                     |
| ------------------------ | -------------------------------- | ---------------------------- |
| `src/api.js`             | API configuration & auth methods | এপিআই কনফিগারেশন ও অথ ম্যাথড |
| `src/pages/Login.jsx`    | Login page                       | লগইন পেজ                     |
| `src/pages/Signup.jsx`   | Signup page                      | সাইনআপ পেজ                   |
| `src/pages/Profile.jsx`  | User profile & notes             | ইউজার প্রোফাইল ও নোট         |
| `src/pages/KeepNote.jsx` | Create/Edit notes                | নোট তৈরি/এডিট                |
| `vite.config.js`         | Dev server proxy                 | ডেভ সার্ভার প্রক্সি          |

---

### Important Endpoints | গুরুত্বপূর্ণ এন্ডপয়েন্ট

| Method | Endpoint               | Purpose             | উদ্দেশ্য             |
| ------ | ---------------------- | ------------------- | -------------------- |
| GET    | `/sanctum/csrf-cookie` | Get security cookie | নিরাপত্তা কুকি পাও   |
| POST   | `/api/register`        | Register new user   | নতুন ইউজার রেজিস্টার |
| POST   | `/api/login`           | Login user          | ইউজার লগইন           |
| GET    | `/api/user`            | Get user profile    | ইউজার প্রোফাইল পাও   |
| POST   | `/api/logout`          | Logout user         | ইউজার লগআউট          |
| GET    | `/api/notes`           | Get all notes       | সব নোট পাও           |
| POST   | `/api/notes`           | Create note         | নোট তৈরি করো         |
| PUT    | `/api/notes/{id}`      | Update note         | নোট আপডেট করো        |
| DELETE | `/api/notes/{id}`      | Delete note         | নোট ডিলিট করো        |

---

## 🚀 How to Test | কীভাবে টেস্ট করবে

### Step 1: Start Backend | ধাপ ১: বেকএন্ড চালু করো

```bash
cd E:\Laravel\htdocs\KeepNote
php artisan serve
```

**Backend will run on:** `http://localhost:8000`

---

### Step 2: Start Frontend | ধাপ ২: ফ্রন্টএন্ড চালু করো

```bash
cd E:\KeepNote_frontend\myKeepNote
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

### Step 3: Test Signup | ধাপ ৩: সাইনআপ টেস্ট করো

1. Go to: `http://localhost:5173/signup`
2. Fill the form
3. Click "Sign Up"
4. Check browser console (F12) for logs

---

### Step 4: Test Login | ধাপ ৪: লগইন টেস্ট করো

1. Go to: `http://localhost:5173/login`
2. Enter email & password
3. Click "Login"
4. Should redirect to Profile page

---

### Step 5: Test Profile | ধাপ ৫: প্রোফাইল টেস্ট করো

1. After login, you'll see profile page
2. Check if Name, Email, Phone, Occupation are displayed
3. Check console for: `✅ Profile data: {...}`

---

### Step 6: Test Notes | ধাপ ৬: নোট টেস্ট করো

1. Click "+ Add Note"
2. Write title & note
3. Click "Save Note"
4. Should redirect back to profile
5. Your note should appear in the list!

---

## 🐛 Common Errors & Solutions | সাধারণ এরর ও সমাধান

### Error 1: 404 Not Found

**English:** Backend route doesn't exist
**বাংলা:** বেকএন্ড রুট নেই

**Solution:**
Check `routes/api.php` and make sure all routes are defined

---

### Error 2: 419 CSRF Token Mismatch

**English:** CSRF cookie not sent properly
**বাংলা:** সিএসআরএফ কুকি ঠিকমতো পাঠানো হয়নি

**Solution:**
Make sure `withCredentials: true` is set in axios config

---

### Error 3: 401 Unauthorized

**English:** Access token is invalid or expired
**বাংলা:** এক্সেস টোকেন ইনভ্যালিড বা এক্সপায়ার্ড

**Solution:**
Login again to get a new token

---

### Error 4: Authorization: Bearer undefined

**English:** Token not saved in localStorage
**বাংলা:** টোকেন localStorage এ সেভ হয়নি

**Solution:**
Check login response and make sure tokens are being saved:

```javascript
localStorage.setItem("access_token", response.data.access_token);
```

---

## 📝 Important Notes | গুরুত্বপূর্ণ নোট

### English:

1. **Always get CSRF cookie before login/signup**
2. **Use `/api/user` endpoint, not `/api/profile`**
3. **Backend must have all routes defined**
4. **Check browser console for errors (F12)**
5. **Make sure both frontend & backend are running**

### বাংলা:

1. **লগইন/সাইনআপের আগে সবসময় সিএসআরএফ কুকি নাও**
2. **`/api/user` এন্ডপয়েন্ট ব্যবহার করো, `/api/profile` না**
3. **বেকএন্ডে সব রুট ডিফাইন থাকতে হবে**
4. **ব্রাউজার কনসোলে এরর চেক করো (F12)**
5. **নিশ্চিত করো ফ্রন্টএন্ড ও বেকএন্ড দুটোই চলছে**

---

## 🎉 Congratulations! | অভিনন্দন!

**English:**
You now have a fully working authentication system with Laravel Sanctum and React! 🚀

**বাংলা:**
তোমার এখন লারাভেল স্যাংক্টাম এবং রিয়্যাক্ট দিয়ে একটি সম্পূর্ণ কাজ করা অথেন্টিকেশন সিস্টেম আছে! 🚀

---

## 📞 Need Help? | সাহায্য দরকার?

**English:**
If something doesn't work:

1. Check the browser console (F12)
2. Check the Laravel logs
3. Make sure all routes are correct
4. Verify backend is running on port 8000
5. Verify frontend is running on port 5173

**বাংলা:**
যদি কিছু কাজ না করে:

1. ব্রাউজার কনসোল চেক করো (F12)
2. লারাভেল লগ চেক করো
3. নিশ্চিত করো সব রুট ঠিক আছে
4. যাচাই করো বেকএন্ড পোর্ট ৮০০০ এ চলছে
5. যাচাই করো ফ্রন্টএন্ড পোর্ট ৫১৭৩ এ চলছে

---

**Made with ❤️ | ❤️ দিয়ে তৈরি**

_Last Updated: January 30, 2026 | শেষ আপডেট: ৩০ জানুয়ারি, ২০২৬_
