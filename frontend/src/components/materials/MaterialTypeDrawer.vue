<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="materialType" class="fixed inset-0 z-40 bg-black/40" @click="$emit('close')" />
    </Transition>

    <Transition name="slide">
      <div
        v-if="materialType"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] flex flex-col shadow-2xl"
        :style="{ background: 'var(--surface)' }"
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Gem class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <h2 class="font-semibold text-base truncate" :style="{ color: 'var(--text)' }">{{ materialType.name }}</h2>
                <p v-if="materialType.description" class="text-xs truncate mt-0.5" :style="{ color: 'var(--text-muted)' }">
                  {{ materialType.description }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0 ml-3">
              <button
                @click="$emit('edit', materialType)"
                class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                :style="{ color: 'var(--text-muted)' }"
                title="Editar tipo"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click="$emit('close')"
                class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                :style="{ color: 'var(--text-muted)' }"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto flex-1 p-5">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">
              Classificações ({{ materialType.classifications.length }})
            </p>
            <button
              @click="$emit('add-classification')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Plus class="w-3.5 h-3.5" /> Adicionar
            </button>
          </div>

          <!-- Empty classifications -->
          <div
            v-if="materialType.classifications.length === 0"
            class="rounded-xl border p-8 flex flex-col items-center gap-2"
            :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
          >
            <Tag class="w-7 h-7" :style="{ color: 'var(--text-muted)' }" />
            <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Nenhuma classificação cadastrada</p>
          </div>

          <!-- Classification list -->
          <div v-else class="space-y-2">
            <div
              v-for="cls in materialType.classifications"
              :key="cls.id"
              class="rounded-xl border p-4 flex items-center justify-between"
              :style="{ background: 'var(--canvas)', borderColor: 'var(--border)' }"
            >
              <div>
                <p class="text-sm font-semibold" :style="{ color: 'var(--text)' }">{{ cls.name }}</p>
                <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">por m³</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-base font-bold text-green-600 dark:text-green-400">
                    {{ cls.currency === 'USD' ? '$' : 'R$' }}{{ cls.price.toLocaleString('pt-BR') }}
                  </p>
                  <span
                    class="text-xs font-medium px-1.5 py-0.5 rounded"
                    :class="cls.currency === 'USD'
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'"
                  >
                    {{ cls.currency }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <button
                    @click="$emit('edit-classification', cls)"
                    class="p-1 rounded hover:bg-[var(--surface-hover)] transition-colors"
                    :style="{ color: 'var(--text-muted)' }"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="$emit('delete-classification', cls)"
                    class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 transition-colors"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
          <button
            @click="$emit('close')"
            class="w-full py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]"
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
import { Gem, Pencil, Plus, Tag, Trash2, X } from "lucide-vue-next";
import type { MaterialType, Classification } from "../../views/materials/MaterialTypeIndexView.vue";

defineProps<{ materialType: MaterialType | null }>();

defineEmits<{
  close:                  [];
  edit:                   [type: MaterialType];
  "add-classification":   [];
  "edit-classification":  [cls: Classification];
  "delete-classification":[cls: Classification];
}>();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
