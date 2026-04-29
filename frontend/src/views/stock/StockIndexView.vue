<template>
  <div class="space-y-4 lg:space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Estoque de Blocos</h1>
      <div class="flex flex-wrap items-center gap-2">
        <select
          class="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          :style="{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }"
        >
          <option>Todos os status</option>
          <option>Disponível</option>
          <option>Vendido</option>
          <option>Reservado</option>
        </select>
        <select
          class="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          :style="{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }"
        >
          <option>Todas as classificações</option>
          <option>Bloco de Primeira</option>
          <option>Bloco de Segunda</option>
          <option>Bloco de Terceira</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div
        v-for="s in summary"
        :key="s.label"
        class="rounded-xl border p-4 lg:p-5"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <p class="text-xs lg:text-sm mb-1" :style="{ color: 'var(--text-muted)' }">{{ s.label }}</p>
        <p class="text-lg lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">{{ s.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div
        v-for="block in blocks"
        :key="block.id"
        @click="selectedBlock = block"
        class="rounded-xl border p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs font-mono font-semibold" :style="{ color: 'var(--text-muted)' }">{{ block.code }}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="block.statusBadge">{{ block.status }}</span>
        </div>
        <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
        <p class="font-medium text-sm mb-3" :style="{ color: 'var(--text)' }">{{ block.dimensions }}</p>
        <div class="flex items-center justify-between mb-2">
          <div>
            <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Volume</p>
            <p class="text-base font-bold text-indigo-500">{{ block.volume }}</p>
          </div>
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium" :class="block.classificationBadge">{{ block.classification }}</span>
        </div>
        <p class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ block.front }} · {{ block.date }}</p>
      </div>
    </div>

    <BlockStockDrawer :block="selectedBlock" @close="selectedBlock = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BlockStockDrawer from "../../components/stock/BlockStockDrawer.vue";

const summary = [
  { label: "Total em Estoque",  value: "43 blocos" },
  { label: "Volume Total (m³)", value: "198,4 m³" },
  { label: "Disponíveis",       value: "31 blocos" },
  { label: "Reservados",        value: "12 blocos" },
];

const blocks = [
  { id: 1, code: "BLK-0041", dimensions: "2,80 × 1,60 × 1,20 m", volume: "5,38 m³", classification: "Primeira", classificationBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   front: "Frente Norte", date: "29/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 2, code: "BLK-0040", dimensions: "3,10 × 1,70 × 1,40 m", volume: "7,37 m³", classification: "Primeira", classificationBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   front: "Frente Norte", date: "29/04", status: "Reservado",  statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", notes: "" },
  { id: 3, code: "BLK-0039", dimensions: "2,50 × 1,40 × 1,10 m", volume: "3,85 m³", classification: "Segunda",  classificationBadge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",         front: "Frente Sul",   date: "26/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "Leve fissura lateral" },
  { id: 4, code: "BLK-0038", dimensions: "2,90 × 1,80 × 1,30 m", volume: "6,79 m³", classification: "Primeira", classificationBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   front: "Frente Leste", date: "24/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 5, code: "BLK-0037", dimensions: "3,00 × 1,60 × 1,30 m", volume: "6,24 m³", classification: "Primeira", classificationBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   front: "Frente Sul",   date: "26/04", status: "Reservado",  statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", notes: "" },
  { id: 6, code: "BLK-0036", dimensions: "2,60 × 1,50 × 1,20 m", volume: "4,68 m³", classification: "Segunda",  classificationBadge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",         front: "Frente Leste", date: "24/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 7, code: "BLK-0035", dimensions: "2,70 × 1,70 × 1,20 m", volume: "5,51 m³", classification: "Primeira", classificationBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   front: "Frente Norte", date: "22/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 8, code: "BLK-0034", dimensions: "2,40 × 1,50 × 1,10 m", volume: "3,96 m³", classification: "Terceira", classificationBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", front: "Frente Sul",   date: "22/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "Quebrado na detonação" },
];

type Block = (typeof blocks)[number];
const selectedBlock = ref<Block | null>(null);
</script>
