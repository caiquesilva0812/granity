<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="block" class="fixed inset-0 z-40 bg-black/40" @click="$emit('close')" />
    </Transition>

    <Transition name="slide">
      <div
        v-if="block"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] flex flex-col shadow-2xl"
        :style="{ background: 'var(--surface)' }"
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-mono font-bold tracking-widest mb-1" :style="{ color: 'var(--text-muted)' }">{{ block.code }}</p>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="block.statusBadge">{{ block.status }}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="block.classificationBadge">{{ block.classification }}</span>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              :style="{ color: 'var(--text-muted)' }"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto flex-1 p-5 space-y-5">

          <!-- Valor estimado -->
          <div class="rounded-xl p-4 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10">
            <p class="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-3">Valor Estimado</p>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                  {{ fmtUSD(classificationPrice[block.classification] * netVol(block)) }}
                </p>
                <p class="text-sm mt-0.5 text-green-700/60 dark:text-green-400/60 tabular-nums">
                  {{ fmtBRL(classificationPrice[block.classification] * netVol(block) * USD_BRL) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Preço/m³</p>
                <p class="text-sm font-semibold text-green-600 dark:text-green-400">{{ fmtUSD(classificationPrice[block.classification]) }}</p>
              </div>
            </div>
          </div>

          <!-- Dimensões -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
            <div class="rounded-xl border overflow-hidden" :style="{ borderColor: 'var(--border)' }">
              <div class="grid grid-cols-4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-b"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text-muted)' }">
                <span></span>
                <span class="text-center">C</span>
                <span class="text-center">L</span>
                <span class="text-center">A</span>
              </div>
              <div class="grid grid-cols-4 px-4 py-3 text-sm border-b" :style="{ borderColor: 'var(--border)' }">
                <span class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">Bruta</span>
                <span class="text-center font-medium tabular-nums" :style="{ color: 'var(--text)' }">{{ fmt(block.c) }}</span>
                <span class="text-center font-medium tabular-nums" :style="{ color: 'var(--text)' }">{{ fmt(block.l) }}</span>
                <span class="text-center font-medium tabular-nums" :style="{ color: 'var(--text)' }">{{ fmt(block.a) }}</span>
              </div>
              <div class="grid grid-cols-4 px-4 py-3 text-sm">
                <span class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">Líquida</span>
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.c - 0.10) }}</span>
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.l - 0.10) }}</span>
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.a - 0.05) }}</span>
              </div>
            </div>
          </div>

          <!-- Volume -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Volume</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Bruto</p>
                <p class="text-lg font-bold tabular-nums" :style="{ color: 'var(--text)' }">{{ fmtVol(block.c * block.l * block.a) }}</p>
              </div>
              <div class="rounded-xl p-4 border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10">
                <p class="text-xs mb-1.5 text-indigo-600 dark:text-indigo-400">Líquido</p>
                <p class="text-lg font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{{ fmtVol(netVol(block)) }}</p>
              </div>
            </div>
          </div>

          <!-- Extração -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Extração</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Frente de Lavra</p>
                <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.front }}</p>
              </div>
              <div class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Data</p>
                <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.date }}</p>
              </div>
            </div>
          </div>

          <!-- Fotos -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Fotos do Bloco</p>
            <div class="grid grid-cols-3 gap-2.5">
              <div v-for="slot in photoSlots" :key="slot">
                <div
                  class="rounded-xl flex flex-col items-center justify-center gap-1.5 h-24 border mb-1.5"
                  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
                >
                  <ImageOff class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                  <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem foto</span>
                </div>
                <p class="text-xs text-center" :style="{ color: 'var(--text-muted)' }">{{ slot }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Observações</p>
            <div
              class="rounded-xl p-4 border text-sm"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: block.notes ? 'var(--text)' : 'var(--text-muted)' }"
              :class="{ 'italic': !block.notes }"
            >
              {{ block.notes || 'Nenhuma observação registrada.' }}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-5 py-4 border-t shrink-0 flex items-center gap-3" :style="{ borderColor: 'var(--border)' }">
          <button
            type="button"
            class="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Registrar Venda
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
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

const USD_BRL = 5.87;

const classificationPrice: Record<string, number> = {
  "Primeira": 2200,
  "Segunda":  1600,
  "Terceira": 950,
};

defineProps<{
  block: {
    id: number; code: string; c: number; l: number; a: number;
    classification: string; classificationBadge: string;
    front: string; date: string; status: string; statusBadge: string;
    notes: string;
  } | null;
}>();

defineEmits<{ close: [] }>();

function netVol(block: { c: number; l: number; a: number }) {
  return (block.c - 0.10) * (block.l - 0.10) * (block.a - 0.05);
}

const fmt = (v: number) => v.toFixed(2).replace(".", ",");

function fmtVol(v: number) {
  return `${v.toFixed(2).replace(".", ",")} m³`;
}

function fmtUSD(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const photoSlots = ["Frente", "Topo", "Traseira", "Lateral Esq.", "Lateral Dir."];
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
