<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Funcionários</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
        <Plus class="w-4 h-4" />
        Adicionar Funcionário
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
      <div v-for="s in summary" :key="s.label" class="rounded-xl border p-4 lg:p-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <p class="text-xs lg:text-sm mb-1" :style="{ color: 'var(--text-muted)' }">{{ s.label }}</p>
        <p class="text-lg lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">{{ s.value }}</p>
      </div>
    </div>

    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="px-4 lg:px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b" :style="{ borderColor: 'var(--border)' }">
        <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Equipe</h3>
        <input placeholder="Buscar funcionário..." class="px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[520px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th v-for="h in headers" :key="h" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employees" :key="emp.id" class="hover:bg-[var(--surface-hover)] transition-colors" :style="{ borderBottom: '1px solid var(--border)' }">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-semibold shrink-0">{{ emp.name[0] }}</div>
                  <span class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ emp.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text)' }">{{ emp.role }}</td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ emp.since }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ emp.salary }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="emp.statusBadge">{{ emp.status }}</span>
              </td>
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
import { Plus } from "lucide-vue-next";

const headers = ["Funcionário", "Cargo", "Admissão", "Custo Mensal", "Status", "Ações"];
const summary = [
  { label: "Total de Funcionários", value: "14" },
  { label: "Custo Mensal Total",    value: "R$ 38.200" },
  { label: "Custo Médio",           value: "R$ 2.729" },
];
const employees = [
  { id: 1, name: "Carlos Mendes",   role: "Encarregado de Lavra",    since: "Mar/2019", salary: "R$ 5.800", status: "Ativo",  statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 2, name: "João Ferreira",   role: "Operador de Escavadeira", since: "Jun/2020", salary: "R$ 4.200", status: "Ativo",  statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 3, name: "Marcos Oliveira", role: "Operador de Escavadeira", since: "Jan/2021", salary: "R$ 4.200", status: "Ativo",  statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 4, name: "André Lima",      role: "Motorista",               since: "Ago/2020", salary: "R$ 3.400", status: "Ativo",  statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 5, name: "Ricardo Santos",  role: "Técnico de Perfuração",   since: "Nov/2021", salary: "R$ 3.800", status: "Ativo",  statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
  { id: 6, name: "Fabio Rodrigues", role: "Técnico de Segurança",    since: "Jul/2022", salary: "R$ 3.600", status: "Férias", statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
];
</script>
