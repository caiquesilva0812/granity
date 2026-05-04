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
              <p class="text-xs font-mono font-bold tracking-widest mb-1" :style="{ color: 'var(--text-muted)' }">
                {{ block.code }}
              </p>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="statusBadge(block.status)">
                  {{ statusLabel(block.status) }}
                </span>
                <span
                  v-if="block.materialClassificationName"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="clsBadge(block.materialClassificationName)"
                >
                  {{ block.materialClassificationName }}
                </span>
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
          <div
            v-if="block.classificationPrice && block.classificationCurrency === 'USD'"
            class="rounded-xl p-4 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-3">Valor Estimado</p>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                  {{ fmtUSD(block.classificationPrice * block.volumeNet) }}
                </p>
                <p class="text-sm mt-0.5 text-green-700/60 dark:text-green-400/60 tabular-nums">
                  {{ fmtBRL(block.classificationPrice * block.volumeNet * USD_BRL) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Preço/m³</p>
                <p class="text-sm font-semibold text-green-600 dark:text-green-400">
                  {{ fmtUSD(block.classificationPrice) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Dimensões -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
            <div class="rounded-xl border overflow-hidden" :style="{ borderColor: 'var(--border)' }">
              <div
                class="grid grid-cols-4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-b"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text-muted)' }"
              >
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
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.cNet) }}</span>
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.lNet) }}</span>
                <span class="text-center font-semibold tabular-nums text-indigo-500">{{ fmt(block.aNet) }}</span>
              </div>
            </div>
          </div>

          <!-- Volume -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Volume</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Bruto</p>
                <p class="text-lg font-bold tabular-nums" :style="{ color: 'var(--text)' }">{{ fmtVol(block.volumeGross) }}</p>
              </div>
              <div class="rounded-xl p-4 border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10">
                <p class="text-xs mb-1.5 text-indigo-600 dark:text-indigo-400">Líquido</p>
                <p class="text-lg font-bold tabular-nums text-indigo-600 dark:text-indigo-400">{{ fmtVol(block.volumeNet) }}</p>
              </div>
            </div>
          </div>

          <!-- Extração -->
          <div v-if="block.extractionFront || block.extractedAt">
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Extração</p>
            <div class="grid grid-cols-2 gap-3">
              <div v-if="block.extractionFront" class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Frente de Lavra</p>
                <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ block.extractionFront }}</p>
              </div>
              <div v-if="block.extractedAt" class="rounded-xl p-4 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                <p class="text-xs mb-1.5" :style="{ color: 'var(--text-muted)' }">Data</p>
                <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ fmtDate(block.extractedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Fotos por ângulo -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Fotos do Bloco</p>
            <div class="grid grid-cols-3 gap-2.5">
              <div v-for="slot in angleSlots" :key="slot.angle">
                <div class="rounded-xl overflow-hidden h-24 mb-1.5 border" :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }">
                  <img
                    v-if="photoByAngle(slot.angle)"
                    :src="photoByAngle(slot.angle)!"
                    :alt="slot.label"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1.5">
                    <ImageOff class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                    <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Sem foto</span>
                  </div>
                </div>
                <p class="text-xs text-center" :style="{ color: 'var(--text-muted)' }">{{ slot.label }}</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide mb-3" :style="{ color: 'var(--text-muted)' }">Observações</p>
            <div
              class="rounded-xl p-4 border text-sm"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: block.notes ? 'var(--text)' : 'var(--text-muted)' }"
              :class="{ italic: !block.notes }"
            >
              {{ block.notes || 'Nenhuma observação registrada.' }}
            </div>

            <!-- Fotos de defeitos -->
            <div v-if="block.observationPhotos.length > 0" class="mt-3 flex flex-wrap gap-2">
              <a
                v-for="photo in block.observationPhotos"
                :key="photo.id"
                :href="photo.url"
                target="_blank"
                class="block w-16 h-16 rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                :style="{ borderColor: 'var(--border)' }"
              >
                <img :src="photo.url" :alt="photo.caption ?? 'Foto'" class="w-full h-full object-cover" />
              </a>
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
import type { Block } from "../../stores/blocks";

const props = defineProps<{ block: Block | null }>();
defineEmits<{ close: [] }>();

const USD_BRL = 5.87;

const angleSlots = [
  { angle: "FRENTE",      label: "Frente"    },
  { angle: "TOPO",        label: "Topo"      },
  { angle: "TRASEIRA",    label: "Traseira"  },
  { angle: "LATERAL_ESQ", label: "Lat. Esq." },
  { angle: "LATERAL_DIR", label: "Lat. Dir." },
];

// URLs already normalized (absolute) by the blocks store
function photoByAngle(angle: string): string | null {
  return props.block?.photos.find((p) => p.angle === angle)?.url ?? null;
}

const badgePalette = [
  "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
  "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400",
  "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400",
];

function nameHash(name: string | null): number {
  if (!name) return 0;
  return Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

const clsBadge = (name: string | null) => badgePalette[nameHash(name) % badgePalette.length];

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DISPONIVEL: "Disponível", RESERVADO: "Reservado",
    VENDIDO: "Vendido",       REJEITADO: "Rejeitado",
  };
  return map[status] ?? status;
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    DISPONIVEL: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
    RESERVADO:  "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    VENDIDO:    "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400",
    REJEITADO:  "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
  };
  return map[status] ?? "";
}

const fmt     = (v: number) => v.toFixed(2).replace(".", ",");
const fmtVol  = (v: number) => `${v.toFixed(3).replace(".", ",")} m³`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
const fmtUSD  = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtBRL  = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
