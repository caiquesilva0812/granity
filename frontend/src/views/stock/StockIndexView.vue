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

    <!-- Summary cards -->
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

    <!-- Block cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div
        v-for="block in blocks"
        :key="block.id"
        @click="selectedBlock = block"
        class="rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <!-- Accent bar -->
        <div class="h-1 w-full" :class="classificationAccent[block.classification]" />

        <div class="p-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-bold tracking-wider" :style="{ color: 'var(--text-muted)' }">{{ block.code }}</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="block.statusBadge">{{ block.status }}</span>
          </div>

          <!-- Classification + price/m³ -->
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold" :class="block.classificationBadge">{{ block.classification }}</span>
            <span class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">{{ fmtUSD(classificationPrice[block.classification]) }}/m³</span>
          </div>

          <!-- Dimensions -->
          <div class="rounded-lg p-3 mb-3" :style="{ background: 'var(--canvas)' }">
            <p class="text-xs font-semibold uppercase tracking-wide mb-2" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Bruta</span>
                <span class="text-xs font-medium tabular-nums" :style="{ color: 'var(--text)' }">{{ fmtDim(block.c, block.l, block.a) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Líquida</span>
                <span class="text-xs font-medium tabular-nums text-indigo-500">{{ fmtDim(block.c - 0.10, block.l - 0.10, block.a - 0.05) }}</span>
              </div>
            </div>
          </div>

          <!-- Volume -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="rounded-lg p-2.5" :style="{ background: 'var(--canvas)' }">
              <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Bruto</p>
              <p class="text-sm font-semibold tabular-nums" :style="{ color: 'var(--text)' }">{{ fmtVol(block.c * block.l * block.a) }}</p>
            </div>
            <div class="rounded-lg p-2.5" :style="{ background: 'var(--canvas)' }">
              <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Líquido</p>
              <p class="text-sm font-semibold tabular-nums text-indigo-500">{{ fmtVol(netVol(block)) }}</p>
            </div>
          </div>

          <!-- Estimated value -->
          <div class="rounded-lg p-3 mb-4 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10">
            <p class="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-1.5">Valor Estimado</p>
            <p class="text-base font-bold text-green-600 dark:text-green-400 tabular-nums">{{ fmtUSD(classificationPrice[block.classification] * netVol(block)) }}</p>
            <p class="text-xs mt-0.5 text-green-700/60 dark:text-green-400/60 tabular-nums">{{ fmtBRL(classificationPrice[block.classification] * netVol(block) * USD_BRL) }}</p>
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-3" :style="{ color: 'var(--text-muted)' }">
            <div class="flex items-center gap-1.5">
              <MapPin class="w-3 h-3 shrink-0" />
              <span class="text-xs">{{ block.front }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Calendar class="w-3 h-3 shrink-0" />
              <span class="text-xs">{{ block.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BlockStockDrawer :block="selectedBlock" @close="selectedBlock = null" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MapPin, Calendar } from "lucide-vue-next";
import BlockStockDrawer from "../../components/stock/BlockStockDrawer.vue";

const USD_BRL = 5.87;

const classificationPrice: Record<string, number> = {
  "Primeira": 2200,
  "Segunda":  1600,
  "Terceira": 950,
};

const classificationAccent: Record<string, string> = {
  "Primeira": "bg-emerald-500",
  "Segunda":  "bg-blue-500",
  "Terceira": "bg-amber-500",
};

function netVol(block: { c: number; l: number; a: number }) {
  return (block.c - 0.10) * (block.l - 0.10) * (block.a - 0.05);
}

function fmtDim(c: number, l: number, a: number) {
  const f = (v: number) => v.toFixed(2).replace(".", ",");
  return `${f(c)} × ${f(l)} × ${f(a)} m`;
}

function fmtVol(v: number) {
  return `${v.toFixed(2).replace(".", ",")} m³`;
}

function fmtUSD(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const summary = [
  { label: "Total em Estoque",  value: "43 blocos" },
  { label: "Volume Total (m³)", value: "198,4 m³" },
  { label: "Disponíveis",       value: "31 blocos" },
  { label: "Reservados",        value: "12 blocos" },
];

const blocks = [
  { id: 1, code: "BLK-0041", c: 2.80, l: 1.60, a: 1.20, classification: "Primeira", classificationBadge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", front: "Frente Norte", date: "29/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 2, code: "BLK-0040", c: 3.10, l: 1.70, a: 1.40, classification: "Primeira", classificationBadge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", front: "Frente Norte", date: "29/04", status: "Reservado",  statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", notes: "" },
  { id: 3, code: "BLK-0039", c: 2.50, l: 1.40, a: 1.10, classification: "Segunda",  classificationBadge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",             front: "Frente Sul",   date: "26/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "Leve fissura lateral" },
  { id: 4, code: "BLK-0038", c: 2.90, l: 1.80, a: 1.30, classification: "Primeira", classificationBadge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", front: "Frente Leste", date: "24/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 5, code: "BLK-0037", c: 3.00, l: 1.60, a: 1.30, classification: "Primeira", classificationBadge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", front: "Frente Sul",   date: "26/04", status: "Reservado",  statusBadge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", notes: "" },
  { id: 6, code: "BLK-0036", c: 2.60, l: 1.50, a: 1.20, classification: "Segunda",  classificationBadge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",             front: "Frente Leste", date: "24/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 7, code: "BLK-0035", c: 2.70, l: 1.70, a: 1.20, classification: "Primeira", classificationBadge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", front: "Frente Norte", date: "22/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "" },
  { id: 8, code: "BLK-0034", c: 2.40, l: 1.50, a: 1.10, classification: "Terceira", classificationBadge: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",         front: "Frente Sul",   date: "22/04", status: "Disponível", statusBadge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",   notes: "Quebrado na detonação" },
];

type Block = (typeof blocks)[number];
const selectedBlock = ref<Block | null>(null);
</script>
