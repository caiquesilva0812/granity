<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <RouterLink to="/producao" class="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </RouterLink>
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Registrar Bloco</h1>
    </div>

    <div class="w-full max-w-2xl">
      <div class="rounded-xl border p-4 lg:p-6 space-y-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Data da Extração <span class="text-red-400">*</span></label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Frente de Lavra <span class="text-red-400">*</span></label>
            <select
              v-model="form.front"
              class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
            >
              <option value="">Selecione...</option>
              <option>Frente Norte</option>
              <option>Frente Sul</option>
              <option>Frente Leste</option>
              <option>Frente Oeste</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">
            Dimensões do Bloco (metros) <span class="text-red-400">*</span>
          </label>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Comprimento</label>
              <input v-model.number="form.length" type="number" step="0.01" placeholder="0,00"
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
            </div>
            <div>
              <label class="block text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Largura</label>
              <input v-model.number="form.width" type="number" step="0.01" placeholder="0,00"
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
            </div>
            <div>
              <label class="block text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Altura</label>
              <input v-model.number="form.height" type="number" step="0.01" placeholder="0,00"
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }" />
            </div>
          </div>

          <div
            v-if="calculatedVolume > 0"
            class="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg border"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
          >
            <Box class="w-4 h-4 text-indigo-500" />
            <span class="text-sm" :style="{ color: 'var(--text-muted)' }">Volume calculado:</span>
            <span class="text-sm font-bold text-indigo-500">{{ calculatedVolume.toFixed(2) }} m³</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text)' }">Classificação <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="option in classifications"
              :key="option.value"
              type="button"
              @click="form.classification = option.value"
              class="py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors text-center"
              :class="form.classification === option.value ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'hover:bg-[var(--surface-hover)]'"
              :style="form.classification !== option.value ? { borderColor: 'var(--border)', color: 'var(--text-muted)' } : {}"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-3" :style="{ color: 'var(--text)' }">
            Fotos do Bloco
            <span class="font-normal text-xs ml-1" :style="{ color: 'var(--text-muted)' }">(opcional)</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="slot in photoSlots" :key="slot.label" class="space-y-1.5">
              <p class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">{{ slot.label }}</p>
              <div
                class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 h-28 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                :style="{ borderColor: 'var(--border)' }"
              >
                <Camera class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Clique para enviar</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">Observações</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Ex: Leve fissura lateral, quebrado na detonação..."
            class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
          />
          <div>
            <p class="text-xs mb-2" :style="{ color: 'var(--text-muted)' }">Fotos das observações (opcional)</p>
            <div
              class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 h-20 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
              :style="{ borderColor: 'var(--border)' }"
            >
              <ImagePlus class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
              <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Adicionar fotos</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button type="button" class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
            Salvar Bloco
          </button>
          <RouterLink
            to="/producao"
            class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
            :style="{ borderColor: 'var(--border)', color: 'var(--text)' }"
          >
            Cancelar
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { RouterLink } from "vue-router";
import { ArrowLeft, Box, Camera, ImagePlus } from "lucide-vue-next";

const form = reactive({ date: "", front: "", length: null as number | null, width: null as number | null, height: null as number | null, classification: "", notes: "" });
const classifications = [
  { value: "Bloco de Primeira", label: "Primeira" },
  { value: "Bloco de Segunda",  label: "Segunda" },
  { value: "Bloco de Terceira", label: "Terceira" },
  { value: "Rejeito",           label: "Rejeito" },
];
const photoSlots = [
  { label: "Frente" },
  { label: "Topo" },
  { label: "Traseira" },
  { label: "Lateral Esq." },
  { label: "Lateral Dir." },
];

const calculatedVolume = computed(() => {
  const { length, width, height } = form;
  if (!length || !width || !height) return 0;
  return length * width * height;
});
</script>
