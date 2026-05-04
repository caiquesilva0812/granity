import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

const TOKEN_KEY = "access_token";

type AuthUser = { id: string; email: string; name?: string };

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // token lido do localStorage para que o api.ts interceptor continue funcionando
    token: localStorage.getItem(TOKEN_KEY) || null as string | null,
    user:  null as AuthUser | null,  // restaurado pelo plugin via "auth" key
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
        // escrito manualmente para o interceptor do api.ts
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        return true;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Credenciais inválidas."));
        return false;
      }
    },

    logout(): void {
      this.token = null;
      this.user  = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },

  // plugin persiste apenas user; token é gerido manualmente acima
  persist: {
    key:  "auth",
    pick: ["user"],
  },
});
