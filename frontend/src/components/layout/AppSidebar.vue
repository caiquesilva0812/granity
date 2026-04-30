<template>
  <aside
    class="fixed lg:static inset-y-0 left-0 z-30 w-56 lg:w-44 min-h-screen bg-blue-700 flex flex-col shrink-0 transition-transform duration-300 ease-in-out"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <div class="px-5 h-14 shrink-0 border-b border-white/10 flex items-center justify-between">
      <span class="text-white font-bold text-lg tracking-wide">Granity</span>
      <button
        @click="emit('close')"
        class="lg:hidden p-1 rounded text-white/60 hover:text-white transition-colors"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <nav class="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3.5 mx-2 rounded-md text-sm transition-colors"
        :class="
          isActive(item)
            ? 'bg-white/20 text-white font-medium'
            : 'text-white/65 hover:text-white hover:bg-white/10'
        "
      >
        <component :is="item.icon" class="w-4 h-4 shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-3 border-t border-white/10">
      <RouterLink
        to="/empresas"
        class="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-white/65 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Building2 class="w-4 h-4 shrink-0" />
        <span>Empresas</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import {
  LayoutDashboard,
  Layers,
  Wallet,
  Package,
  ShoppingCart,
  Users,
  Building2,
  X,
} from "lucide-vue-next";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

const route = useRoute();

const navItems = [
  { label: "Dashboard",      to: "/",              icon: LayoutDashboard, exact: true },
  { label: "Produção",       to: "/producao",      icon: Layers },
  { label: "Custos",         to: "/custos",        icon: Wallet },
  { label: "Estoque",        to: "/estoque",       icon: Package },
  { label: "Vendas",         to: "/vendas",        icon: ShoppingCart },
  { label: "Funcionários",   to: "/funcionarios",  icon: Users },
];

function isActive(item: { to: string; exact?: boolean }) {
  return item.exact ? route.path === item.to : route.path.startsWith(item.to);
}
</script>
