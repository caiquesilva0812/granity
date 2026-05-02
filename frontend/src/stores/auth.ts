import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

const TOKEN_KEY = "access_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user:  null as { id: string; email: string; name?: string } | null,
    token: localStorage.getItem(TOKEN_KEY) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser:     (state) => state.user,
  },

  actions: {
    async login(email: string, password: string): Promise<boolean> {
      const toast = useToast();
      try {
        const res = await api.post("/api/v1/auth/login", { email, password });
        this.token = res.data.accessToken;
        this.user  = res.data.user ?? null;
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        return true;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Credenciais inválidas."));
        return false;
      }
    },

    async fetchMe(): Promise<void> {
      try {
        const res  = await api.get("/api/v1/auth/me");
        this.user  = res.data;
      } catch {
        // silencioso — sessão pode ser restaurada sem dados do usuário
      }
    },

    logout(): void {
      this.token = null;
      this.user  = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});
