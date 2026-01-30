# 🎓 KeepNote Authentication Guide

## সহজ বাংলা + ইংরেজি গাইড (Simple Bangla + English Guide)

---

## 📖 Table of Contents / সূচিপত্র

1. [What Happened? / কি হয়েছে?](#what-happened)
2. [Before vs After / আগে বনাম পরে](#before-vs-after)
3. [How Authentication Works Now / এখন কিভাবে কাজ করে](#how-it-works)
4. [Files Changed / যে ফাইল পরিবর্তন হয়েছে](#files-changed)
5. [How to Use / কিভাবে ব্যবহার করবেন](#how-to-use)
6. [Visual Diagrams / ছবির মাধ্যমে বুঝুন](#diagrams)

---

## 🎯 What Happened? / কি হয়েছে? {#what-happened}

### English:

Your KeepNote app had **2 types of authentication** (Passport OAuth + Sanctum). This was confusing and complicated!

I **removed OAuth/Passport** completely and kept only **Sanctum** which is:

- ✅ Simpler (easier to understand)
- ✅ More secure (safer)
- ✅ Uses cookies (automatic, no manual work)

### বাংলা:

আপনার KeepNote অ্যাপে **২ ধরনের authentication** ছিল (Passport OAuth + Sanctum)। এটা ছিল খুবই জটিল!

আমি **OAuth/Passport সম্পূর্ণ সরিয়ে** দিয়েছি এবং শুধুমাত্র **Sanctum** রেখেছি যা:

- ✅ সহজ (বুঝতে সহজ)
- ✅ বেশি নিরাপদ (আরো সিকিউর)
- ✅ কুকি ব্যবহার করে (অটোমেটিক, ম্যানুয়াল কাজ নেই)

---

## 🔄 Before vs After / আগে বনাম পরে {#before-vs-after}

### BEFORE / আগে ❌

```
┌─────────────────────────────────────────┐
│   KeepNote App (Complicated)            │
│                                         │
│  🔐 Passport OAuth (Token-based)        │
│     - Login → Get Token                 │
│     - Store Token in localStorage       │
│     - Send Token in every request       │
│     - Complex setup                     │
│                                         │
│  🔐 Sanctum (Cookie-based)              │
│     - Different system                  │
│     - Confusing which to use            │
└─────────────────────────────────────────┘
```

**Problems / সমস্যা:**

- Too complicated / অনেক জটিল
- Two different systems / দুইটা আলাদা সিস্টেম
- Hard to maintain / মেইনটেইন করা কঠিন
- More code / বেশি কোড

---

### AFTER / পরে ✅

```
┌─────────────────────────────────────────┐
│   KeepNote App (Simple & Clean)         │
│                                         │
│  🔐 Sanctum Only (Cookie-based)         │
│     - Login → Cookie saved automatically│
│     - No token storage needed           │
│     - Cookie sent automatically         │
│     - Simple & secure                   │
└─────────────────────────────────────────┘
```

**Benefits / সুবিধা:**

- Simple / সহজ
- One system only / শুধুমাত্র একটা সিস্টেম
- Easy to maintain / মেইনটেইন করা সহজ
- Less code / কম কোড
- More secure / বেশি নিরাপদ

---

## 🔧 How Authentication Works Now / এখন কিভাবে কাজ করে {#how-it-works}

### Simple Explanation / সহজ ব্যাখ্যা

Think of it like a **school ID card system** / **স্কুলের আইডি কার্ড সিস্টেম** এর মত চিন্তা করুন:

#### OLD WAY (Passport/Token) / পুরাতন পদ্ধতি:

```
1. Student goes to office / ছাত্র অফিসে যায়
2. Shows credentials / পরিচয় দেখায়
3. Gets a TOKEN (written on paper) / একটা টোকেন পায় (কাগজে লেখা)
4. Must carry paper everywhere / সব জায়গায় কাগজ নিয়ে যেতে হয়
5. Must show paper to enter each class / প্রতিটা ক্লাসে কাগজ দেখাতে হয়
6. If paper lost = cannot enter / কাগজ হারালে = ঢুকতে পারবে না
```

#### NEW WAY (Sanctum/Cookie) / নতুন পদ্ধতি:

```
1. Student goes to office / ছাত্র অফিসে যায়
2. Shows credentials / পরিচয় দেখায়
3. Gets COOKIE (invisible stamp on hand) / কুকি পায় (হাতে অদৃশ্য স্ট্যাম্প)
4. Stamp works automatically everywhere / স্ট্যাম্প সব জায়গায় অটোমেটিক কাজ করে
5. No need to show anything / কিছু দেখাতে হয় না
6. More secure / আরো নিরাপদ
```

---

## 🎨 Visual Workflow / ছবির মাধ্যমে বুঝুন {#diagrams}

### Login Process / লগইন প্রসেস

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Laravel   │         │  Database   │
│  (Frontend) │         │   (Backend) │         │             │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ 1. GET /sanctum/csrf-cookie                   │
       │─────────────────────>│                       │
       │                       │                       │
       │ 2. CSRF Token (Cookie)│                       │
       │<─────────────────────│                       │
       │                       │                       │
       │ 3. POST /api/login    │                       │
       │    {email, password}  │                       │
       │─────────────────────>│                       │
       │                       │                       │
       │                       │ 4. Check User         │
       │                       │─────────────────────>│
       │                       │                       │
       │                       │ 5. User Found ✓       │
       │                       │<─────────────────────│
       │                       │                       │
       │ 6. Session Cookie ✓   │                       │
       │<─────────────────────│                       │
       │                       │                       │
       │ ✅ LOGGED IN!         │                       │
       │                       │                       │
```

### বাংলা ব্যাখ্যা:

1. ব্রাউজার CSRF কুকি চায়
2. সার্ভার CSRF কুকি পাঠায়
3. ব্রাউজার ইমেইল ও পাসওয়ার্ড পাঠায়
4. সার্ভার ডাটাবেসে চেক করে
5. ইউজার পাওয়া গেলে
6. সার্ভার সেশন কুকি দেয়
7. ✅ লগইন সফল!

---

### Making Authenticated Requests / লগইনের পর API Call

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Laravel   │         │  Database   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ 1. GET /api/notes     │                       │
       │    [Cookie sent automatically]                │
       │─────────────────────>│                       │
       │                       │                       │
       │                       │ 2. Verify Cookie      │
       │                       │─────────────────────>│
       │                       │                       │
       │                       │ 3. User Authenticated │
       │                       │<─────────────────────│
       │                       │                       │
       │                       │ 4. Get Notes          │
       │                       │─────────────────────>│
       │                       │                       │
       │                       │ 5. Notes Data         │
       │                       │<─────────────────────│
       │                       │                       │
       │ 6. Return Notes ✓     │                       │
       │<─────────────────────│                       │
       │                       │                       │
```

### বাংলা ব্যাখ্যা:

1. ব্রাউজার নোট চায় (কুকি অটোমেটিক পাঠায়)
2. সার্ভার কুকি চেক করে
3. ইউজার যাচাই হয়
4. ডাটাবেস থেকে নোট নেয়
5. নোট পাওয়া যায়
6. ব্রাউজারে নোট পাঠায়

---

## 📁 Files Changed / যে ফাইল পরিবর্তন হয়েছে {#files-changed}

### ❌ Files DELETED / মুছে ফেলা ফাইল

```
📂 KeepNote/
├── app/Http/Controllers/
│   └── ❌ AuthController.php (Old Passport controller)
│
├── config/
│   └── ❌ passport.php (OAuth config)
│
├── routes/
│   ├── ❌ api_backup.php (Backup file)
│   └── ❌ api_sanctum.php (Temporary file)
│
└── database/migrations/
    ├── ❌ *oauth_auth_codes_table.php
    ├── ❌ *oauth_access_tokens_table.php
    ├── ❌ *oauth_refresh_tokens_table.php
    ├── ❌ *oauth_clients_table.php
    ├── ❌ *oauth_device_codes_table.php
    └── ❌ *create_refresh_tokens_table.php
```

### ✅ Files MODIFIED / পরিবর্তিত ফাইল

```
📂 KeepNote/
├── app/
│   ├── Models/
│   │   └── ✏️ Client.php
│   │       Changed: Laravel\Passport\HasApiTokens → Laravel\Sanctum\HasApiTokens
│   │
│   ├── Http/Controllers/
│   │   └── ✨ SanctumAuthController.php (NEW!)
│   │       Methods: register(), login(), logout(), user()
│   │
│   └── Providers/
│       ├── ✏️ AppServiceProvider.php
│       │   Removed: Passport::enablePasswordGrant()
│       │
│       └── ✏️ AuthServiceProvider.php
│           Removed: All Passport token expiration configs
│
├── config/
│   ├── ✏️ auth.php
│   │   Removed: 'api' guard (Passport)
│   │   Kept: 'web' and 'sanctum' guards
│   │
│   ├── ✏️ sanctum.php
│   │   Added: localhost:5173 for Vite
│   │
│   ├── ✏️ cors.php
│   │   Changed: Specific origins, enabled credentials
│   │
│   └── ✏️ session.php
│       Changed: same_site = 'none'
│
├── resources/js/
│   └── ✏️ bootstrap.js
│       Added: withCredentials: true
│
├── routes/
│   └── ✏️ api.php
│       Complete rewrite - Uses SanctumAuthController
│
└── bootstrap/
    └── ✏️ app.php
        Added: $middleware->statefulApi()
```

### ✨ Files CREATED / নতুন ফাইল

```
📂 KeepNote/
├── app/Http/Controllers/
│   └── ✨ SanctumAuthController.php (Authentication controller)
│
├── public/
│   └── ✨ test-auth.html (Test page for authentication)
│
└── Documentation/
    ├── ✨ SANCTUM_AUTH_GUIDE.md
    ├── ✨ SANCTUM_IMPLEMENTATION_SUMMARY.md
    ├── ✨ QUICK_REFERENCE.md
    ├── ✨ IMPLEMENTATION_CHECKLIST.md
    ├── ✨ OAUTH_OPTIONS.md
    └── ✨ SIMPLE_GUIDE_BANGLA_ENGLISH.md (This file!)
```

---

## 🎯 Important Files & Their Purpose / গুরুত্বপূর্ণ ফাইল ও তাদের কাজ

### 1️⃣ Backend Files / ব্যাকএন্ড ফাইল

| File Path                                        | Purpose (English)               | উদ্দেশ্য (বাংলা)               |
| ------------------------------------------------ | ------------------------------- | ------------------------------ |
| `app/Http/Controllers/SanctumAuthController.php` | Handles login, logout, register | লগইন, লগআউট, রেজিস্টার সামলায় |
| `app/Models/Client.php`                          | User model with Sanctum         | Sanctum সহ ইউজার মডেল          |
| `routes/api.php`                                 | All API routes                  | সব API রুট                     |
| `config/auth.php`                                | Authentication settings         | Authentication সেটিংস          |
| `config/sanctum.php`                             | Sanctum configuration           | Sanctum কনফিগারেশন             |
| `config/cors.php`                                | Cross-origin settings           | Cross-origin সেটিংস            |
| `config/session.php`                             | Session/cookie settings         | সেশন/কুকি সেটিংস               |

### 2️⃣ Frontend Files / ফ্রন্টএন্ড ফাইল

| File Path                   | Purpose (English)   | উদ্দেশ্য (বাংলা)         |
| --------------------------- | ------------------- | ------------------------ |
| `resources/js/bootstrap.js` | Axios configuration | Axios কনফিগারেশন         |
| `public/test-auth.html`     | Test authentication | Authentication টেস্ট করা |

### 3️⃣ Documentation / ডকুমেন্টেশন

| File                             | Purpose (English)             | উদ্দেশ্য (বাংলা)        |
| -------------------------------- | ----------------------------- | ----------------------- |
| `SANCTUM_AUTH_GUIDE.md`          | Complete guide with examples  | উদাহরণ সহ সম্পূর্ণ গাইড |
| `QUICK_REFERENCE.md`             | Quick code snippets           | দ্রুত কোড স্নিপেট       |
| `SIMPLE_GUIDE_BANGLA_ENGLISH.md` | This file! Simple explanation | এই ফাইল! সহজ ব্যাখ্যা   |

---

## 💻 How to Use / কিভাবে ব্যবহার করবেন {#how-to-use}

### Step 1: Test in Browser / ব্রাউজারে টেস্ট করুন

**English:**
Open this URL in your browser:

```
http://localhost/KeepNote/public/test-auth.html
```

**বাংলা:**
এই URL ব্রাউজারে খুলুন:

```
http://localhost/KeepNote/public/test-auth.html
```

### Step 2: Frontend Code / ফ্রন্টএন্ড কোড

#### React/Vue/JavaScript Example:

```javascript
// ✅ STEP 1: Configure axios (করুন একবার)
import axios from "axios";

axios.defaults.baseURL = "http://localhost/KeepNote/public";
axios.defaults.withCredentials = true; // 🔑 Important!

// ✅ STEP 2: Register (নিবন্ধন)
async function register() {
    // Get CSRF cookie first / প্রথমে CSRF কুকি নিন
    await axios.get("/sanctum/csrf-cookie");

    // Register / নিবন্ধন করুন
    const response = await axios.post("/api/register", {
        name: "আপনার নাম",
        email: "your@email.com",
        phone: "01712345678",
        occupation: "Student",
        password: "password123",
        password_confirmation: "password123",
    });

    console.log("Registration success!");
}

// ✅ STEP 3: Login (লগইন)
async function login() {
    // Get CSRF cookie / CSRF কুকি নিন
    await axios.get("/sanctum/csrf-cookie");

    // Login / লগইন করুন
    await axios.post("/api/login", {
        email: "your@email.com",
        password: "password123",
    });

    console.log("Login success!");
}

// ✅ STEP 4: Get User Data (ইউজার ডাটা নিন)
async function getUser() {
    // Cookie is sent automatically! / কুকি অটোমেটিক পাঠায়!
    const response = await axios.get("/api/user");
    console.log("User:", response.data);
}

// ✅ STEP 5: Get Notes (নোট নিন)
async function getNotes() {
    const response = await axios.get("/api/notes");
    console.log("Notes:", response.data);
}

// ✅ STEP 6: Create Note (নোট তৈরি করুন)
async function createNote() {
    const response = await axios.post("/api/notes", {
        title: "আমার নোট",
        content: "এটা আমার প্রথম নোট",
    });
    console.log("Note created!");
}

// ✅ STEP 7: Logout (লগআউট)
async function logout() {
    await axios.post("/api/logout");
    console.log("Logged out!");
}
```

---

## 🔗 API Routes / API রুট {#api-routes}

### Public Routes / পাবলিক রুট (কেউ ব্যবহার করতে পারে)

| Method | Route           | Purpose (English)         | উদ্দেশ্য (বাংলা)            |
| ------ | --------------- | ------------------------- | --------------------------- |
| GET    | `/api/test`     | Check if API is working   | API কাজ করছে কিনা চেক       |
| POST   | `/api/register` | Register new user         | নতুন ইউজার নিবন্ধন          |
| POST   | `/api/login`    | Login with email/password | ইমেইল/পাসওয়ার্ড দিয়ে লগইন |

### Protected Routes / সুরক্ষিত রুট (শুধু লগইন ইউজার)

| Method | Route               | Purpose (English)  | উদ্দেশ্য (বাংলা) |
| ------ | ------------------- | ------------------ | ---------------- |
| GET    | `/api/user`         | Get logged in user | লগইন ইউজার পেতে  |
| POST   | `/api/logout`       | Logout             | লগআউট            |
| GET    | `/api/notes`        | Get all notes      | সব নোট পেতে      |
| POST   | `/api/notes`        | Create new note    | নতুন নোট তৈরি    |
| GET    | `/api/notes/search` | Search notes       | নোট সার্চ        |
| PUT    | `/api/notes/{id}`   | Update note        | নোট আপডেট        |
| DELETE | `/api/notes/{id}`   | Delete note        | নোট ডিলিট        |

---

## 🎓 Simple Comparison / সহজ তুলনা

### Token-based (OLD) vs Cookie-based (NEW)

```
┌──────────────────────────────────────────────────────────┐
│                    TOKEN-BASED (পুরাতন)                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Login → Get Token                                       │
│  লগইন → টোকেন নাও                                        │
│                                                          │
│  localStorage.setItem('token', token) ❌                 │
│  localStorage এ টোকেন সেভ করতে হয় ❌                    │
│                                                          │
│  Every Request: Add Authorization Header ❌              │
│  প্রতিটা রিকুয়েস্টে: Authorization হেডার দিতে হয় ❌     │
│                                                          │
│  If token stolen = Account hacked! 😱                    │
│  টোকেন চুরি হলে = একাউন্ট হ্যাক! 😱                     │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    COOKIE-BASED (নতুন)                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Login → Cookie saved automatically ✅                   │
│  লগইন → কুকি অটোমেটিক সেভ হয় ✅                         │
│                                                          │
│  No manual storage needed ✅                             │
│  ম্যানুয়াল স্টোরেজ লাগবে না ✅                           │
│                                                          │
│  Cookie sent automatically in every request ✅           │
│  প্রতিটা রিকুয়েস্টে কুকি অটোমেটিক পাঠায় ✅              │
│                                                          │
│  HTTPOnly cookie = JavaScript can't access it ✅         │
│  HTTPOnly কুকি = JavaScript এক্সেস করতে পারে না ✅       │
│                                                          │
│  More Secure! 🔒                                         │
│  বেশি নিরাপদ! 🔒                                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ❓ Common Questions / সাধারণ প্রশ্ন

### Q1: Where is the token? / টোকেন কোথায়?

**English:** There is NO token! We use cookies now. Browser handles everything automatically.

**বাংলা:** কোন টোকেন নেই! এখন আমরা কুকি ব্যবহার করি। ব্রাউজার সব কিছু অটোমেটিক সামলায়।

---

### Q2: Do I need to store anything? / কিছু স্টোর করতে হবে?

**English:** NO! The browser stores the cookie automatically. You don't need to do anything.

**বাংলা:** না! ব্রাউজার কুকি অটোমেটিক স্টোর করে। আপনাকে কিছু করতে হবে না।

---

### Q3: How do I send authentication? / Authentication কিভাবে পাঠাবো?

**English:** Just make the API call! Cookie is sent automatically if you set `withCredentials: true`.

**বাংলা:** শুধু API কল করুন! `withCredentials: true` সেট করলে কুকি অটোমেটিক পাঠায়।

---

### Q4: Is it secure? / এটা কি নিরাপদ?

**English:** YES! More secure than tokens because:

- HTTPOnly cookies can't be accessed by JavaScript (XSS protection)
- CSRF protection is built-in
- Automatic expiration

**বাংলা:** হ্যাঁ! টোকেন থেকে বেশি নিরাপদ কারণ:

- HTTPOnly কুকি JavaScript এক্সেস করতে পারে না (XSS সুরক্ষা)
- CSRF সুরক্ষা বিল্ট-ইন
- অটোমেটিক এক্সপায়ার হয়

---

### Q5: Can I see the cookie? / কুকি দেখতে পারবো?

**English:**

- Open Browser DevTools (F12)
- Go to Application tab
- Look under Cookies
- You'll see session cookie

**বাংলা:**

- ব্রাউজার DevTools খুলুন (F12)
- Application ট্যাবে যান
- Cookies এর নিচে দেখুন
- সেশন কুকি দেখবেন

---

## 🔍 Troubleshooting / সমস্যা সমাধান

### Problem 1: 419 CSRF Error

**English:**

```javascript
// Make sure to call this BEFORE login:
await axios.get("/sanctum/csrf-cookie");
```

**বাংলা:**

```javascript
// লগইন করার আগে এটা কল করুন:
await axios.get("/sanctum/csrf-cookie");
```

---

### Problem 2: 401 Unauthorized

**English:**

```javascript
// Make sure you set withCredentials:
axios.defaults.withCredentials = true;
```

**বাংলা:**

```javascript
// withCredentials সেট করেছেন কিনা চেক করুন:
axios.defaults.withCredentials = true;
```

---

### Problem 3: CORS Error

**English:** Check if your frontend URL is in `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

**বাংলা:** চেক করুন আপনার ফ্রন্টএন্ড URL `.env` এ আছে কিনা:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

---

## 📊 Database Tables / ডাটাবেস টেবিল

### Tables Used / ব্যবহৃত টেবিল ✅

```
clients                        - User information / ইউজার তথ্য
sessions                       - Active sessions / চলমান সেশন
personal_access_tokens         - API tokens (optional) / API টোকেন (ঐচ্ছিক)
notes                          - User notes / ইউজার নোট
cache                          - Cache storage / ক্যাশ স্টোরেজ
jobs                           - Background jobs / ব্যাকগ্রাউন্ড কাজ
```

### Tables Removed / মুছে ফেলা টেবিল ❌

```
oauth_auth_codes               - OAuth codes (not needed)
oauth_access_tokens            - OAuth tokens (not needed)
oauth_refresh_tokens           - Refresh tokens (not needed)
oauth_clients                  - OAuth clients (not needed)
oauth_device_codes             - Device codes (not needed)
refresh_tokens                 - Custom refresh (not needed)
```

---

## 🎉 Summary / সারাংশ

### English:

1. ✅ Removed Laravel Passport (OAuth)
2. ✅ Kept only Laravel Sanctum
3. ✅ Simple cookie-based authentication
4. ✅ More secure
5. ✅ Less code to maintain
6. ✅ All working perfectly!

### বাংলা:

1. ✅ Laravel Passport (OAuth) সরিয়ে দিয়েছি
2. ✅ শুধুমাত্র Laravel Sanctum রেখেছি
3. ✅ সহজ কুকি-বেসড authentication
4. ✅ বেশি নিরাপদ
5. ✅ মেইনটেইন করার জন্য কম কোড
6. ✅ সব কিছু পারফেক্ট কাজ করছে!

---

## 📚 Learn More / আরো জানুন

| File                          | English                  | বাংলা                    |
| ----------------------------- | ------------------------ | ------------------------ |
| `SANCTUM_AUTH_GUIDE.md`       | Complete technical guide | সম্পূর্ণ টেকনিক্যাল গাইড |
| `QUICK_REFERENCE.md`          | Quick code examples      | দ্রুত কোড উদাহরণ         |
| `IMPLEMENTATION_CHECKLIST.md` | Testing checklist        | টেস্টিং চেকলিস্ট         |
| `test-auth.html`              | Test in browser          | ব্রাউজারে টেস্ট করুন     |

---

## 🚀 Quick Start / দ্রুত শুরু করুন

### English:

1. Open: `http://localhost/KeepNote/public/test-auth.html`
2. Try registering a new user
3. Try logging in
4. Test the API calls
5. See it working! ✨

### বাংলা:

1. খুলুন: `http://localhost/KeepNote/public/test-auth.html`
2. নতুন ইউজার রেজিস্টার করুন
3. লগইন করুন
4. API কল টেস্ট করুন
5. দেখুন কাজ করছে! ✨

---

## 💡 Key Takeaways / মূল বিষয়

### English:

- 🔐 Authentication = Proving who you are
- 🍪 Cookie = Automatic ID card
- 🔒 Sanctum = Simple & Secure
- ✅ No manual token management
- 🎯 Everything is automatic!

### বাংলা:

- 🔐 Authentication = আপনি কে তা প্রমাণ করা
- 🍪 Cookie = অটোমেটিক আইডি কার্ড
- 🔒 Sanctum = সহজ ও নিরাপদ
- ✅ ম্যানুয়াল টোকেন ম্যানেজমেন্ট নেই
- 🎯 সব কিছু অটোমেটিক!

---

**Made with ❤️ for easy understanding / সহজে বোঝার জন্য ❤️ দিয়ে তৈরি**

_Last Updated: January 30, 2026_
