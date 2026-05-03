<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.55);"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          :style="{ background: 'var(--surface)' }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
            <div>
              <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">
                {{ editing ? 'Editar Classificação' : 'Nova Classificação' }}
              </h2>
              <p v-if="materialTypeName" class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ materialTypeName }}</p>
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
          <div class="p-5 space-y-4">
            <!-- Nome -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                Nome <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.name"
                placeholder="Ex: Primeira, Segunda, Extra..."
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
              />
              <p v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</p>
            </div>

            <!-- Moeda -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">Moeda</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="form.currency = 'USD'"
                  :class="[
                    'py-2.5 rounded-lg border text-sm font-medium transition-colors',
                    form.currency === 'USD'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'hover:bg-[var(--surface-hover)]'
                  ]"
                  :style="form.currency !== 'USD' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}"
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  @click="form.currency = 'BRL'"
                  :class="[
                    'py-2.5 rounded-lg border text-sm font-medium transition-colors',
                    form.currency === 'BRL'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'hover:bg-[var(--surface-hover)]'
                  ]"
                  :style="form.currency !== 'BRL' ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}"
                >
                  BRL (R$)
                </button>
              </div>
            </div>

            <!-- Preço -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                Preço por m³ <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  {{ form.currency === 'USD' ? '$' : 'R$' }}
                </span>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  class="w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
                />
              </div>
              <p v-if="errors.price" class="text-xs text-red-400">{{ errors.price }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-3 px-5 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
            <button @click="submit" class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
              {{ editing ? 'Salvar' : 'Adicionar' }}
            </button>
            <button
              @click="$emit('close')"
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
import { reactive, watch } from "vue";
import { X } from "lucide-vue-next";
import type { Classification } from "../../views/materials/MaterialTypeIndexView.vue";

const props = defineProps<{
  open:             boolean;
  editing:          Classification | null;
  materialTypeName: string;
}>();

const emit = defineEmits<{
  close: [];
  save:  [data: { name: string; price: number; currency: "USD" | "BRL" }];
}>();

const form   = reactive<{ name: string; price: number | null; currency: "USD" | "BRL" }>({
  name:     "",
  price:    null,
  currency: "USD",
});
const errors = reactive({ name: "", price: "" });

watch(() => props.open, (val) => {
  if (val) {
    form.name     = props.editing?.name     ?? "";
    form.price    = props.editing?.price    ?? null;
    form.currency = props.editing?.currency ?? "USD";
    errors.name   = "";
    errors.price  = "";
  }
});

function submit() {
  let valid = true;
  if (!form.name.trim())             { errors.name  = "Nome é obrigatório.";    valid = false; }
  else                                { errors.name  = ""; }
  if (!form.price || form.price <= 0){ errors.price = "Informe um preço válido."; valid = false; }
  else                                { errors.price = ""; }
  if (!valid) return;

  emit("save", { name: form.name.trim(), price: form.price!, currency: form.currency });
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
