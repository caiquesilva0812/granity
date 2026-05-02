import axios from "axios";
import router from "../router";
import { useUiStore } from "../stores/ui";

const SILENT_URLS = ["/api/v1/notifications"];

const isSilent = (url: string) => SILENT_URLS.some((u) => url.includes(u));

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.url && !isSilent(config.url)) {
    useUiStore().incrementLoading();
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url && !isSilent(response.config.url)) {
      useUiStore().decrementLoading();
    }
    return response;
  },
  (error) => {
    if (error.config?.url && !isSilent(error.config.url)) {
      useUiStore().decrementLoading();
    }

    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("access_token");
      router.push({ name: "login" });
    }

    return Promise.reject(error);
  },
);

export default api;
