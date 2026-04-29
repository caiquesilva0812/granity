import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    activeRequests: 0,
    isDark: localStorage.getItem("theme") !== "light",
  }),
  getters: {
    isLoading: (state) => state.activeRequests > 0,
  },
  actions: {
    incrementLoading() {
      this.activeRequests++;
    },
    decrementLoading() {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    },
    toggleDarkMode() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },
    initTheme() {
      this.applyTheme();
    },
  },
});
