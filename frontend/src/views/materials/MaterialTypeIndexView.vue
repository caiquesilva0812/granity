<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink
          to="/configuracoes"
          class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          :style="{ color: 'var(--text-muted)' }"
        >
          <ArrowLeft class="w-5 h-5" />
        </RouterLink>
        <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Tipos de Material</h1>
      </div>
      <button
        @click="openCreateType"
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" /> Novo Tipo
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="materialTypes.length === 0"
      class="rounded-xl border p-12 flex flex-col items-center gap-3"
      :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
    >
      <Gem class="w-10 h-10" :style="{ color: 'var(--text-muted)' }" />
      <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">Nenhum tipo cadastrado</p>
      <p class="text-xs" :style="{ color: 'var(--text-muted)' }">Crie um tipo de material para começar a classificar seus blocos.</p>
      <button
        @click="openCreateType"
        class="mt-1 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" /> Novo Tipo
      </button>
    </div>

    <!-- Grid de tipos -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="type in materialTypes"
        :key="type.id"
        @click="openDrawer(type)"
        class="rounded-xl border overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
        :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
      >
        <div class="h-1 w-full bg-primary" />
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Gem class="w-5 h-5 text-primary" />
            </div>
            <span
              class="text-xs font-medium px-2.5 py-1 rounded-full"
              :style="{ background: 'var(--canvas)', color: 'var(--text-muted)' }"
            >
              {{ type.classifications.length }} classificações
            </span>
          </div>

          <h3 class="font-semibold text-sm mb-1" :style="{ color: 'var(--text)' }">{{ type.name }}</h3>
          <p v-if="type.description" class="text-xs mb-4 line-clamp-2" :style="{ color: 'var(--text-muted)' }">{{ type.description }}</p>
          <p v-else class="text-xs mb-4 italic" :style="{ color: 'var(--text-muted)' }">Sem descrição</p>

          <!-- Preview das classificações -->
          <div class="space-y-1.5">
            <div
              v-for="cls in type.classifications.slice(0, 3)"
              :key="cls.id"
              class="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
              :style="{ background: 'var(--canvas)' }"
            >
              <span class="font-medium" :style="{ color: 'var(--text)' }">{{ cls.name }}</span>
              <span class="font-semibold text-green-600 dark:text-green-400">
                {{ cls.currency === 'USD' ? '$' : 'R$' }}{{ cls.price.toLocaleString('pt-BR') }}
              </span>
            </div>
            <p
              v-if="type.classifications.length > 3"
              class="text-xs text-center pt-1"
              :style="{ color: 'var(--text-muted)' }"
            >
              +{{ type.classifications.length - 3 }} mais
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals e Drawer -->
    <MaterialTypeFormModal
      :open="typeModalOpen"
      :editing="editingType"
      @close="typeModalOpen = false"
      @save="saveType"
    />

    <MaterialTypeDrawer
      :material-type="selectedType"
      @close="selectedType = null"
      @edit="openEditType"
      @add-classification="openCreateClassification"
      @edit-classification="openEditClassification"
      @delete-classification="deleteClassification"
    />

    <ClassificationFormModal
      :open="classificationModalOpen"
      :editing="editingClassification"
      :material-type-name="selectedType?.name ?? ''"
      @close="classificationModalOpen = false"
      @save="saveClassification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useToast } from "vue-toastification";
import { ArrowLeft, Plus, Gem } from "lucide-vue-next";
import api from "../../helpers/api";
import { extractErrorMessage } from "../../helpers/apiError";
import { useCompanyStore } from "../../stores/company";
import MaterialTypeDrawer from "../../components/materials/MaterialTypeDrawer.vue";
import MaterialTypeFormModal from "../../components/materials/MaterialTypeFormModal.vue";
import ClassificationFormModal from "../../components/materials/ClassificationFormModal.vue";

export interface Classification {
  id:       string;
  name:     string;
  price:    number;
  currency: "USD" | "BRL";
}

export interface MaterialType {
  id:              string;
  name:            string;
  description:     string | null;
  classifications: Classification[];
}

const toast        = useToast();
const companyStore = useCompanyStore();

const materialTypes = ref<MaterialType[]>([]);

const baseUrl = () =>
  `/api/v1/companies/${companyStore.selectedId}/material-types`;

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchTypes() {
  if (!companyStore.selectedId) return;
  try {
    const res           = await api.get<MaterialType[]>(baseUrl());
    materialTypes.value = res.data;
  } catch (error) {
    toast.error(extractErrorMessage(error, "Erro ao carregar tipos de material."));
  }
}

onMounted(fetchTypes);

// ── Drawer ────────────────────────────────────────────────────────────────────
const selectedType = ref<MaterialType | null>(null);

function openDrawer(type: MaterialType) {
  selectedType.value = type;
}

function syncDrawer(updated: MaterialType) {
  const idx = materialTypes.value.findIndex((m) => m.id === updated.id);
  if (idx !== -1) materialTypes.value[idx] = updated;
  if (selectedType.value?.id === updated.id) selectedType.value = updated;
}

// ── Modal de tipo ─────────────────────────────────────────────────────────────
const typeModalOpen = ref(false);
const editingType   = ref<MaterialType | null>(null);

function openCreateType() {
  editingType.value   = null;
  typeModalOpen.value = true;
}

function openEditType(type: MaterialType) {
  editingType.value   = type;
  typeModalOpen.value = true;
}

async function saveType(data: { name: string; description: string }) {
  try {
    if (editingType.value) {
      const res = await api.patch<MaterialType>(`${baseUrl()}/${editingType.value.id}`, data);
      syncDrawer(res.data);
    } else {
      const res = await api.post<MaterialType>(baseUrl(), data);
      materialTypes.value.push(res.data);
    }
    typeModalOpen.value = false;
  } catch (error) {
    toast.error(extractErrorMessage(error, "Erro ao salvar tipo de material."));
  }
}

// ── Modal de classificação ────────────────────────────────────────────────────
const classificationModalOpen = ref(false);
const editingClassification   = ref<Classification | null>(null);

function openCreateClassification() {
  editingClassification.value   = null;
  classificationModalOpen.value = true;
}

function openEditClassification(cls: Classification) {
  editingClassification.value   = cls;
  classificationModalOpen.value = true;
}

async function saveClassification(data: { name: string; price: number; currency: "USD" | "BRL" }) {
  if (!selectedType.value) return;
  try {
    const typeUrl = `${baseUrl()}/${selectedType.value.id}/classifications`;
    if (editingClassification.value) {
      const res = await api.patch<MaterialType>(`${typeUrl}/${editingClassification.value.id}`, data);
      syncDrawer(res.data);
    } else {
      const res = await api.post<MaterialType>(typeUrl, data);
      syncDrawer(res.data);
    }
    classificationModalOpen.value = false;
  } catch (error) {
    toast.error(extractErrorMessage(error, "Erro ao salvar classificação."));
  }
}

async function deleteClassification(cls: Classification) {
  if (!selectedType.value) return;
  try {
    await api.delete(`${baseUrl()}/${selectedType.value.id}/classifications/${cls.id}`);
    const type = materialTypes.value.find((m) => m.id === selectedType.value!.id);
    if (type) {
      type.classifications = type.classifications.filter((c) => c.id !== cls.id);
      selectedType.value = { ...type };
    }
  } catch (error) {
    toast.error(extractErrorMessage(error, "Erro ao remover classificação."));
  }
}
</script>
