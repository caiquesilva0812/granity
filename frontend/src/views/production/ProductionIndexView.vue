<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Produção</h1>
      <RouterLink
        to="/producao/registrar"
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" />
        Registrar Bloco
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="rounded-xl border p-4 lg:p-5"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <p class="text-xs lg:text-sm mb-1" :style="{ color: 'var(--text-muted)' }">{{ card.label }}</p>
        <p class="text-lg lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">{{ card.value }}</p>
      </div>
    </div>

    <div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
      <div class="px-4 lg:px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b" :style="{ borderColor: 'var(--border)' }">
        <h3 class="font-semibold" :style="{ color: 'var(--text)' }">Blocos Extraídos</h3>
        <div class="flex items-center gap-2">
          <select
            class="px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
          >
            <option>Todas as classificações</option>
            <option>Bloco de Primeira</option>
            <option>Bloco de Segunda</option>
            <option>Bloco de Terceira</option>
            <option>Rejeito</option>
          </select>
          <input
            placeholder="Buscar código..."
            class="px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
          />
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[580px]">
          <thead>
            <tr :style="{ borderBottom: '1px solid var(--border)' }">
              <th
                v-for="h in headers"
                :key="h"
                class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                :style="{ color: 'var(--text-muted)' }"
              >{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in blocks"
              :key="row.id"
              class="hover:bg-[var(--surface-hover)] transition-colors"
              :style="{ borderBottom: '1px solid var(--border)' }"
            >
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ row.date }}</td>
              <td class="px-4 py-3 text-sm font-mono font-semibold" :style="{ color: 'var(--text)' }">{{ row.code }}</td>
              <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ row.dimensions }}</td>
              <td class="px-4 py-3 text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ row.volume }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="row.classificationBadge">
                  {{ row.classification }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="viewingBlock = row"
                  class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  :style="{ color: 'var(--text-muted)' }"
                  title="Ver detalhes"
                >
                  <ScanSearch class="w-4 h-4" />
                </button>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="editingBlock = row"
                  class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  :style="{ color: 'var(--text-muted)' }"
                  title="Editar bloco"
                >
                  <Pencil class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BlockDetailsModal v-if="viewingBlock" :block="viewingBlock" @close="viewingBlock = null" />
    <BlockEditModal v-if="editingBlock" :block="editingBlock" @close="editingBlock = null" @save="editingBlock = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { Plus, Pencil, ScanSearch } from "lucide-vue-next";
import BlockDetailsModal from "../../components/production/BlockDetailsModal.vue";
import BlockEditModal from "../../components/production/BlockEditModal.vue";

const headers = ["Data", "Código", "Dimensões (C × L × A)", "Volume (m³)", "Classificação", "Detalhes", "Ações"];

const summaryCards = [
  { label: "Volume Total em Abril", value: "312,4 m³" },
  { label: "Blocos Extraídos",      value: "43 blocos" },
  { label: "Blocos de Primeira",    value: "28 blocos" },
  { label: "Última Extração",       value: "29/04/2025" },
];

const classificationBadges: Record<string, string> = {
  "Bloco de Primeira": "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
  "Bloco de Segunda":  "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  "Bloco de Terceira": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  "Rejeito":           "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
};

const blocks = [
  { id: 1, date: "29/04/2025", code: "BLK-0041", front: "Frente Norte", dimensions: "2,80 × 1,60 × 1,20 m", volume: "5,38 m³",  classification: "Bloco de Primeira", notes: "" },
  { id: 2, date: "29/04/2025", code: "BLK-0040", front: "Frente Norte", dimensions: "2,50 × 1,40 × 1,10 m", volume: "3,85 m³",  classification: "Bloco de Segunda",  notes: "Leve fissura lateral" },
  { id: 3, date: "26/04/2025", code: "BLK-0039", front: "Frente Sul",   dimensions: "3,10 × 1,70 × 1,40 m", volume: "7,37 m³",  classification: "Bloco de Primeira", notes: "" },
  { id: 4, date: "26/04/2025", code: "BLK-0038", front: "Frente Sul",   dimensions: "1,80 × 1,20 × 0,90 m", volume: "1,94 m³",  classification: "Bloco de Terceira", notes: "Quebrado na detonação" },
  { id: 5, date: "24/04/2025", code: "BLK-0037", front: "Frente Leste", dimensions: "2,90 × 1,80 × 1,30 m", volume: "6,79 m³",  classification: "Bloco de Primeira", notes: "" },
  { id: 6, date: "24/04/2025", code: "BLK-0036", front: "Frente Leste", dimensions: "2,60 × 1,50 × 1,20 m", volume: "4,68 m³",  classification: "Bloco de Primeira", notes: "" },
].map(b => ({ ...b, classificationBadge: classificationBadges[b.classification] }));

type Block = (typeof blocks)[number];
const viewingBlock = ref<Block | null>(null);
const editingBlock = ref<Block | null>(null);
</script>
