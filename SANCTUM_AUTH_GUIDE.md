# Laravel Sanctum Stateful Authentication - Implementation Guide

## Overview

This KeepNote application now uses **Laravel Sanctum's stateful (cookie-based) authentication** instead of token-based authentication. This means:

- ✅ No manual token storage needed
- ✅ Cookies automatically handle authentication
- ✅ More secure for SPAs on the same domain
- ✅ CSRF protection built-in

---

## Backend Configuration

### 1. Environment Variables

Add/update these in your `.env` file:

```env
# Session configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=none

# Sanctum stateful domains (frontend URLs that can authenticate)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173,127.0.0.1:3000,127.0.0.1:5173

# App URL
APP_URL=http://localhost/KeepNote/public
```

### 2. Key Files Updated

#### `config/sanctum.php`

- Added localhost:5173 for Vite support
- Configured stateful domains for SPA authentication

#### `config/cors.php`

- Enabled credentials support
- Specified allowed origins (localhost:3000, localhost:5173)
- Added sanctum/csrf-cookie to paths

#### `config/session.php`

- Changed `same_site` to 'none' for cross-site requests

#### `config/auth.php`

- Added web guard with session driver
- Added sanctum guard

---

## Frontend Configuration

### 1. Axios Setup (`resources/js/bootstrap.js`)

```javascript
import axios from "axios";
window.axios = axios;

// Set base URL for API requests
window.axios.defaults.baseURL = "http://localhost/KeepNote/public";

// Enable credentials (cookies) to be sent with requests
window.axios.defaults.withCredentials = true;

// Set default headers
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers.common["Accept"] = "application/json";
```

### 2. Frontend Implementation Example

#### **Login Flow:**

```javascript
// Step 1: Get CSRF cookie BEFORE login
await axios.get("/sanctum/csrf-cookie");

// Step 2: Login (session cookie is automatically set)
const response = await axios.post("/api/login", {
    email: "user@example.com",
    password: "password123",
});

console.log("Logged in:", response.data.client);
// No need to store tokens! Cookie handles everything
```

#### **Register Flow:**

```javascript
// Step 1: Get CSRF cookie
await axios.get("/sanctum/csrf-cookie");

// Step 2: Register
const response = await axios.post("/api/register", {
    name: "John Doe",
    email: "john@example.com",
    phone: "01712345678",
    occupation: "Developer",
    password: "password123",
    password_confirmation: "password123",
});

console.log("Registered:", response.data.client);
```

#### **Making Authenticated Requests:**

```javascript
// No need to add Authorization header!
// Cookies are sent automatically

// Get authenticated user
const user = await axios.get("/api/user");

// Get notes
const notes = await axios.get("/api/notes");

// Create note
await axios.post("/api/notes", {
    title: "My Note",
    content: "Note content here",
});
```

#### **Logout Flow:**

```javascript
await axios.post("/api/logout");
// Session is destroyed, cookie is cleared
```

---

## API Routes

### Public Routes (No Auth Required)

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/api/register` | Register new user           |
| POST   | `/api/login`    | Login with email & password |
| GET    | `/api/test`     | Test if API is working      |

### Protected Routes (Auth Required)

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/user`         | Get authenticated user   |
| POST   | `/api/logout`       | Logout (destroy session) |
| GET    | `/api/notes`        | Get all notes            |
| POST   | `/api/notes`        | Create new note          |
| GET    | `/api/notes/search` | Search notes             |
| PUT    | `/api/notes/{id}`   | Update note              |
| DELETE | `/api/notes/{id}`   | Delete note              |

---

## Complete React/Vue Example

### React Component Example

```javascript
import { useState, useEffect } from "react";
import axios from "axios";

// Configure axios (do this once in your app)
axios.defaults.baseURL = "http://localhost/KeepNote/public";
axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get("/api/user");
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Get CSRF cookie
            await axios.get("/sanctum/csrf-cookie");

            // Step 2: Login
            await axios.post("/api/login", { email, password });

            // Step 3: Get user data
            await checkAuth();

            alert("Login successful!");
        } catch (error) {
            alert("Login failed: " + error.response?.data?.message);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            setUser(null);
            alert("Logged out successfully!");
        } catch (error) {
            alert("Logout failed");
        }
    };

    if (user) {
        return (
            <div>
                <h1>Welcome, {user.name}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default App;
```

