import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as Record<string, any> | null,
    token: localStorage.getItem("access_token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(email: string, password: string): Promise<boolean> {
      const toast = useToast();
      try {
        const res = await api.post("/api/v1/auth/login", { email, password });
        if (res.data.success) {
          this.token = res.data.token;
          this.user = res.data.user ?? null;
          localStorage.setItem("access_token", res.data.token);
          return true;
        }
        toast.error(extractErrorMessage(res, "Login failed"));
        return false;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Login failed"));
        return false;
      }
    },

    async fetchMe(): Promise<void> {
      const toast = useToast();
      try {
        const res = await api.get("/api/v1/me");
        if (res.data.success) {
          this.user = res.data.data;
        }
      } catch (error) {
        toast.error(extractErrorMessage(error, "Failed to load user"));
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("access_token");
    },
  },
});
