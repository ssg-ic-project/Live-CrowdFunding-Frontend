// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          localStorage.clear();
          window.location.href = "/auth/login";
          break;
        case 500:
          console.error("Server Error:", error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 에러 처리 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 에러:", error);
    return Promise.reject(error);
  }
);

export default api;
