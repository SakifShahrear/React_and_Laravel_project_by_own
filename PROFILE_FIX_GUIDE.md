# 🔧 Profile Error Fix Guide | প্রোফাইল এরর ঠিক করার গাইড

## 🚨 Problem | সমস্যা

**English:** Your React app is calling the **WRONG** route and sending **WRONG** headers!

**বাংলা:** আপনার React অ্যাপ **ভুল** রাউট কল করছে এবং **ভুল** হেডার পাঠাচ্ছে!

---

## ❌ What's Wrong | কি ভুল আছে

### Error 1: Wrong Route | ভুল রাউট

```javascript
// ❌ WRONG - This route does NOT exist
// ❌ ভুল - এই রাউট নেই
axios.get("/api/profile");
```

**English:** The route `/api/profile` doesn't exist in your Laravel backend!

**বাংলা:** `/api/profile` রাউটটি আপনার Laravel ব্যাকএন্ডে নেই!

---

### Error 2: Wrong Header | ভুল হেডার

```javascript
// ❌ WRONG - Don't send Authorization header
// ❌ ভুল - Authorization হেডার পাঠাবেন না
headers: {
    Authorization: `Bearer undefined`;
}
```

**English:** Sanctum uses **cookies**, not Bearer tokens!

**বাংলা:** Sanctum **কুকি** ব্যবহার করে, Bearer টোকেন নয়!

---

## ✅ Solution | সমাধান

### Step 1: Change the Route | রাউট পরিবর্তন করুন

**File Location | ফাইলের অবস্থান:**

```
Your React Project/src/components/profile.jsx
(or wherever you're fetching profile data)
```

**Change from | পরিবর্তন করুন:**

```javascript
// ❌ OLD
const response = await axios.get("/api/profile");
```

**Change to | নতুন:**

```javascript
// ✅ NEW
const response = await axios.get("/api/user");
```

---

### Step 2: Remove Authorization Header | Authorization হেডার মুছে ফেলুন

**Change from | পরিবর্তন করুন:**

```javascript
// ❌ OLD
const response = await axios.get("/api/user", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
```

**Change to | নতুন:**

```javascript
// ✅ NEW - No headers needed!
// ✅ নতুন - কোন হেডার লাগবে না!
const response = await axios.get("/api/user");
```

---

## 📋 Available Routes | উপলব্ধ রাউটসমূহ

**File | ফাইল:** `E:\Laravel\htdocs\KeepNote\routes\api.php`

### Public Routes | পাবলিক রাউট (কোন লগইন লাগবে না)

| Route           | Method | Purpose                | উদ্দেশ্য     |
| --------------- | ------ | ---------------------- | ------------ |
| `/api/register` | POST   | Create account         | একাউন্ট তৈরি |
| `/api/signup`   | POST   | Create account (alias) | একাউন্ট তৈরি |
| `/api/login`    | POST   | Login                  | লগইন         |

### Protected Routes | প্রটেক্টেড রাউট (লগইন লাগবে)

| Route         | Method | Purpose         | উদ্দেশ্য              |
| ------------- | ------ | --------------- | --------------------- |
| `/api/user`   | GET    | **Get profile** | **প্রোফাইল দেখুন** ✅ |
| `/api/logout` | POST   | Logout          | লগআউট                 |
| `/api/notes`  | GET    | Get all notes   | সব নোট দেখুন          |
| `/api/notes`  | POST   | Create note     | নোট তৈরি              |

---

## 🔄 Complete Workflow | সম্পূর্ণ কর্মপ্রবাহ

