<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Configurações</h1>

    <section v-for="section in sections" :key="section.title" class="space-y-4">
      <h2 class="text-xs font-semibold uppercase tracking-wider" :style="{ color: 'var(--text-muted)' }">
        {{ section.title }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <template v-for="item in section.items" :key="item.label">
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="rounded-xl border p-5 flex flex-col items-center gap-3 text-center hover:bg-[var(--surface-hover)] transition-colors"
            :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
          >
            <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-500/10">
              <component :is="item.icon" class="w-5 h-5 text-primary" />
            </div>
            <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ item.label }}</p>
          </RouterLink>

          <div
            v-else
            class="rounded-xl border p-5 flex flex-col items-center gap-3 text-center opacity-55"
            :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
          >
            <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-500/10">
              <component :is="item.icon" class="w-5 h-5 text-primary" />
            </div>
            <div class="space-y-1.5">
              <p class="text-sm font-medium" :style="{ color: 'var(--text)' }">{{ item.label }}</p>
              <span class="inline-block text-xs px-2 py-0.5 rounded-full" :style="{ background: 'var(--border)', color: 'var(--text-muted)' }">Em breve</span>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Building2, Users, CreditCard, Gem, Tag, Scale } from "lucide-vue-next";

const sections = [
  {
    title: "Geral",
    items: [
      { label: "Empresa",  icon: Building2,   to: "/configuracoes/empresa" },
      { label: "Usuários", icon: Users,        to: "/configuracoes/usuarios" },
      { label: "Plano",    icon: CreditCard,   to: null },
    ],
  },
  {
    title: "Operacional",
    items: [
      { label: "Tipos de Material",    icon: Gem,   to: null },
      { label: "Categorias de Custo",  icon: Tag,   to: null },
      { label: "Unidades de Medida",   icon: Scale, to: null },
    ],
  },
] as const;
</script>