### Vue 3 Component Example

```vue
<template>
    <div>
        <div v-if="user">
            <h1>Welcome, {{ user.name }}!</h1>
            <button @click="logout">Logout</button>
        </div>

        <div v-else>
            <h1>Login</h1>
            <form @submit.prevent="login">
                <input v-model="email" type="email" placeholder="Email" />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Configure axios
axios.defaults.baseURL = "http://localhost/KeepNote/public";
axios.defaults.withCredentials = true;

const user = ref(null);
const email = ref("");
const password = ref("");

onMounted(async () => {
    await checkAuth();
});

const checkAuth = async () => {
    try {
        const response = await axios.get("/api/user");
        user.value = response.data;
    } catch (error) {
        user.value = null;
    }
};

const login = async () => {
    try {
        // Step 1: Get CSRF cookie
        await axios.get("/sanctum/csrf-cookie");

        // Step 2: Login
        await axios.post("/api/login", {
            email: email.value,
            password: password.value,
        });

        // Step 3: Get user data
        await checkAuth();

        alert("Login successful!");
    } catch (error) {
        alert("Login failed: " + error.response?.data?.message);
    }
};

const logout = async () => {
    try {
        await axios.post("/api/logout");
        user.value = null;
        alert("Logged out!");
    } catch (error) {
        alert("Logout failed");
    }
};
</script>
```

---

## Testing with Postman/Thunder Client

### 1. Get CSRF Cookie

```
GET http://localhost/KeepNote/public/sanctum/csrf-cookie
```

- Make sure "Send cookies" is enabled in your client

### 2. Login

```
POST http://localhost/KeepNote/public/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Get User (Authenticated)

```
GET http://localhost/KeepNote/public/api/user
```

- Cookie is automatically sent

### 4. Logout

```
POST http://localhost/KeepNote/public/api/logout
```

---

## Key Differences from Token-Based Auth

| Token-Based (Old)                      | Cookie-Based (New)            |
| -------------------------------------- | ----------------------------- |
| Manual token storage in localStorage   | Automatic cookie storage      |
| `Authorization: Bearer {token}` header | No manual headers needed      |
| Token can be stolen via XSS            | HTTPOnly cookies more secure  |
| Must refresh tokens manually           | Session handled automatically |
| Works cross-domain easily              | Best for same-domain SPAs     |

---

## Troubleshooting

### Issue: CORS errors

**Solution:** Make sure your frontend URL is in `SANCTUM_STATEFUL_DOMAINS` and `config/cors.php`

### Issue: 419 CSRF token mismatch

**Solution:** Always call `/sanctum/csrf-cookie` before POST/PUT/DELETE requests

### Issue: 401 Unauthenticated

**Solution:**

- Check `withCredentials: true` is set in axios
- Verify session is working (check cookies in browser DevTools)
- Make sure SESSION_DOMAIN matches your domain

### Issue: Cookies not being set

**Solution:**

- Check SESSION_SAME_SITE is set to 'none' for cross-site
- For production, use HTTPS and set SESSION_SECURE_COOKIE=true

---

## Migration from Old Auth

If you have existing frontend code using Bearer tokens:

**Old Code:**

```javascript
// Get token from localStorage
const token = localStorage.getItem("token");

// Add to header
axios.get("/api/notes", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
```

**New Code:**

```javascript
// Get CSRF cookie once before authenticated requests
await axios.get("/sanctum/csrf-cookie");

// Just make the request - cookie is sent automatically
axios.get("/api/notes");
```

---

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Set `SESSION_SECURE_COOKIE=true` in production
3. ✅ Set appropriate `SESSION_LIFETIME`
4. ✅ Keep `SESSION_HTTP_ONLY=true` (prevents JS access to cookies)
5. ✅ Use strong `APP_KEY` (run `php artisan key:generate`)
6. ✅ Regular session cleanup

---

## Quick Start Checklist

- [ ] Update `.env` file with session and SANCTUM settings
- [ ] Run `php artisan config:cache` to clear config cache
- [ ] Update frontend axios configuration with `withCredentials: true`
- [ ] Add `/sanctum/csrf-cookie` call before login
- [ ] Remove all localStorage token management code
- [ ] Test login/logout flow
- [ ] Test authenticated API calls

---

**Your KeepNote app is now ready to use Sanctum stateful authentication!** 🎉
