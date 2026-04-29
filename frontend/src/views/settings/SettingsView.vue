<template>
  <div class="space-y-6">
    <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Configurações</h1>

    <div class="flex gap-1 border-b" :style="{ borderColor: 'var(--border)' }">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="activeTab === tab ? 'border-indigo-500 text-indigo-500' : 'border-transparent hover:text-[var(--text)]'"
        :style="activeTab !== tab ? { color: 'var(--text-muted)' } : {}"
      >{{ tab }}</button>
    </div>

    <div v-if="activeTab === 'Empresa'" class="w-full max-w-2xl">
      <div class="rounded-xl border p-4 lg:p-6 space-y-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Nome da Empresa</label>
            <input value="Pedreira Serra Verde" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">CNPJ</label>
            <input value="12.345.678/0001-99" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Endereço</label>
          <input value="Estrada da Pedreira, km 12 — Cachoeiro de Itapemirim, ES" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Tipo de Empresa</label>
            <select class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none appearance-none" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }">
              <option selected>Pedreira</option>
              <option>Serraria</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Unidade de Medida</label>
            <select class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none appearance-none" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }">
              <option selected>Metro cúbico (m³)</option>
              <option>Toneladas (t)</option>
            </select>
          </div>
        </div>
        <div class="pt-2">
          <button class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Salvar Alterações</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Usuários'">
      <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <div class="px-4 lg:px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b" :style="{ borderColor: 'var(--border)' }">
          <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Usuários com Acesso</h3>
          <button class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus class="w-4 h-4" /> Convidar
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[440px]">
            <thead>
              <tr :style="{ borderBottom: '1px solid var(--border)' }">
                <th v-for="h in ['Usuário', 'E-mail', 'Perfil', 'Ações']" :key="h" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id" class="hover:bg-[var(--surface-hover)] transition-colors" :style="{ borderBottom: '1px solid var(--border)' }">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-semibold shrink-0">{{ u.name[0] }}</div>
                    <span class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ u.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="u.roleBadge">{{ u.role }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Plus } from "lucide-vue-next";

const tabs = ["Empresa", "Usuários"];
const activeTab = ref("Empresa");
const users = [
  { id: 1, name: "Caique Silva",  email: "caique@granity.com",  role: "Gestor",      roleBadge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400" },
  { id: 2, name: "Carlos Mendes", email: "carlos@pedreira.com", role: "Operacional", roleBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  { id: 3, name: "Ana Souza",     email: "ana@pedreira.com",    role: "Operacional", roleBadge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
];
</script>
