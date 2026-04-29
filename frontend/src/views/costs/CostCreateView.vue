<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <RouterLink to="/custos" class="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </RouterLink>
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Lançar Custo</h1>
    </div>

    <div class="w-full max-w-2xl">
      <div class="rounded-xl border p-4 lg:p-6 space-y-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Tipo de Custo <span class="text-red-400">*</span></label>
            <select v-model="form.type" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }">
              <option value="">Selecione...</option>
              <option>Diesel</option>
              <option>Mão de Obra</option>
              <option>Manutenção</option>
              <option>Explosivos</option>
              <option>Energia</option>
              <option>Outros</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Data <span class="text-red-400">*</span></label>
            <input v-model="form.date" type="date" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Valor (R$) <span class="text-red-400">*</span></label>
            <input v-model="form.value" type="number" placeholder="0,00" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Relacionar à Extração</label>
            <select v-model="form.extractionId" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }">
              <option value="">Nenhuma (opcional)</option>
              <option value="1">29/04 — Frente Norte — BLK-0041</option>
              <option value="2">26/04 — Frente Sul — BLK-0039</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Descrição <span class="text-red-400">*</span></label>
          <input v-model="form.description" type="text" placeholder="Ex: Abastecimento — 450 litros de diesel" class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Observações</label>
          <textarea v-model="form.notes" rows="3" placeholder="Informações adicionais..." class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Salvar Custo</button>
          <RouterLink to="/custos" class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]" :style="{ borderColor: 'var(--border)', color: 'var(--text)' }">Cancelar</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

const form = reactive({ type: "", date: "", value: "", extractionId: "", description: "", notes: "" });
</script>
