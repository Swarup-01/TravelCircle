import axios from "axios";

const API = axios.create({
  baseURL: "https://travel-circle.vercel.app/api",
});

// Automatically attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
