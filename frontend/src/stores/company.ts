import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

export interface Company {
  id:        string;
  name:      string;
  cnpj:      string;
  address:   string | null;
  type:      "PEDREIRA" | "SERRARIA";
  createdAt: string;
}

export interface CreateCompanyPayload {
  name:     string;
  cnpj:     string;
  type:     "PEDREIRA" | "SERRARIA";
  address?: string;
}

export const useCompanyStore = defineStore("company", {
  state: () => ({
    companies:  [] as Company[],
    selectedId: null as string | null,
  }),

  getters: {
    selected:   (state): Company | null =>
      state.companies.find((c) => c.id === state.selectedId) ?? null,
    hasCompany: (state): boolean => !!state.selectedId,
  },

  actions: {
    async fetchCompanies(): Promise<void> {
      const toast = useToast();
      try {
        const res      = await api.get<Company[]>("/api/v1/companies");
        this.companies = res.data;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Erro ao carregar empresas."));
      }
    },

    async createCompany(payload: CreateCompanyPayload): Promise<Company | null> {
      const toast = useToast();
      try {
        const res = await api.post<Company>("/api/v1/companies", payload);
        this.companies.push(res.data);
        this.selectedId = res.data.id;
        return res.data;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Erro ao criar empresa."));
        return null;
      }
    },

    select(companyId: string): void {
      this.selectedId = companyId;
    },

    clear(): void {
      this.companies  = [];
      this.selectedId = null;
    },
  },

  persist: {
    key:  "company",
    pick: ["selectedId", "companies"],
  },
});
