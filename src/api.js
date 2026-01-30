import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // Use Vite proxy
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// --------------------
// REQUEST INTERCEPTOR
// --------------------

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// --------------------
// RESPONSE INTERCEPTOR
// --------------------

api.interceptors.response.use(
  response => response,

  async error => {

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
          "http://localhost/KeepNote/public/oauth/token",

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

export default api;

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};

export const loginUser = (data) => api.post("/login", data);
export const signupUser = (data) => api.post("/signup", data);
export const getProfile = () => api.get("/profile");
