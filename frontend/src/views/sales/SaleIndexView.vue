<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Vendas</h1>
      <RouterLink to="/vendas/registrar" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
        <Plus class="w-4 h-4" />
        Registrar Venda
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
      <div v-for="s in summary" :key="s.label" class="rounded-xl border p-4 lg:p-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <p class="text-xs lg:text-sm mb-1" :style="{ color: 'var(--text-muted)' }">{{ s.label }}</p>
        <p class="text-lg lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">{{ s.value }}</p>
      </div>
    </div>

    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="px-4 lg:px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b" :style="{ borderColor: 'var(--border)' }">
        <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Histórico de Vendas</h3>
        <input placeholder="Buscar cliente..." class="px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[520px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th v-for="h in headers" :key="h" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sales" :key="row.id" class="hover:bg-[var(--surface-hover)] transition-colors" :style="{ borderBottom: '1px solid var(--border)' }">
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ row.date }}</td>
              <td class="px-4 py-3 text-sm font-medium" :style="{ color: 'var(--text)' }">{{ row.client }}</td>
              <td class="px-4 py-3 text-sm font-mono" :style="{ color: 'var(--text)' }">{{ row.block }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-green-500">{{ row.value }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="row.statusBadge">{{ row.status }}</span>
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
import { Plus } from "lucide-vue-next";

const headers = ["Data", "Cliente", "Bloco", "Valor", "Status"];
const summary = [
  { label: "Vendas em Abril", value: "R$ 124.000" },
  { label: "Blocos Vendidos", value: "9 blocos" },
  { label: "Ticket Médio",    value: "R$ 13.778" },
];
const sales = [
  { id: 1, date: "28/04/2025", client: "Construtora Horizonte",  block: "BLK-0029", value: "R$ 18.500", status: "Pago",     statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 2, date: "25/04/2025", client: "Importadora Nórdica",    block: "BLK-0030", value: "R$ 32.000", status: "Pago",     statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 3, date: "22/04/2025", client: "Mármoraria Central",     block: "BLK-0031", value: "R$ 11.200", status: "Pendente", statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
  { id: 4, date: "18/04/2025", client: "Construtora Horizonte",  block: "BLK-0028", value: "R$ 16.800", status: "Pago",     statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 5, date: "15/04/2025", client: "Exportadora Sul Pedras", block: "BLK-0027", value: "R$ 28.500", status: "Pago",     statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
];
</script>
