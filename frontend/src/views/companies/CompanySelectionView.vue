<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Minhas Empresas</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--text-muted)' }">Selecione uma empresa para acessar o painel operacional</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      <div
        v-for="company in companies"
        :key="company.id"
        class="rounded-xl border p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">{{ company.name }}</h2>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1" :class="company.typeBadge">
              {{ company.type }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="company.iconBg">
            <component :is="company.icon" class="w-5 h-5" :class="company.iconColor" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 mb-5">
          <div v-for="stat in company.stats" :key="stat.label" class="text-center">
            <p class="text-base font-bold" :style="{ color: 'var(--text)' }">{{ stat.value }}</p>
            <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ stat.label }}</p>
          </div>
        </div>

        <button class="w-full py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
          Acessar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mountain, Layers } from "lucide-vue-next";

const companies = [
  {
    id: 1, name: "Pedreira Serra Verde", type: "Pedreira",
    typeBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
    icon: Mountain, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500",
    stats: [{ label: "Volume/mês", value: "312 m³" }, { label: "Custo/m³", value: "R$ 280" }, { label: "Receita", value: "R$ 124k" }],
  },
  {
    id: 2, name: "Pedreira Boa Vista", type: "Pedreira",
    typeBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
    icon: Mountain, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500",
    stats: [{ label: "Volume/mês", value: "218 m³" }, { label: "Custo/m³", value: "R$ 320" }, { label: "Receita", value: "R$ 91k" }],
  },
  {
    id: 3, name: "Serraria Central", type: "Serraria",
    typeBadge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400",
    icon: Layers, iconBg: "bg-violet-500/10", iconColor: "text-violet-500",
    stats: [{ label: "Chapas/mês", value: "3.400" }, { label: "Custo/chapa", value: "R$ 28" }, { label: "Receita", value: "R$ 210k" }],
  },
];
</script>
