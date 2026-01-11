import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SVR_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally (session expired)
    // BUT ignore 401 from /auth/me endpoint (that's expected when not logged in)
    if (error.response?.status === 401) {
      const isAuthMeEndpoint = error.config?.url?.includes('/auth/me');
      const isLoginPage = window.location.pathname.includes("/login");

      // Only redirect if:
      // 1. It's NOT the /auth/me endpoint (that's for checking auth status)
      // 2. We're NOT already on the login page
      if (!isAuthMeEndpoint && !isLoginPage) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
