import axios from "axios";

export const AUTH_STORAGE_KEYS = {
  TOKEN: "marketplace_tani_token",
  USER: "marketplace_tani_user",
};

export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_AUTH_PATHS = ["/auth/login", "/auth/register"];

function isPublicAuthRequest(url = "") {
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (token && !isPublicAuthRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401 && !isPublicAuthRequest(requestUrl)) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    return Promise.reject(error);
  },
);
