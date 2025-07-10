import axios from "axios";
import { env } from "../config/env";
import { paths } from "../config/path";

// Axios instance
const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Accept"] = "application/json";
  return config;
});

// Response interceptor (no refresh logic)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error?.message;
    console.warn("[API Error]", message);

    // Optional: Redirect to login if unauthorized
    if (error.response?.status === 401) {
      const redirectTo = window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  }
);

export default api;
