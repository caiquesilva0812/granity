<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <RouterLink
        to="/configuracoes"
        class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        :style="{ color: 'var(--text-muted)' }"
      >
        <ArrowLeft class="w-5 h-5" />
      </RouterLink>
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Empresa</h1>
    </div>

    <div class="w-full max-w-2xl">
      <div class="rounded-xl border p-4 lg:p-6 space-y-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Nome da Empresa</label>
            <input
              value="Pedreira Serra Verde"
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">CNPJ</label>
            <input
              value="12.345.678/0001-99"
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Endereço</label>
          <input
            value="Estrada da Pedreira, km 12 — Cachoeiro de Itapemirim, ES"
            class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Tipo de Empresa</label>
            <select
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none appearance-none"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            >
              <option selected>Pedreira</option>
              <option>Serraria</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Unidade de Medida</label>
            <select
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none appearance-none"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            >
              <option selected>Metro cúbico (m³)</option>
              <option>Toneladas (t)</option>
            </select>
          </div>
        </div>
        <div class="pt-2">
          <button class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
</script>
