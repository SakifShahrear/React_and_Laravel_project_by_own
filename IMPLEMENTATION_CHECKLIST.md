# ✅ Sanctum Implementation Checklist

## Pre-Implementation

- [x] Backup existing authentication code
- [x] Review current authentication flow
- [x] Understand Sanctum stateful authentication

## Backend Configuration

- [x] Update `config/sanctum.php` - Add stateful domains
- [x] Update `config/cors.php` - Configure CORS for credentials
- [x] Update `config/session.php` - Set same_site to 'none'
- [x] Update `config/auth.php` - Add web and sanctum guards
- [x] Update `bootstrap/app.php` - Add statefulApi middleware
- [x] Update `Client` model - Use Laravel\Sanctum\HasApiTokens
- [x] Create `SanctumAuthController` - Login, logout, register
- [x] Update `routes/api.php` - Use auth:sanctum middleware

## Frontend Configuration

- [x] Update `resources/js/bootstrap.js` - Add withCredentials
- [x] Set axios baseURL
- [x] Set default headers

## Documentation

- [x] Create comprehensive guide (SANCTUM_AUTH_GUIDE.md)
- [x] Create implementation summary
- [x] Create quick reference card
- [x] Create test HTML page

## Testing Checklist

### Backend Tests

- [ ] Run `php artisan config:cache`
- [ ] Verify routes: `php artisan route:list`
- [ ] Check for PHP errors: `php artisan about`
- [ ] Test database connection works

### API Endpoint Tests

- [ ] Test `/sanctum/csrf-cookie` returns 204
- [ ] Test `/api/test` returns success
- [ ] Test `/api/register` creates new user
- [ ] Test `/api/login` with correct credentials
- [ ] Test `/api/login` with wrong credentials (should fail)
- [ ] Test `/api/user` when authenticated
- [ ] Test `/api/user` when not authenticated (should return 401)
- [ ] Test `/api/logout` clears session
- [ ] Test `/api/notes` when authenticated
- [ ] Test `/api/notes` when not authenticated (should return 401)

### Browser Tests (using test-auth.html)

- [ ] Open `http://localhost/KeepNote/public/test-auth.html`
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Verify cookies in DevTools → Application → Cookies
- [ ] Test "Get User" button
- [ ] Test "Get Notes" button
- [ ] Test logout
- [ ] Verify cookies cleared after logout

### Frontend Integration Tests

- [ ] Configure axios in your frontend app
- [ ] Test registration from your app
- [ ] Test login from your app
- [ ] Test authenticated API calls
- [ ] Test logout from your app
- [ ] Verify error handling (401, 419, etc.)

### Security Tests

- [ ] Verify HTTPOnly cookie is set
- [ ] Verify CSRF token is present
- [ ] Test CSRF protection (skip csrf-cookie call, should fail)
- [ ] Test session expiration
- [ ] Verify XSS protection (JavaScript can't read auth cookie)

### Cross-Browser Tests

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

## Environment Setup

### Development

- [ ] Set `SESSION_SECURE_COOKIE=false`
- [ ] Set `SESSION_DOMAIN=localhost`
- [ ] Add all dev URLs to SANCTUM_STATEFUL_DOMAINS

### Production

- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Set `SESSION_DOMAIN=yourdomain.com`
- [ ] Use HTTPS
- [ ] Update SANCTUM_STATEFUL_DOMAINS with production URLs
- [ ] Update CORS allowed origins
- [ ] Test on production environment

## Migration from Old Auth

### Code Changes

- [ ] Remove localStorage token management
- [ ] Remove Authorization header logic
- [ ] Add CSRF cookie fetch before login
- [ ] Update all API calls to rely on cookies
- [ ] Update error handling for 419 CSRF errors

### Data Migration

- [ ] Test existing users can still login
- [ ] Verify user data is intact
- [ ] Test that old tokens are invalidated (if applicable)

## Documentation

- [ ] Update README with new auth flow
- [ ] Update API documentation
- [ ] Add troubleshooting guide
- [ ] Document environment variables
- [ ] Create developer onboarding guide

## Deployment

- [ ] Test on staging environment
- [ ] Update .env on server
- [ ] Run migrations if needed
- [ ] Clear config cache: `php artisan config:cache`
- [ ] Test all endpoints on production
- [ ] Monitor logs for errors
- [ ] Set up session cleanup cron job

## Post-Deployment

- [ ] Monitor error logs
- [ ] Check session storage usage
- [ ] Verify CORS is working correctly
- [ ] Test with real users
- [ ] Gather feedback
- [ ] Document any issues found

## Optional Enhancements

- [ ] Implement "Remember Me" functionality
- [ ] Add rate limiting to auth endpoints
- [ ] Implement email verification
- [ ] Add password reset flow
- [ ] Add two-factor authentication
- [ ] Implement user sessions management (view active sessions)
- [ ] Add audit logging for auth events

---

## Quick Commands

```bash
# Clear config cache
php artisan config:cache

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# List all routes
php artisan route:list

# Run migrations
php artisan migrate

# Check Laravel status
php artisan about

# Run tests
php artisan test
```

---

## Troubleshooting Steps

If something doesn't work:

1. **Check PHP errors**

    ```bash
    php artisan about
    tail -f storage/logs/laravel.log
    ```

2. **Clear all caches**

    ```bash
    php artisan config:cache
    php artisan cache:clear
    ```

3. **Verify database**

    ```bash
    php artisan db:show
    ```

4. **Check routes**

    ```bash
    php artisan route:list | grep api
    ```

5. **Test CORS**
    - Check browser console for CORS errors
    - Verify allowed origins in config/cors.php

6. **Check cookies**
    - Open DevTools → Application → Cookies
    - Verify session cookie is present
    - Check cookie attributes (HTTPOnly, SameSite)

---

## Success Criteria

✅ Users can register successfully
✅ Users can login with correct credentials
✅ Session cookie is set after login
✅ Authenticated API calls work without Authorization header
✅ Logout destroys session properly
✅ CSRF protection is working
✅ Cookies are HTTPOnly and secure (in production)
✅ Frontend doesn't need to manage tokens
✅ No CORS errors in browser
✅ All protected routes require authentication

---

**Date Completed:** ******\_\_\_******
**Tested By:** ******\_\_\_******
**Production Deploy Date:** ******\_\_\_******
**Notes:** ******\_\_\_******
