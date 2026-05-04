<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
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
            class="flex items-center justify-between px-5 py-4 border-b shrink-0"
            :style="{ borderColor: 'var(--border)' }"
          >
            <div>
              <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">Registrar Bloco</h2>
              <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">Preencha os dados do bloco extraído</p>
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
          <div class="overflow-y-auto flex-1">

            <!-- ── 1. Identificação ─────────────────────────────────────── -->
            <div class="px-5 py-5 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Identificação</p>

              <div class="space-y-1.5">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  Código do Bloco <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="Ex: BLK-0001"
                  class="w-full px-3 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :style="{ background: 'var(--canvas)', borderColor: errors.code ? '#ef4444' : 'var(--border)', color: 'var(--text)' }"
                />
                <p v-if="errors.code" class="text-xs text-red-500">{{ errors.code }}</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                    Data da Extração <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="form.extractedAt"
                    type="date"
                    class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :style="{ background: 'var(--canvas)', borderColor: errors.extractedAt ? '#ef4444' : 'var(--border)', color: 'var(--text)' }"
                  />
                  <p v-if="errors.extractedAt" class="text-xs text-red-500">{{ errors.extractedAt }}</p>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">Frente de Lavra</label>
                  <input
                    v-model="form.extractionFront"
                    type="text"
                    placeholder="Ex: Frente Norte"
                    class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
                  />
                </div>
              </div>
            </div>

            <div class="border-t" :style="{ borderColor: 'var(--border)' }" />

            <!-- ── 2. Material ──────────────────────────────────────────── -->
            <div class="px-5 py-5 space-y-4">
              <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Material</p>

              <div class="space-y-2">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  Tipo <span class="text-red-400">*</span>
                </label>
                <div v-if="loadingMaterials" class="flex items-center gap-2" :style="{ color: 'var(--text-muted)' }">
                  <div class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span class="text-sm">Carregando...</span>
                </div>
                <div v-else-if="materialTypes.length === 0">
                  <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                    Nenhum tipo cadastrado.
                    <RouterLink to="/configuracoes/tipos-material" class="text-indigo-500 hover:underline" @click="$emit('close')">Cadastrar agora</RouterLink>
                  </p>
                </div>
                <div v-else class="flex flex-wrap gap-2">
                  <button
                    v-for="mt in materialTypes" :key="mt.id" type="button"
                    @click="selectMaterialType(mt)"
                    class="px-3.5 py-1.5 rounded-lg border text-sm font-medium transition-all"
                    :class="form.materialTypeId === mt.id ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'hover:bg-[var(--surface-hover)]'"
                    :style="form.materialTypeId !== mt.id ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}"
                  >{{ mt.name }}</button>
                </div>
                <p v-if="errors.materialTypeId" class="text-xs text-red-500">{{ errors.materialTypeId }}</p>
              </div>

              <Transition name="slide-down">
                <div v-if="selectedMaterialType" class="space-y-2">
                  <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                    Classificação <span class="text-red-400">*</span>
                    <span class="font-normal text-xs ml-1" :style="{ color: 'var(--text-muted)' }">— {{ selectedMaterialType.name }}</span>
                  </label>
                  <p v-if="selectedMaterialType.classifications.length === 0" class="text-sm" :style="{ color: 'var(--text-muted)' }">
                    Nenhuma classificação para este tipo.
                  </p>
                  <div v-else class="grid grid-cols-3 gap-2">
                    <button
                      v-for="(cls, i) in selectedMaterialType.classifications" :key="cls.id" type="button"
                      @click="form.materialClassificationId = cls.id"
                      class="rounded-xl border overflow-hidden text-left transition-all hover:shadow-sm"
                      :class="form.materialClassificationId === cls.id ? clsSelected(i) : 'hover:-translate-y-0.5'"
                      :style="form.materialClassificationId !== cls.id ? { borderColor: 'var(--border)' } : {}"
                    >
                      <div class="h-1 w-full" :class="accentBar(i)" />
                      <div class="px-3 py-2.5">
                        <span class="block text-sm font-semibold truncate"
                          :class="form.materialClassificationId === cls.id ? accentText(i) : ''"
                          :style="form.materialClassificationId !== cls.id ? { color: 'var(--text)' } : {}"
                        >{{ cls.name }}</span>
                        <span class="text-xs mt-0.5 block tabular-nums" :style="{ color: 'var(--text-muted)' }">
                          {{ cls.currency }} {{ cls.price.toFixed(2) }}/m³
                        </span>
                      </div>
                    </button>
                  </div>
                  <p v-if="errors.materialClassificationId" class="text-xs text-red-500">{{ errors.materialClassificationId }}</p>
                </div>
              </Transition>
            </div>

            <div class="border-t" :style="{ borderColor: 'var(--border)' }" />

            <!-- ── 3. Dimensões ─────────────────────────────────────────── -->
            <div class="px-5 py-5 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Dimensões</p>

              <div class="rounded-xl p-4 space-y-3" :style="{ background: 'var(--canvas)' }">
                <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Brutas (metros)</p>
                <div class="grid grid-cols-3 gap-3">
                  <div class="space-y-1">
                    <label class="block text-xs" :style="{ color: 'var(--text-muted)' }">Comprimento (C)</label>
                    <div class="relative">
                      <input v-model.number="form.c" type="number" step="0.01" min="0.01" placeholder="0,00"
                        class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-7 tabular-nums"
                        :style="{ background: 'var(--surface)', borderColor: errors.c ? '#ef4444' : 'var(--border)', color: 'var(--text)' }" />
                      <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" :style="{ color: 'var(--text-muted)' }">m</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="block text-xs" :style="{ color: 'var(--text-muted)' }">Largura (L)</label>
                    <div class="relative">
                      <input v-model.number="form.l" type="number" step="0.01" min="0.01" placeholder="0,00"
                        class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-7 tabular-nums"
                        :style="{ background: 'var(--surface)', borderColor: errors.l ? '#ef4444' : 'var(--border)', color: 'var(--text)' }" />
                      <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" :style="{ color: 'var(--text-muted)' }">m</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="block text-xs" :style="{ color: 'var(--text-muted)' }">Altura (A)</label>
                    <div class="relative">
                      <input v-model.number="form.a" type="number" step="0.01" min="0.01" placeholder="0,00"
                        class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-7 tabular-nums"
                        :style="{ background: 'var(--surface)', borderColor: errors.a ? '#ef4444' : 'var(--border)', color: 'var(--text)' }" />
                      <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" :style="{ color: 'var(--text-muted)' }">m</span>
                    </div>
                  </div>
                </div>
                <p v-if="errors.c || errors.l || errors.a" class="text-xs text-red-500">{{ errors.c || errors.l || errors.a }}</p>
              </div>

              <Transition name="slide-down">
                <div v-if="volumeGross > 0" class="space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="rounded-lg p-3" :style="{ background: 'var(--canvas)' }">
                      <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Bruto</p>
                      <p class="text-sm font-bold tabular-nums text-indigo-500">{{ volumeGross.toFixed(3).replace(".", ",") }} m³</p>
                    </div>
                    <div class="rounded-lg p-3" :style="{ background: 'var(--canvas)' }">
                      <p class="text-xs mb-1" :style="{ color: 'var(--text-muted)' }">Vol. Líquido</p>
                      <p class="text-sm font-bold tabular-nums" :style="{ color: 'var(--text)' }">{{ volumeNet.toFixed(3).replace(".", ",") }} m³</p>
                    </div>
                  </div>
                  <div v-if="estimatedValue > 0" class="rounded-lg p-3 border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10">
                    <p class="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-1.5">Valor Estimado</p>
                    <p class="text-base font-bold text-green-600 dark:text-green-400 tabular-nums">USD {{ fmtUSD(estimatedValue) }}</p>
                    <p class="text-xs mt-0.5 text-green-700/60 dark:text-green-400/60 tabular-nums">≈ {{ fmtBRL(estimatedValue * USD_BRL) }}</p>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="border-t" :style="{ borderColor: 'var(--border)' }" />

            <!-- ── 4. Fotos do Bloco ────────────────────────────────────── -->
            <div class="px-5 py-5 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Fotos do Bloco</p>
                <span class="text-xs" :style="{ color: 'var(--text-muted)' }">opcional</span>
              </div>

              <div class="grid grid-cols-5 gap-2">
                <div v-for="slot in angleSlots" :key="slot.angle">
                  <input
                    :ref="(el) => (angleInputRefs[slot.angle] = el as HTMLInputElement)"
                    type="file" accept="image/*" class="hidden"
                    @change="onAngleFileChange(slot.angle, $event)"
                  />
                  <div
                    @click="angleInputRefs[slot.angle]?.click()"
                    class="relative rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-indigo-400 overflow-hidden flex flex-col items-center justify-center gap-1"
                    style="aspect-ratio: 1"
                    :style="{ borderColor: anglePreviews[slot.angle] ? '#6366f1' : 'var(--border)', background: 'var(--canvas)' }"
                  >
                    <img
                      v-if="anglePreviews[slot.angle]"
                      :src="anglePreviews[slot.angle]"
                      class="absolute inset-0 w-full h-full object-cover"
                    />
                    <template v-else>
                      <Camera class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                      <span class="text-[10px] text-center leading-tight px-1" :style="{ color: 'var(--text-muted)' }">{{ slot.label }}</span>
                    </template>

                    <div v-if="anglePreviews[slot.angle]" class="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 text-center">
                      <span class="text-white text-[10px]">{{ slot.label }}</span>
                    </div>
                    <button
                      v-if="anglePreviews[slot.angle]"
                      @click.stop="removeAnglePhoto(slot.angle)"
                      class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-10"
                    >
                      <X class="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t" :style="{ borderColor: 'var(--border)' }" />

            <!-- ── 5. Observações ───────────────────────────────────────── -->
            <div class="px-5 py-5 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Observações</p>

              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Ex: Leve fissura lateral, quebrado na detonação..."
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
              />

              <!-- Fotos de defeitos -->
              <div class="space-y-2">
                <p class="text-xs font-medium" :style="{ color: 'var(--text-muted)' }">
                  Fotos de defeitos
                  <span class="font-normal">(trincas, fissuras, etc.) — opcional</span>
                </p>

                <input
                  ref="obsInputRef"
                  type="file" accept="image/*" multiple class="hidden"
                  @change="onObsFilesChange"
                />

                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(preview, idx) in obsPreviews" :key="idx"
                    class="relative w-16 h-16 rounded-lg overflow-hidden border"
                    :style="{ borderColor: 'var(--border)' }"
                  >
                    <img :src="preview" class="w-full h-full object-cover" />
                    <button
                      @click="removeObsPhoto(idx)"
                      class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X class="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>

                  <button
                    @click="obsInputRef?.click()"
                    class="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:border-indigo-400"
                    :style="{ borderColor: 'var(--border)', background: 'var(--canvas)' }"
                  >
                    <ImagePlus class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div
            class="flex items-center gap-3 px-5 py-4 border-t shrink-0"
            :style="{ borderColor: 'var(--border)' }"
          >
            <button
              type="button" @click="handleSubmit" :disabled="saving"
              class="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {{ saving ? savingLabel : "Salvar Bloco" }}
            </button>
            <button
              type="button" @click="$emit('close')"
              class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
              :style="{ borderColor: 'var(--border)', color: 'var(--text)' }"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { z } from "zod";
