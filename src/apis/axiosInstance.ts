// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
console.log("baseURL", process.env.REACT_APP_API_BASE_URL); //환경 변수 확인


//모든 요청에 토큰 붙여주기
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["X-User-Id"] = userId;
  }
  if (role) {
    config.headers["X-User-Role"] = role;
  }
  return config;
});
export default axiosInstance;
