import axios from "axios";

// Helper function to get CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// --------------------
// REQUEST INTERCEPTOR
// --------------------

api.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    
    // Add Bearer token if available
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token from cookie to header (required by Laravel Sanctum)
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// --------------------
// RESPONSE INTERCEPTOR
// --------------------

api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },

  async error => {
    console.error('❌ Error:', error.response?.status, error.config?.url);

    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem("refresh_token");

        const res = await axios.post(
          "http://localhost:8000/oauth/token",

          new URLSearchParams({
            grant_type: "refresh_token",

            refresh_token: refreshToken,

            client_id: "019c0da8-29e4-7226-97ff-4880af070c19",

            client_secret: "P8n1koA0j3i0XmUVfV5bxgf63ErjabpHPauHAAn2",

            scope: ""
          })
        );

        // Save new tokens
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        // Retry old request
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access_token}`;

        return api(originalRequest);

      } catch (err) {

        localStorage.clear();
        window.location.href = "/login";

      }

    }

    return Promise.reject(error);
  }
);

// Auth object with cleaner API
export const auth = {
  async getCsrf() {
    await api.get('/sanctum/csrf-cookie');
    await new Promise(r => setTimeout(r, 100)); // Small delay
  },
  
  async login(email, password) {
    await this.getCsrf();
    return api.post('/api/login', { email, password });
  },
  
  async register(data) {
    await this.getCsrf();
    return api.post('/api/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  async signup(data) {
    // Alias for register (both call /api/register)
    return this.register(data);
  },
  
  async logout() {
    return api.post('/api/logout');
  },
  
  async getUser() {
    return api.get('/api/user');
  }
};

// Legacy exports for backward compatibility
export const getCsrfCookie = () => auth.getCsrf();
export const login = (email, password) => auth.login(email, password);
export const register = (userData) => auth.register(userData);
export const logout = async () => {
  try {
    await auth.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};

export const loginUser = (data) => api.post("/api/login", data);
export const signupUser = (data) => api.post("/api/register", data);
export const getProfile = () => api.get("/api/profile");

export default api;
