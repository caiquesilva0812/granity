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
          class="w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          :style="{ background: 'var(--surface)' }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
            <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">
              {{ editing ? 'Editar Tipo' : 'Novo Tipo de Material' }}
            </h2>
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
            <div class="space-y-1.5">
              <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                Nome <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.name"
                placeholder="Ex: Granito Amarelo Imperial"
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
              />
              <p v-if="errors.name" class="text-xs text-red-400">{{ errors.name }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">Descrição</label>
              <textarea
                v-model="form.description"
                placeholder="Descrição opcional do material..."
                rows="3"
                class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-3 px-5 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
            <button @click="submit" class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
              {{ editing ? 'Salvar' : 'Criar' }}
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
import type { MaterialType } from "../../views/materials/MaterialTypeIndexView.vue";

const props = defineProps<{ open: boolean; editing: MaterialType | null }>();
const emit  = defineEmits<{ close: []; save: [data: { name: string; description: string }] }>();

const form   = reactive({ name: "", description: "" });
const errors = reactive({ name: "" });

watch(() => props.open, (val) => {
  if (val) {
    form.name        = props.editing?.name        ?? "";
    form.description = props.editing?.description ?? "";
    errors.name      = "";
  }
});

function submit() {
  if (!form.name.trim()) { errors.name = "Nome é obrigatório."; return; }
  errors.name = "";
  emit("save", { name: form.name.trim(), description: form.description.trim() });
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
