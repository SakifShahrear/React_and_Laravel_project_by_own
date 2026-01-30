# 🚀 Quick Reference - Sanctum Authentication

## Frontend Setup (Do Once)

```javascript
// In your main.js / App.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost/KeepNote/public";
axios.defaults.withCredentials = true; // ⚠️ CRITICAL!
```

---

## Authentication Flow

### 1️⃣ Register

```javascript
// Get CSRF cookie first
await axios.get("/sanctum/csrf-cookie");

// Register
const response = await axios.post("/api/register", {
    name: "John Doe",
    email: "john@example.com",
    phone: "01712345678",
    occupation: "Developer",
    password: "password123",
    password_confirmation: "password123",
});
// User is now logged in via session cookie
```

### 2️⃣ Login

```javascript
// Get CSRF cookie first
await axios.get("/sanctum/csrf-cookie");

// Login
await axios.post("/api/login", {
    email: "user@example.com",
    password: "password123",
});
// Session cookie is automatically set
```

### 3️⃣ Make Authenticated Requests

```javascript
// NO Authorization header needed!
// Cookie is sent automatically

// Get user
const user = await axios.get("/api/user");

// Get notes
const notes = await axios.get("/api/notes");

// Create note
await axios.post("/api/notes", {
    title: "My Note",
    content: "Content here",
});
```

### 4️⃣ Logout

```javascript
await axios.post("/api/logout");
// Session destroyed, cookie cleared
```

---

## API Endpoints

### Public (No Auth)

```
POST /api/register       - Register new user
POST /api/login          - Login
GET  /api/test           - Test API
GET  /sanctum/csrf-cookie - Get CSRF token
```

### Protected (Auth Required)

```
GET    /api/user         - Get authenticated user
POST   /api/logout       - Logout
GET    /api/notes        - Get all notes
POST   /api/notes        - Create note
PUT    /api/notes/{id}   - Update note
DELETE /api/notes/{id}   - Delete note
GET    /api/notes/search - Search notes
```

---

## Key Rules ⚠️

1. **Always** set `withCredentials: true` in axios
2. **Always** call `/sanctum/csrf-cookie` before first POST/PUT/DELETE
3. **Never** manually set Authorization header
4. **Never** store tokens in localStorage
5. Cookies handle everything automatically!

---

## Testing

### Browser Test

```
http://localhost/KeepNote/public/test-auth.html
```

### cURL Test

```bash
# Get CSRF cookie
curl -X GET http://localhost/KeepNote/public/sanctum/csrf-cookie \
  -c cookies.txt

# Login
curl -X POST http://localhost/KeepNote/public/api/login \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user (authenticated)
curl -X GET http://localhost/KeepNote/public/api/user \
  -b cookies.txt
```

---

## Environment Variables

```env
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=none
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

After changing .env:

```bash
php artisan config:cache
```

---

## Common Errors & Fixes

| Error            | Fix                               |
| ---------------- | --------------------------------- |
| 419 CSRF         | Call `/sanctum/csrf-cookie` first |
| 401 Unauthorized | Check `withCredentials: true`     |
| CORS error       | Verify frontend URL in config     |
| Cookies not set  | Check `SESSION_SAME_SITE=none`    |

---

## Migration from Token Auth

### Before (Token)

```javascript
const token = localStorage.getItem("token");
axios.get("/api/notes", {
    headers: { Authorization: `Bearer ${token}` },
});
```

### After (Cookie)

```javascript
// Just make the request
axios.get("/api/notes");
// That's it! Cookie sent automatically
```

---

**📚 Full Guide:** [SANCTUM_AUTH_GUIDE.md](SANCTUM_AUTH_GUIDE.md)
