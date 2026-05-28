import axios from "axios";

const isDev      = import.meta.env.DEV                       // true when `vite dev`
const backendUrl = import.meta.env.VITE_API_URL ?? ''        // e.g. https://care-api.up.railway.app

const baseURL = isDev
  ? "/api"            // proxied by vite.config.js during development
  : `${backendUrl}/api`  // direct absolute URL in production build

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config
      if (error.response.status === 401 && !original._retry) {
        original._retry = true
        try {
          const refreshToken = localStorage.getItem("refresh_token")
          // FIX 1: endpoint was "/api/auth/refresh" → backend route is "/api/auth/token/refresh/"
          // FIX 2: request body used { refresh_token } → backend expects { refresh }
          const response = await axios.post("/api/auth/token/refresh/", { refresh: refreshToken })
          // FIX 3: response field was "access_token" → simplejwt returns "access"
          localStorage.setItem("access_token", response.data.access)
          original.headers.Authorization = `Bearer ${response.data.access}`
          return api(original)
        } catch {
            localStorage.removeItem("access_token")
            window.location.href = "/login"
        }
    }
    return Promise.reject(error)
  }
)

export default api;