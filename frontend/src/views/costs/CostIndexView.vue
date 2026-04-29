<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Custos</h1>
      <RouterLink
        to="/custos/registrar"
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" />
        Lançar Custo
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div v-for="cat in categories" :key="cat.label" class="rounded-xl border p-4 lg:p-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <div class="flex items-center gap-2 lg:gap-3 mb-3">
          <div class="p-1.5 lg:p-2 rounded-lg" :class="cat.iconBg">
            <component :is="cat.icon" class="w-3.5 h-3.5 lg:w-4 lg:h-4" :class="cat.iconColor" />
          </div>
          <p class="text-xs lg:text-sm font-medium" :style="{ color: 'var(--text)' }">{{ cat.label }}</p>
        </div>
        <p class="text-lg lg:text-xl font-bold" :style="{ color: 'var(--text)' }">{{ cat.total }}</p>
        <p class="text-xs mt-1" :style="{ color: 'var(--text-muted)' }">{{ cat.pct }}% do custo total</p>
      </div>
    </div>

    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="px-4 lg:px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b" :style="{ borderColor: 'var(--border)' }">
        <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Lançamentos do Mês</h3>
        <input
          placeholder="Buscar..."
          class="px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
          :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
        />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[500px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th v-for="h in headers" :key="h" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in costs" :key="row.id" class="hover:bg-[var(--surface-hover)] transition-colors" :style="{ borderBottom: '1px solid var(--border)' }">
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ row.date }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="row.badge">{{ row.type }}</span>
              </td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text)' }">{{ row.description }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ row.value }}</td>
              <td class="px-4 py-3">
                <button class="text-sm text-indigo-500 hover:text-indigo-400 transition-colors">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Plus, Fuel, Users, Wrench, Zap } from "lucide-vue-next";

const headers = ["Data", "Tipo", "Descrição", "Valor", "Ações"];
const categories = [
  { label: "Diesel",      total: "R$ 33.212", pct: 38, icon: Fuel,   iconBg: "bg-orange-500/10", iconColor: "text-orange-500" },
  { label: "Mão de Obra", total: "R$ 27.968", pct: 32, icon: Users,  iconBg: "bg-blue-500/10",   iconColor: "text-blue-500" },
  { label: "Manutenção",  total: "R$ 15.732", pct: 18, icon: Wrench, iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
  { label: "Explosivos",  total: "R$ 6.992",  pct: 8,  icon: Zap,    iconBg: "bg-red-500/10",    iconColor: "text-red-500" },
];
const costs = [
  { id: 1, date: "29/04/2025", type: "Diesel",      badge: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400", description: "Abastecimento — 450 L",              value: "R$ 3.150" },
  { id: 2, date: "28/04/2025", type: "Manutenção",  badge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400", description: "Troca de correia — Escavadeira CAT", value: "R$ 2.800" },
  { id: 3, date: "26/04/2025", type: "Mão de Obra", badge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",         description: "Pagamento semanal — 8 operadores", value: "R$ 9.600" },
  { id: 4, date: "24/04/2025", type: "Explosivos",  badge: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",             description: "Compra de ANFO — 200 kg",           value: "R$ 1.740" },
  { id: 5, date: "22/04/2025", type: "Diesel",      badge: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400", description: "Abastecimento — 600 L",              value: "R$ 4.200" },
];
</script>
