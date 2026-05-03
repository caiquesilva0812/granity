import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

type AuthUser = { id: string; email: string; name?: string };

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user:  null as AuthUser | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser:     (state) => state.user,
  },

  actions: {
    async login(email: string, password: string): Promise<boolean> {
      const toast = useToast();
      try {
        const res  = await api.post("/api/v1/auth/login", { email, password });
        this.token = res.data.accessToken;
        this.user  = res.data.user ?? null;
        return true;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Credenciais inválidas."));
        return false;
      }
    },

    logout(): void {
      this.token = null;
      this.user  = null;
    },
  },

  persist: {
    key:  "auth",
    pick: ["token", "user"],
  },
});
