<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="block"
        class="fixed inset-0 z-40 bg-black/40"
        @click="$emit('close')"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="block"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] flex flex-col shadow-2xl"
        :style="{ background: 'var(--surface)' }"
      >
        <div
          class="flex items-start justify-between px-5 py-4 border-b shrink-0"
          :style="{ borderColor: 'var(--border)' }"
        >
          <div class="space-y-1.5">
            <span class="font-mono font-bold text-lg" :style="{ color: 'var(--text)' }">{{ block.code }}</span>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="block.statusBadge">
                {{ block.status }}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="block.classificationBadge">
                {{ block.classification }}
              </span>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors mt-0.5"
            :style="{ color: 'var(--text-muted)' }"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-5 space-y-6">

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl p-3.5 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
              <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.dimensions }}</p>
            </div>
            <div class="rounded-xl p-3.5 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Volume</p>
              <p class="text-sm font-bold text-indigo-500">{{ block.volume }}</p>
            </div>
            <div class="rounded-xl p-3.5 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Frente de Lavra</p>
              <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.front }}</p>
            </div>
            <div class="rounded-xl p-3.5 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
              <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Data de Extração</p>
              <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.date }}</p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold mb-3" :style="{ color: 'var(--text)' }">Fotos do Bloco</h3>
            <div class="grid grid-cols-3 gap-2.5">
              <div v-for="slot in photoSlots" :key="slot.label" class="space-y-1.5">
                <p class="text-xs font-medium truncate" :style="{ color: 'var(--text-muted)' }">{{ slot.label }}</p>
                <div
                  class="rounded-xl flex flex-col items-center justify-center gap-1 h-24 border"
                  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
                >
                  <ImageOff class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
                  <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem foto</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold mb-2" :style="{ color: 'var(--text)' }">Observações</h3>
            <p v-if="block.notes" class="text-sm" :style="{ color: 'var(--text)' }">{{ block.notes }}</p>
            <p v-else class="text-sm italic" :style="{ color: 'var(--text-muted)' }">Nenhuma observação registrada.</p>
            <div
              class="mt-3 rounded-xl flex items-center justify-center gap-2 h-14 border"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
            >
              <ImageOff class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
              <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem fotos nas observações</span>
            </div>
          </div>
        </div>

        <div
          class="px-5 py-4 border-t shrink-0 flex items-center justify-between"
          :style="{ borderColor: 'var(--border)' }"
        >
          <button
            type="button"
            class="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Registrar Venda
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
            :style="{ borderColor: 'var(--border)', color: 'var(--text)' }"
          >
            Fechar
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, ImageOff } from "lucide-vue-next";

defineProps<{
  block: {
    id: number; code: string; dimensions: string; volume: string;
    classification: string; classificationBadge: string;
    front: string; date: string; status: string; statusBadge: string;
    notes: string;
  } | null;
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
