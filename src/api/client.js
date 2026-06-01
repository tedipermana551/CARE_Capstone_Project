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

// ── In-Memory GET Request Cache ──────────────────────────────────────────────
const cache = new Map();

const clearCacheOnMutation = (config) => {
  const method = config.method?.toLowerCase();
  const url = config.url || "";
  // Do not clear cache for auth refresh requests
  if (method && method !== 'get' && !url.includes('/auth/token/refresh/')) {
    cache.clear();
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Cache check for GET requests
    const isGet = config.method?.toLowerCase() === 'get';
    if (isGet) {
      const cacheKey = `${config.url}:${JSON.stringify(config.params || {})}`;
      if (cache.has(cacheKey)) {
        // Cancel the current request and pass the cached response as the cancellation reason
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        source.cancel({ isCache: true, response: cache.get(cacheKey) });
      }
    }
    return config;
  }
);

api.interceptors.response.use(
    (response) => {
    const method = response.config.method?.toLowerCase();
    if (method === 'get') {
      const cacheKey = `${response.config.url}:${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, response);
    } else {
      clearCacheOnMutation(response.config);
    }
    return response;
  },
  async (error) => {
    // Handle cached response return
    if (axios.isCancel(error) && error.message?.isCache) {
      return Promise.resolve(error.message.response);
    }

    // Clear cache if a mutation fails (just in case)
    if (error.config) {
      clearCacheOnMutation(error.config);
    }

    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${baseURL}/auth/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem("access_token", response.data.access);
        original.headers.Authorization = `Bearer ${response.data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;