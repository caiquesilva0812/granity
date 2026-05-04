<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.55);"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          :style="{ background: 'var(--surface)' }"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-5 lg:px-6 py-4 border-b shrink-0"
            :style="{ borderColor: 'var(--border)' }"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono font-semibold text-base" :style="{ color: 'var(--text)' }">
                {{ block.code }}
              </span>
              <span
                v-if="block.materialClassificationName"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400"
              >
                {{ block.materialClassificationName }}
              </span>
            </div>
            <button
              @click="$emit('close')"
              class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              :style="{ color: 'var(--text-muted)' }"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto flex-1 p-5 lg:p-6 space-y-6">

            <!-- Info grid -->
            <div
              class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
            >
              <div>
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Data</p>
                <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ formatDate(block.extractedAt) }}</p>
              </div>
              <div>
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Frente de Lavra</p>
                <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ block.extractionFront ?? '—' }}</p>
              </div>
              <div>
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Tipo</p>
                <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ block.materialTypeName ?? '—' }}</p>
              </div>
              <div>
                <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Status</p>
                <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ statusLabel(block.status) }}</p>
              </div>
            </div>

            <!-- Dimensions -->
            <div>
              <h3 class="text-sm font-semibold mb-3" :style="{ color: 'var(--text)' }">Dimensões</h3>
              <div class="rounded-xl border overflow-hidden" :style="{ borderColor: 'var(--border)' }">
                <table class="w-full text-sm">
                  <thead>
                    <tr :style="{ borderBottom: '1px solid var(--border)', background: 'var(--canvas)' }">
                      <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }"></th>
                      <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">C (m)</th>
                      <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">L (m)</th>
                      <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">A (m)</th>
                      <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Volume (m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr :style="{ borderBottom: '1px solid var(--border)' }">
                      <td class="px-4 py-2.5 text-xs font-medium" :style="{ color: 'var(--text-muted)' }">Bruta</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.c.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.l.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.a.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono font-semibold" :style="{ color: 'var(--text)' }">{{ block.volumeGross.toFixed(3) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2.5 text-xs font-medium" :style="{ color: 'var(--text-muted)' }">Líquida</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.cNet.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.lNet.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono" :style="{ color: 'var(--text)' }">{{ block.aNet.toFixed(2) }}</td>
                      <td class="px-4 py-2.5 text-right font-mono font-semibold text-indigo-500">{{ block.volumeNet.toFixed(3) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Price -->
            <div
              v-if="block.classificationPrice != null"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
            >
              <DollarSign class="w-4 h-4 text-emerald-500 shrink-0" />
              <span class="text-sm" :style="{ color: 'var(--text-muted)' }">Preço da classificação:</span>
              <span class="text-sm font-semibold text-emerald-500">
                {{ block.classificationCurrency }} {{ block.classificationPrice.toFixed(2) }}/m³
              </span>
              <span class="text-sm font-bold ml-auto" :style="{ color: 'var(--text)' }">
                Total: {{ block.classificationCurrency }} {{ (block.classificationPrice * block.volumeNet).toFixed(2) }}
              </span>
            </div>

            <!-- Notes -->
            <div>
              <h3 class="text-sm font-semibold mb-2" :style="{ color: 'var(--text)' }">Observações</h3>
              <p v-if="block.notes" class="text-sm" :style="{ color: 'var(--text)' }">{{ block.notes }}</p>
              <p v-else class="text-sm italic" :style="{ color: 'var(--text-muted)' }">Nenhuma observação registrada.</p>
            </div>

          </div>

          <!-- Footer -->
          <div
            class="flex justify-end px-5 lg:px-6 py-4 border-t shrink-0"
            :style="{ borderColor: 'var(--border)' }"
          >
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, DollarSign } from "lucide-vue-next";
import type { Block } from "../../stores/blocks";

defineProps<{ block: Block }>();
defineEmits<{ close: [] }>();

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DISPONIVEL: "Disponível",
    VENDIDO:    "Vendido",
    RESERVADO:  "Reservado",
    REJEITADO:  "Rejeitado",
  };
  return map[status] ?? status;
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
