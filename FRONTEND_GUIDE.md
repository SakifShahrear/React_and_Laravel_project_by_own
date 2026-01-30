# Frontend Integration Guide

## ⚠️ IMPORTANT: Don't call /oauth/token directly!

Your frontend should call `/api/login`, NOT `/oauth/token`.

## Correct Login Code (React/JavaScript)

```javascript
import axios from "axios";

const API_BASE_URL = "http://localhost/KeepNote/public/api";

// ✅ CORRECT: Call /api/login
const login = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            {
                email: email,
                password: password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            },
        );

        console.log("Login Success:", response.data);

        // Save tokens
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Using the token for authenticated requests
const getProfile = async () => {
    const token = localStorage.getItem("access_token");

    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Profile Error:", error.response?.data);
        throw error;
    }
};

// ✅ Logout
const logout = async () => {
    const token = localStorage.getItem("access_token");

    try {
        await axios.post(
            `${API_BASE_URL}/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            },
        );

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    } catch (error) {
        console.error("Logout Error:", error.response?.data);
    }
};

export { login, getProfile, logout };
```

## ❌ WRONG: Do NOT do this in your frontend

```javascript
// ❌ DON'T CALL /oauth/token DIRECTLY FROM FRONTEND
axios.post("http://localhost/KeepNote/public/oauth/token", {
    grant_type: "password",
    client_id: "...",
    client_secret: "...", // ⚠️ SECURITY RISK: Exposing client secret!
    username: email,
    password: password,
});
```

## Why?

1. **Security**: `/oauth/token` requires `client_secret` which should NEVER be exposed in frontend code
2. **Architecture**: Your Laravel `AuthController` handles the OAuth flow internally
3. **Simplicity**: Just call `/api/login` with email/password

## API Endpoints

| Endpoint       | Method | Auth Required | Purpose              |
| -------------- | ------ | ------------- | -------------------- |
| `/api/signup`  | POST   | No            | Register new client  |
| `/api/login`   | POST   | No            | Login and get tokens |
| `/api/profile` | GET    | Yes           | Get user profile     |
| `/api/logout`  | POST   | Yes           | Logout               |
| `/api/refresh` | POST   | No            | Refresh access token |

## Testing with cURL

```bash
# Signup
curl -X POST http://localhost/KeepNote/public/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "01712345678",
    "occupation": "Developer",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost/KeepNote/public/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'

# Get Profile (replace TOKEN with actual access_token)
curl -X GET http://localhost/KeepNote/public/api/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"
```

## Expected Login Response

```json
{
  "status": "success",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "def50200...",
  "message": "Login successful",
  "token_type": "Bearer",
  "expires_in": 1296000,
  "client": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
}
```
