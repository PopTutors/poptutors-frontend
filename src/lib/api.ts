import axios from 'axios';
import { env } from '../config/env';
import { paths } from '../config/path';

// Axios instance
const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// ✅ Request interceptor: Set token
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['Accept'] = 'application/json';

  // // 🔒 Get token from localStorage
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUyZDE1YTliZDMxNTE5NWViNDI0MWMiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc1NDc2MDYxNCwiZXhwIjoxNzU0NzY0MjE0fQ.8n_1aapRh0T6sX2t83M8ijcP4e3VymywUW6gWKEeYDE"; // adjust if you're using cookies instead

  // if (token) {
  //   config.headers['Authorization'] = `Bearer ${token}`;
  // }

  return config;
});

// 🔁 Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error?.message;
    console.warn('[API Error]', message);

    // 🚫 Auto redirect to login if unauthorized
    if (error.response?.status === 401) {
      const redirectTo = window.location.pathname + window.location.search;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  }
);

export default api;
