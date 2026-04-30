<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink
          to="/configuracoes"
          class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          :style="{ color: 'var(--text-muted)' }"
        >
          <ArrowLeft class="w-5 h-5" />
        </RouterLink>
        <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Usuários</h1>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
        <Plus class="w-4 h-4" /> Convidar
      </button>
    </div>

    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[440px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th v-for="h in ['Usuário', 'E-mail', 'Perfil', 'Ações']" :key="h"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                :style="{ color: 'var(--text-muted)' }">
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in users"
              :key="u.id"
              class="hover:bg-[var(--surface-hover)] transition-colors"
              :style="{ borderBottom: '1px solid var(--border)' }"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-semibold shrink-0">
                    {{ u.name[0] }}
                  </div>
                  <span class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ u.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="u.roleBadge">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button class="text-sm text-primary hover:opacity-75 transition-opacity">Editar</button>
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
import { ArrowLeft, Plus } from "lucide-vue-next";

const users = [
  { id: 1, name: "Caique Silva",  email: "caique@granity.com",  role: "Gestor",      roleBadge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400" },
  { id: 2, name: "Carlos Mendes", email: "carlos@pedreira.com", role: "Operacional", roleBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  { id: 3, name: "Ana Souza",     email: "ana@pedreira.com",    role: "Operacional", roleBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
];
</script>