import { Camera, ImagePlus, X } from "lucide-vue-next";
import { useToast } from "vue-toastification";
import { useCompanyStore } from "../../stores/company";
import { useBlocksStore } from "../../stores/blocks";
import api from "../../helpers/api";
import { extractErrorMessage } from "../../helpers/apiError";

type PhotoAngle = "FRENTE" | "TOPO" | "TRASEIRA" | "LATERAL_ESQ" | "LATERAL_DIR";

interface Classification { id: string; name: string; price: number; currency: string; }
interface MaterialType   { id: string; name: string; description: string | null; classifications: Classification[]; }

const props = defineProps<{ open: boolean }>();
const emit  = defineEmits<{ close: []; created: [] }>();

const companyStore = useCompanyStore();
const blocksStore  = useBlocksStore();
const toast        = useToast();

const USD_BRL = 5.87;

const palette = [
  { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-400 dark:border-emerald-500/50", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { bar: "bg-blue-500",    text: "text-blue-600 dark:text-blue-400",       border: "border-blue-400 dark:border-blue-500/50",       bg: "bg-blue-50 dark:bg-blue-500/10" },
  { bar: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400",     border: "border-amber-400 dark:border-amber-500/50",     bg: "bg-amber-50 dark:bg-amber-500/10" },
  { bar: "bg-purple-500",  text: "text-purple-600 dark:text-purple-400",   border: "border-purple-400 dark:border-purple-500/50",   bg: "bg-purple-50 dark:bg-purple-500/10" },
  { bar: "bg-rose-500",    text: "text-rose-600 dark:text-rose-400",       border: "border-rose-400 dark:border-rose-500/50",       bg: "bg-rose-50 dark:bg-rose-500/10" },
];
const accentBar   = (i: number) => palette[i % palette.length].bar;
const accentText  = (i: number) => palette[i % palette.length].text;
const clsSelected = (i: number) => `${palette[i % palette.length].border} ${palette[i % palette.length].bg}`;

// ── Angle photo slots ──────────────────────────────────────────────────────────
const angleSlots: { angle: PhotoAngle; label: string }[] = [
  { angle: "FRENTE",      label: "Frente"    },
  { angle: "TOPO",        label: "Topo"      },
  { angle: "TRASEIRA",    label: "Traseira"  },
  { angle: "LATERAL_ESQ", label: "Lat. Esq." },
  { angle: "LATERAL_DIR", label: "Lat. Dir." },
];

const angleInputRefs = ref<Partial<Record<PhotoAngle, HTMLInputElement>>>({});
const angleFiles     = ref<Partial<Record<PhotoAngle, File>>>({});
const anglePreviews  = ref<Partial<Record<PhotoAngle, string>>>({});

function onAngleFileChange(angle: PhotoAngle, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (anglePreviews.value[angle]) URL.revokeObjectURL(anglePreviews.value[angle]!);
  angleFiles.value[angle]    = file;
  anglePreviews.value[angle] = URL.createObjectURL(file);
}

function removeAnglePhoto(angle: PhotoAngle) {
  if (anglePreviews.value[angle]) URL.revokeObjectURL(anglePreviews.value[angle]!);
  delete angleFiles.value[angle];
  delete anglePreviews.value[angle];
  const input = angleInputRefs.value[angle];
  if (input) input.value = "";
}

// ── Observation photos ────────────────────────────────────────────────────────
const obsInputRef = ref<HTMLInputElement | null>(null);
const obsFiles    = ref<File[]>([]);
const obsPreviews = ref<string[]>([]);

function onObsFilesChange(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? []);
  for (const file of files) {
    obsFiles.value.push(file);
    obsPreviews.value.push(URL.createObjectURL(file));
  }
  if (obsInputRef.value) obsInputRef.value.value = "";
}

function removeObsPhoto(idx: number) {
  URL.revokeObjectURL(obsPreviews.value[idx]);
  obsFiles.value.splice(idx, 1);
  obsPreviews.value.splice(idx, 1);
}

// ── Form state ────────────────────────────────────────────────────────────────
const materialTypes        = ref<MaterialType[]>([]);
const selectedMaterialType = ref<MaterialType | null>(null);
const loadingMaterials     = ref(false);
const saving               = ref(false);
const savingLabel          = ref("Salvando...");

const form = reactive({
  code: "",
  c: null as number | null, l: null as number | null, a: null as number | null,
  materialTypeId: "", materialClassificationId: "",
  extractionFront: "", extractedAt: "", notes: "",
});

const errors = reactive({
  code: "", extractedAt: "", materialTypeId: "", materialClassificationId: "",
  c: "", l: "", a: "",
});

const schema = z.object({
  code:                     z.string().min(1, "Código é obrigatório."),
  extractedAt:              z.string().min(1, "Data da extração é obrigatória."),
  materialTypeId:           z.string().min(1, "Selecione o tipo de material."),
  materialClassificationId: z.string().min(1, "Selecione a classificação."),
  c: z.number({ error: "Informe o comprimento." }).min(0.01, "Maior que zero."),
  l: z.number({ error: "Informe a largura." }).min(0.01, "Maior que zero."),
  a: z.number({ error: "Informe a altura." }).min(0.01, "Maior que zero."),
});

const volumeGross = computed(() => {
  const { c, l, a } = form;
  if (!c || !l || !a) return 0;
  return c * l * a;
});

const volumeNet = computed(() => {
  const { c, l, a } = form;
  if (!c || !l || !a) return 0;
  return Math.max(0, (c - 0.10) * (l - 0.05) * (a - 0.05));
});

const estimatedValue = computed(() => {
  if (!selectedMaterialType.value || !form.materialClassificationId || volumeNet.value === 0) return 0;
  const cls = selectedMaterialType.value.classifications.find((c) => c.id === form.materialClassificationId);
  if (!cls || cls.currency !== "USD") return 0;
  return cls.price * volumeNet.value;
});

const fmtUSD = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function selectMaterialType(mt: MaterialType) {
  form.materialTypeId           = mt.id;
  form.materialClassificationId = "";
  selectedMaterialType.value    = mt;
}

function resetForm() {
  form.code = ""; form.c = null; form.l = null; form.a = null;
  form.materialTypeId = ""; form.materialClassificationId = "";
  form.extractionFront = ""; form.extractedAt = ""; form.notes = "";
  selectedMaterialType.value = null;
  Object.assign(errors, { code: "", extractedAt: "", materialTypeId: "", materialClassificationId: "", c: "", l: "", a: "" });

  Object.values(anglePreviews.value).forEach((url) => URL.revokeObjectURL(url));
  obsPreviews.value.forEach((url) => URL.revokeObjectURL(url));
  angleFiles.value = {}; anglePreviews.value = {};
  obsFiles.value = []; obsPreviews.value = [];
}

function validate(): boolean {
  const result = schema.safeParse({
    code: form.code, extractedAt: form.extractedAt,
    materialTypeId: form.materialTypeId,
    materialClassificationId: form.materialClassificationId,
    c: form.c, l: form.l, a: form.a,
  });
  if (result.success) {
    Object.assign(errors, { code: "", extractedAt: "", materialTypeId: "", materialClassificationId: "", c: "", l: "", a: "" });
    return true;
  }
  const fe = result.error.flatten().fieldErrors;
  errors.code                     = fe.code?.[0]                     ?? "";
  errors.extractedAt              = fe.extractedAt?.[0]              ?? "";
  errors.materialTypeId           = fe.materialTypeId?.[0]           ?? "";
  errors.materialClassificationId = fe.materialClassificationId?.[0] ?? "";
  errors.c = fe.c?.[0] ?? ""; errors.l = fe.l?.[0] ?? ""; errors.a = fe.a?.[0] ?? "";
  return false;
}

async function handleSubmit() {
  if (!validate() || !companyStore.selectedId) return;
  saving.value = true;

  const block = await blocksStore.createBlock(companyStore.selectedId, {
    code: form.code,
    c: form.c!, l: form.l!, a: form.a!,
    materialTypeId:           form.materialTypeId           || undefined,
    materialClassificationId: form.materialClassificationId || undefined,
    extractionFront:          form.extractionFront          || undefined,
    extractedAt:              form.extractedAt              || undefined,
    notes:                    form.notes                    || undefined,
  });

  if (!block) { saving.value = false; return; }

  const angleEntries = Object.entries(angleFiles.value) as [string, File][];
  const hasPhotos    = angleEntries.length > 0 || obsFiles.value.length > 0;

  if (hasPhotos) {
    savingLabel.value  = "Enviando fotos...";
    const companyId    = companyStore.selectedId;

    const uploads = [
      ...angleEntries.map(([angle, file]) =>
        blocksStore.uploadAnglePhoto(companyId, block.id, angle, file),
      ),
      ...obsFiles.value.map((file) =>
        blocksStore.uploadObservationPhoto(companyId, block.id, file),
      ),
    ];

    const results = await Promise.allSettled(uploads);
    const failed  = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) toast.warning(`${failed} foto(s) não puderam ser enviadas.`);
  }

  saving.value = false;
  savingLabel.value = "Salvando...";
  toast.success(`Bloco ${block.code} registrado com sucesso.`);
  resetForm();
  emit("created");
  emit("close");
}

async function loadMaterials() {
  if (!companyStore.selectedId || materialTypes.value.length > 0) return;
  loadingMaterials.value = true;
  try {
    const res = await api.get<MaterialType[]>(`/api/v1/companies/${companyStore.selectedId}/material-types`);
    materialTypes.value = res.data;
  } catch (err) {
    toast.error(extractErrorMessage(err, "Erro ao carregar tipos de material."));
  } finally {
    loadingMaterials.value = false;
  }
}

watch(() => props.open, (val) => { if (val) loadMaterials(); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active { transition: opacity 200ms ease, transform 200ms ease; }
.slide-down-leave-active  { transition: opacity 150ms ease, transform 150ms ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
