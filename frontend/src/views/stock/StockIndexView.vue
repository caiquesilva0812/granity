<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl lg:text-2xl font-bold" :style="{ color: 'var(--text)' }">Estoque de Blocos</h1>
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="filterStatus"
          class="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          :style="{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }"
        >
          <option value="">Todos os status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="RESERVADO">Reservado</option>
          <option value="VENDIDO">Vendido</option>
          <option value="REJEITADO">Rejeitado</option>
        </select>

        <select
          v-model="filterClassification"
          class="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          :style="{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }"
        >
          <option value="">Todas as classificações</option>
          <option v-for="cls in uniqueClassifications" :key="cls" :value="cls">{{ cls }}</option>
        </select>

        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4" />
          Registrar Bloco
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-4">
      <div
        v-for="s in summaryCards"
        :key="s.label"
        class="rounded-xl border p-4 lg:p-5"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">{{ s.label }}</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="s.iconBg">
            <component :is="s.icon" class="w-4 h-4" :class="s.iconColor" />
          </div>
        </div>
        <p class="text-2xl lg:text-3xl font-bold tabular-nums" :style="{ color: 'var(--text)' }">{{ s.value }}</p>
        <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ s.sub }}</p>
      </div>

      <!-- Valor total estimado -->
      <div
        class="rounded-xl border p-4 lg:p-5 col-span-2 xl:col-span-1"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Valor Estimado</p>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <DollarSign class="w-4 h-4 text-emerald-500" />
          </div>
        </div>
        <p class="text-2xl lg:text-3xl font-bold tabular-nums" :style="{ color: 'var(--text)' }">
          {{ fmtUSD(totalEstimatedUSD) }}
        </p>
        <p class="text-xs mt-0.5 tabular-nums" :style="{ color: 'var(--text-muted)' }">
          {{ fmtBRL(totalEstimatedUSD * USD_BRL) }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="filteredBlocks.length === 0"
      class="flex flex-col items-center justify-center py-20 rounded-xl border gap-3"
      :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
    >
      <Package class="w-10 h-10" :style="{ color: 'var(--text-muted)' }" />
      <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
        {{ blocksStore.blocks.length === 0 ? 'Nenhum bloco registrado ainda.' : 'Nenhum bloco corresponde aos filtros.' }}
      </p>
      <button
        v-if="blocksStore.blocks.length === 0"
        @click="showCreateModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" />
        Registrar primeiro bloco
      </button>
    </div>

    <!-- Block cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
      <div
        v-for="block in filteredBlocks"
        :key="block.id"
        @click="selectedBlock = block"
        class="rounded-xl border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <!-- Accent bar por classificação -->
        <div class="h-1 w-full" :class="clsAccent(block.materialClassificationName)" />

        <div class="p-4">
          <!-- Code + preço/m³ -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono font-bold tracking-wider" :style="{ color: 'var(--text-muted)' }">{{ block.code }}</span>
            <span class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">
              <template v-if="block.classificationPrice">
                {{ block.classificationCurrency }} {{ block.classificationPrice.toFixed(0) }}/m³
              </template>
            </span>
          </div>

          <!-- Status + Classificação lado a lado -->
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusBadge(block.status)">
              {{ statusLabel(block.status) }}
            </span>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold"
              :class="clsBadge(block.materialClassificationName)"
            >
              {{ block.materialClassificationName ?? '—' }}
            </span>
          </div>

          <!-- Dimensões -->
          <div class="rounded-lg p-3 mb-3" :style="{ background: 'var(--canvas)' }">
            <p class="text-xs font-semibold uppercase tracking-wide mb-2" :style="{ color: 'var(--text-muted)' }">Dimensões</p>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Bruta</span>
                <span class="text-xs font-medium tabular-nums" :style="{ color: 'var(--text)' }">
                  {{ fmtDim(block.c, block.l, block.a) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Líquida</span>
                <span class="text-xs font-medium tabular-nums text-indigo-500">
                  {{ fmtDim(block.cNet, block.lNet, block.aNet) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Volume -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="rounded-lg p-2.5" :style="{ background: 'var(--canvas)' }">
              <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Bruto</p>
              <p class="text-sm font-semibold tabular-nums" :style="{ color: 'var(--text)' }">{{ fmtVol(block.volumeGross) }}</p>
            </div>
            <div class="rounded-lg p-2.5" :style="{ background: 'var(--canvas)' }">
              <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Líquido</p>
              <p class="text-sm font-semibold tabular-nums text-indigo-500">{{ fmtVol(block.volumeNet) }}</p>
            </div>
          </div>

          <!-- Valor estimado -->
          <div
            v-if="block.classificationPrice && block.classificationCurrency === 'USD'"
            class="rounded-lg p-3 mb-4 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-1.5">Valor Estimado</p>
            <p class="text-base font-bold text-green-600 dark:text-green-400 tabular-nums">
              {{ fmtUSD(block.classificationPrice * block.volumeNet) }}
            </p>
            <p class="text-xs mt-0.5 text-green-700/60 dark:text-green-400/60 tabular-nums">
              {{ fmtBRL(block.classificationPrice * block.volumeNet * USD_BRL) }}
            </p>
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-3" :style="{ color: 'var(--text-muted)' }">
            <div v-if="block.extractionFront" class="flex items-center gap-1.5">
              <MapPin class="w-3 h-3 shrink-0" />
              <span class="text-xs truncate">{{ block.extractionFront }}</span>
            </div>
            <div v-if="block.extractedAt" class="flex items-center gap-1.5 ml-auto">
              <Calendar class="w-3 h-3 shrink-0" />
              <span class="text-xs">{{ fmtDate(block.extractedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BlockStockDrawer :block="selectedBlock" @close="selectedBlock = null" />

    <BlockCreateModal
      :open="showCreateModal"
      @close="showCreateModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Calendar, CheckCircle2, Clock, DollarSign, Layers, MapPin, Package, Plus } from "lucide-vue-next";
import { useCompanyStore } from "../../stores/company";
import { useBlocksStore, type Block } from "../../stores/blocks";
import BlockStockDrawer from "../../components/stock/BlockStockDrawer.vue";
import BlockCreateModal from "../../components/production/BlockCreateModal.vue";

const companyStore = useCompanyStore();
const blocksStore  = useBlocksStore();

const loading         = ref(false);
const selectedBlock   = ref<Block | null>(null);
const showCreateModal = ref(false);
const filterStatus          = ref("");
const filterClassification  = ref("");

const USD_BRL = 5.87;

// ── Paleta estável por nome de classificação ───────────────────────────────
const accentPalette = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"];
const badgePalette  = [
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

const clsAccent = (name: string | null) => accentPalette[nameHash(name) % accentPalette.length];
const clsBadge  = (name: string | null) => badgePalette[nameHash(name) % badgePalette.length];

// ── Status ─────────────────────────────────────────────────────────────────
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

// ── Formatação ─────────────────────────────────────────────────────────────
const fmt    = (v: number) => v.toFixed(2).replace(".", ",");
const fmtDim = (c: number, l: number, a: number) => `${fmt(c)} × ${fmt(l)} × ${fmt(a)} m`;
const fmtVol = (v: number) => `${v.toFixed(2).replace(".", ",")} m³`;
const fmtUSD = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

// ── Computed ───────────────────────────────────────────────────────────────
const uniqueClassifications = computed(() =>
  [...new Set(blocksStore.blocks.map((b) => b.materialClassificationName).filter((n): n is string => !!n))],
);

const filteredBlocks = computed(() => {
  let list = blocksStore.blocks;
  if (filterStatus.value)         list = list.filter((b) => b.status === filterStatus.value);
  if (filterClassification.value) list = list.filter((b) => b.materialClassificationName === filterClassification.value);
  return list;
});

const totalEstimatedUSD = computed(() =>
  blocksStore.blocks
    .filter((b) => b.classificationPrice !== null && b.classificationCurrency === "USD")
    .reduce((sum, b) => sum + b.classificationPrice! * b.volumeNet, 0),
);

const summaryCards = computed(() => {
  const blocks   = blocksStore.blocks;
  const totalVol = blocks.reduce((s, b) => s + b.volumeGross, 0);
  return [
    {
      label:     "Total em Estoque",
      value:     `${blocks.length}`,
      sub:       "blocos",
      icon:      Package,
      iconBg:    "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label:     "Volume Total",
      value:     totalVol.toFixed(1).replace(".", ","),
      sub:       "m³ extraídos",
      icon:      Layers,
      iconBg:    "bg-indigo-500/10",
      iconColor: "text-indigo-500",
    },
    {
      label:     "Disponíveis",
      value:     `${blocks.filter((b) => b.status === "DISPONIVEL").length}`,
      sub:       "blocos",
      icon:      CheckCircle2,
      iconBg:    "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      label:     "Reservados",
      value:     `${blocks.filter((b) => b.status === "RESERVADO").length}`,
      sub:       "blocos",
      icon:      Clock,
      iconBg:    "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ];
});

onMounted(async () => {
  if (!companyStore.selectedId) return;
  loading.value = true;
  await blocksStore.fetchBlocks(companyStore.selectedId);
  loading.value = false;
});
</script>
