<template>
  <header
    class="h-14 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b"
    :style="{ backgroundColor: 'var(--navbar-bg)', borderColor: 'var(--navbar-border)' }"
  >
    <button
      @click="emit('toggleSidebar')"
      class="lg:hidden p-2 rounded-lg transition-colors"
      :style="{ color: 'var(--text-muted)' }"
    >
      <Menu class="w-5 h-5" />
    </button>

    <span class="hidden lg:block" />

    <div class="flex items-center gap-2 lg:gap-3">
      <button
        class="p-2 rounded-lg transition-colors"
        :style="{ color: 'var(--text-muted)' }"
      >
        <Bell class="w-5 h-5" />
      </button>

      <div v-if="dropdownOpen" class="fixed inset-0 z-10" @click="dropdownOpen = false" />

      <div class="relative z-20">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 bg-blue-600 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {{ initials() }}
        </button>

        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 w-60 rounded-xl overflow-hidden shadow-xl border"
            :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
          >
            <div class="px-4 py-4 bg-blue-600">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold shrink-0">
                  {{ initials() }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white truncate">{{ displayName() }}</p>
                  <p class="text-xs text-white/60 mt-0.5 truncate">{{ authStore.currentUser?.email ?? "caique@granity.com" }}</p>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between px-4 py-3 border-b"
              :style="{ borderColor: 'var(--border)' }"
            >
              <div class="flex items-center gap-3">
                <Moon class="w-4 h-4 shrink-0" :style="{ color: 'var(--text-muted)' }" />
                <span class="text-sm" :style="{ color: 'var(--text)' }">Dark mode</span>
              </div>
              <button
                @click.stop="uiStore.toggleDarkMode()"
                class="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0"
                :class="uiStore.isDark ? 'bg-indigo-500' : 'bg-slate-300'"
              >
                <div
                  class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :class="uiStore.isDark ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="py-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
                :style="{ color: 'var(--text)' }"
              >
                <UserRound class="w-4 h-4 shrink-0" :style="{ color: 'var(--text-muted)' }" />
                Perfil
              </button>
              <RouterLink
                to="/configuracoes"
                @click="dropdownOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
                :style="{ color: 'var(--text)' }"
              >
                <Settings class="w-4 h-4 shrink-0" :style="{ color: 'var(--text-muted)' }" />
                Configurações
              </RouterLink>
              <button
                class="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
                :style="{ color: 'var(--text)' }"
              >
                <div class="flex items-center gap-3">
                  <CircleHelp class="w-4 h-4 shrink-0" :style="{ color: 'var(--text-muted)' }" />
                  Ajuda
                </div>
                <ExternalLink class="w-3.5 h-3.5" :style="{ color: 'var(--text-muted)' }" />
              </button>
            </div>

            <div class="border-t py-1" :style="{ borderColor: 'var(--border)' }">
              <button
                @click="logout"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
                :style="{ color: 'var(--text)' }"
              >
                <LogOut class="w-4 h-4 shrink-0" :style="{ color: 'var(--text-muted)' }" />
                Sair
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { Bell, Menu, Moon, UserRound, Settings, CircleHelp, ExternalLink, LogOut } from "lucide-vue-next";
import { useUiStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";
import { useCompanyStore } from "../../stores/company";

const emit = defineEmits<{ toggleSidebar: [] }>();

const uiStore      = useUiStore();
const authStore    = useAuthStore();
const companyStore = useCompanyStore();
const router       = useRouter();
const dropdownOpen = ref(false);

const displayName = () => {
  const user = authStore.currentUser;
  if (!user) return "";
  if (user.name) return user.name;
  return user.email.split("@")[0];
};

const initials = () => {
  const name  = displayName();
  const parts = name.trim().split(/[\s._-]+/);
  const first = parts[0]?.[0] ?? "";
  const last  = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? "";
  return (first + last).toUpperCase();
};

function logout() {
  dropdownOpen.value = false;
  authStore.logout();
  companyStore.clear();
  router.push({ name: "login" });
}
</script>

<style scoped>
.dropdown-enter-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-leave-active {
  transition: opacity 100ms ease, transform 100ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-6px);
}
</style>
