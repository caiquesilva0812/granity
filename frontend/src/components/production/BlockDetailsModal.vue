<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.55);">
      <div
        class="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        :style="{ background: 'var(--surface)' }"
      >
        <div class="flex items-center justify-between px-5 lg:px-6 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
          <div class="flex items-center gap-3">
            <span class="font-mono font-semibold text-base" :style="{ color: 'var(--text)' }">{{ block.code }}</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="block.classificationBadge">
              {{ block.classification }}
            </span>
          </div>
          <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" :style="{ color: 'var(--text-muted)' }">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-5 lg:p-6 space-y-6">

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
            <div>
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Data</p>
              <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ block.date }}</p>
            </div>
            <div>
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
              <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ block.dimensions }}</p>
            </div>
            <div>
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Volume</p>
              <p class="text-sm font-bold text-indigo-500">{{ block.volume }}</p>
            </div>
            <div>
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Frente de Lavra</p>
              <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ block.front }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold mb-3" :style="{ color: 'var(--text)' }">Fotos do Bloco</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="slot in photoSlots" :key="slot.label" class="space-y-1.5">
                <p class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">{{ slot.label }}</p>
                <div
                  class="rounded-xl flex flex-col items-center justify-center gap-1.5 h-32 border"
                  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
                >
                  <ImageOff class="w-6 h-6" :style="{ color: 'var(--text-muted)' }" />
                  <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem foto</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold mb-2" :style="{ color: 'var(--text)' }">Observações</h3>
            <p v-if="block.notes" class="text-sm" :style="{ color: 'var(--text)' }">{{ block.notes }}</p>
            <p v-else class="text-sm italic" :style="{ color: 'var(--text-muted)' }">Nenhuma observação registrada.</p>
            <div class="mt-3 rounded-xl flex flex-col items-center justify-center gap-1.5 h-16 border"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
              <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem fotos nas observações</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end px-5 lg:px-6 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
          <button type="button" @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
            :style="{ borderColor: 'var(--border)', color: 'var(--text)' }">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, ImageOff } from "lucide-vue-next";

defineProps<{
  block: {
    id: number; code: string; date: string; front: string;
    dimensions: string; volume: string; classification: string;
    classificationBadge: string; notes: string;
  };
}>();

defineEmits<{ close: [] }>();

const photoSlots = [
  { label: "Frente" },
  { label: "Topo" },
  { label: "Traseira" },
  { label: "Lateral Esq." },
  { label: "Lateral Dir." },
];
</script>