```
┌─────────────────────────────────────────────────────────┐
│  1. User Logs In | ব্যবহারকারী লগইন করে                │
│     POST /api/login                                     │
│     ✅ Cookie saved automatically | কুকি সেভ হয়ে যায়    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  2. Get Profile | প্রোফাইল দেখুন                        │
│     GET /api/user                                       │
│     ✅ Cookie sent automatically | কুকি অটো পাঠানো হয়   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  3. Server Returns Profile | সার্ভার প্রোফাইল দেয়      │
│     {                                                   │
│       "id": 1,                                          │
│       "name": "John",                                   │
│       "email": "john@example.com",                      │
│       "image_url": "http://localhost:8000/storage/..."  │
│     }                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Example Code | উদাহরণ কোড

### React Frontend Example | React ফ্রন্টএন্ড উদাহরণ

```javascript
// File: profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);

            // ✅ CORRECT WAY
            // ✅ সঠিক পদ্ধতি
            const response = await axios.get("/api/user");

            setUser(response.data);
            console.log("✅ Profile loaded:", response.data);
        } catch (error) {
            console.error("❌ Error:", error.response?.data || error.message);

            // If 401, redirect to login
            // যদি 401 হয়, লগইন পেজে যান
            if (error.response?.status === 401) {
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading... | লোড হচ্ছে...</div>;

    return (
        <div>
            <h1>Welcome {user?.name}!</h1>
            <p>Email: {user?.email}</p>
            {user?.image_url && <img src={user.image_url} alt="Profile" />}
        </div>
    );
}

export default Profile;
```

---

## 🔍 How to Debug | কীভাবে ডিবাগ করবেন

### Check Your React Code | আপনার React কোড চেক করুন

**English:** Look for these patterns in your code:

**বাংলা:** আপনার কোডে এই প্যাটার্নগুলো খুঁজুন:

1. **Search for | খুঁজুন:** `'/api/profile'`
    - **Replace with | পরিবর্তন করুন:** `'/api/user'`

2. **Search for | খুঁজুন:** `Authorization: 'Bearer'`
    - **Remove it | মুছে ফেলুন:** Delete the entire headers object

3. **Make sure axios has | নিশ্চিত করুন axios এ আছে:**
    ```javascript
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "http://localhost:8000";
    ```

---

## 🎯 Quick Checklist | দ্রুত চেকলিস্ট

**Before you start | শুরু করার আগে:**

- [ ] ✅ Laravel server running | Laravel সার্ভার চালু আছে

    ```bash
    cd E:\Laravel\htdocs\KeepNote
    php artisan serve
    ```

- [ ] ✅ React dev server running | React সার্ভার চালু আছে
    ```bash
    npm run dev
    ```

**Fix your code | কোড ঠিক করুন:**

- [ ] ✅ Change `/api/profile` to `/api/user`
- [ ] ✅ Remove `Authorization: Bearer` header
- [ ] ✅ Keep `withCredentials: true` in axios
- [ ] ✅ Test by logging in first, then check profile

---

## 🆘 Still Not Working? | এখনও কাজ করছে না?

### Check Browser Console | ব্রাউজার কনসোল চেক করুন

**Press F12 → Console tab**

**Look for | খুঁজুন:**

- ✅ `200 OK` = Success | সফল
- ❌ `404 Not Found` = Wrong route | ভুল রাউট
- ❌ `401 Unauthorized` = Not logged in | লগইন নেই
- ❌ `419 CSRF` = Need to get cookie first | প্রথমে কুকি নিতে হবে

### Check Network Tab | নেটওয়ার্ক ট্যাব চেক করুন

**Press F12 → Network tab**

1. **See the request URL | রিকোয়েস্ট URL দেখুন:**
    - Should be: `http://localhost:8000/api/user`
    - NOT: `http://localhost:8000/api/profile` ❌

2. **Check Cookies | কুকি চেক করুন:**
    - Should have: `laravel_session`
    - Should have: `XSRF-TOKEN`

---

## 📞 Summary | সারসংক্ষেপ

**English:**

1. Change `/api/profile` to `/api/user` in your React code
2. Remove all `Authorization: Bearer` headers
3. Make sure you're logged in before calling `/api/user`
4. Cookies handle everything automatically

**বাংলা:**

1. আপনার React কোডে `/api/profile` কে `/api/user` তে পরিবর্তন করুন
2. সব `Authorization: Bearer` হেডার মুছে দিন
3. `/api/user` কল করার আগে নিশ্চিত করুন আপনি লগইন আছেন
4. কুকি সবকিছু অটোমেটিক হ্যান্ডেল করবে

---

## 📁 Important Files | গুরুত্বপূর্ণ ফাইলসমূহ

| File       | Path                                                                        | Purpose          |
| ---------- | --------------------------------------------------------------------------- | ---------------- |
| Routes     | `E:\Laravel\htdocs\KeepNote\routes\api.php`                                 | All API routes   |
| Controller | `E:\Laravel\htdocs\KeepNote\app\Http\Controllers\SanctumAuthController.php` | Auth logic       |
| Model      | `E:\Laravel\htdocs\KeepNote\app\Models\Client.php`                          | User model       |
| Config     | `E:\Laravel\htdocs\KeepNote\config\sanctum.php`                             | Sanctum settings |

---

**Made with ❤️ for easy understanding | সহজ বোঝার জন্য ❤️ দিয়ে তৈরি**
