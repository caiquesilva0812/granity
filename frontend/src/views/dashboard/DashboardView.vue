<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Dashboard</h1>
        <p class="text-sm mt-0.5" :style="{ color: 'var(--text-muted)' }">Pedreira Serra Verde — Abril 2025</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="rounded-xl p-4 lg:p-5 border"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs lg:text-sm" :style="{ color: 'var(--text-muted)' }">{{ card.label }}</p>
          <div class="p-1.5 lg:p-2 rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="w-3.5 h-3.5 lg:w-4 lg:h-4" :class="card.iconColor" />
          </div>
        </div>
        <p class="text-lg lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">{{ card.value }}</p>
        <p class="text-xs mt-1.5 flex items-center gap-1" :class="card.trend >= 0 ? 'text-green-500' : 'text-red-400'">
          <TrendingUp v-if="card.trend >= 0" class="w-3 h-3" />
          <TrendingDown v-else class="w-3 h-3" />
          {{ Math.abs(card.trend) }}% vs. mês anterior
        </p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 rounded-xl p-4 lg:p-5 border" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <h3 class="font-semibold mb-4 lg:mb-5" :style="{ color: 'var(--text)' }">Volume Extraído por Mês (m³)</h3>
        <div class="flex items-end gap-2 lg:gap-3 h-32 lg:h-36 px-2">
          <div v-for="bar in productionBars" :key="bar.month" class="flex-1 flex flex-col items-center gap-1.5">
            <span class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">{{ bar.value }}</span>
            <div class="w-full bg-indigo-500 rounded-t-md" :style="{ height: bar.pct + '%' }" />
            <span class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl p-4 lg:p-5 border" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <h3 class="font-semibold mb-4 lg:mb-5" :style="{ color: 'var(--text)' }">Custos por Categoria</h3>
        <div class="space-y-3.5">
          <div v-for="cat in costBreakdown" :key="cat.label">
            <div class="flex justify-between text-sm mb-1.5">
              <span :style="{ color: 'var(--text)' }">{{ cat.label }}</span>
              <span :style="{ color: 'var(--text-muted)' }">{{ cat.pct }}%</span>
            </div>
            <div class="h-1.5 rounded-full" :style="{ background: 'var(--border)' }">
              <div class="h-full rounded-full" :class="cat.color" :style="{ width: cat.pct + '%' }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="px-4 lg:px-5 py-4 border-b" :style="{ borderColor: 'var(--border)' }">
        <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Atividades Recentes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[560px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th v-for="h in ['Tipo', 'Descrição', 'Valor', 'Data']" :key="h"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                :style="{ color: 'var(--text-muted)' }">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in recentActivity" :key="a.id" :style="{ borderBottom: '1px solid var(--border)' }">
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="a.badge">{{ a.type }}</span>
              </td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text)' }">{{ a.description }}</td>
              <td class="px-4 py-3 text-sm font-medium" :style="{ color: 'var(--text)' }">{{ a.value }}</td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ a.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown, Layers, Wallet, Package, ShoppingCart } from "lucide-vue-next";

const statCards = [
  { label: "Volume Extraído",   value: "312,4 m³",   trend: 8,   icon: Layers,       iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500" },
  { label: "Custo Total",       value: "R$ 87.400",  trend: -3,  icon: Wallet,       iconBg: "bg-red-500/10",    iconColor: "text-red-500" },
  { label: "Custo / m³",        value: "R$ 279,73",  trend: -11, icon: TrendingDown, iconBg: "bg-orange-500/10", iconColor: "text-orange-500" },
  { label: "Blocos em Estoque", value: "43 blocos",  trend: 5,   icon: Package,      iconBg: "bg-blue-500/10",   iconColor: "text-blue-500" },
  { label: "Vendas do Mês",     value: "R$ 124.000", trend: 15,  icon: ShoppingCart, iconBg: "bg-green-500/10",  iconColor: "text-green-500" },
];

const productionBars = [
  { month: "Nov", value: "248", pct: 60 },
  { month: "Dez", value: "214", pct: 52 },
  { month: "Jan", value: "271", pct: 66 },
  { month: "Fev", value: "255", pct: 62 },
  { month: "Mar", value: "289", pct: 70 },
  { month: "Abr", value: "312", pct: 76 },
];

const costBreakdown = [
  { label: "Diesel",      pct: 38, color: "bg-indigo-500" },
  { label: "Mão de Obra", pct: 32, color: "bg-violet-500" },
  { label: "Manutenção",  pct: 18, color: "bg-blue-400" },
  { label: "Explosivos",  pct: 8,  color: "bg-orange-500" },
  { label: "Outros",      pct: 4,  color: "bg-slate-400" },
];

const recentActivity = [
  { id: 1, type: "Extração", description: "Frente Norte — 42 t extraídas",          value: "42 t",      date: "29/04/2025", badge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  { id: 2, type: "Venda",    description: "Granito Amarelo — Construtora Horizonte", value: "R$ 18.500", date: "28/04/2025", badge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 3, type: "Custo",    description: "Abastecimento — 450 litros de diesel",    value: "R$ 3.150",  date: "27/04/2025", badge: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" },
  { id: 4, type: "Extração", description: "Frente Sul — 38 t extraídas",             value: "38 t",      date: "26/04/2025", badge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  { id: 5, type: "Venda",    description: "Granito Preto São Gabriel — Exportação",  value: "R$ 32.000", date: "25/04/2025", badge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
];
</script>
