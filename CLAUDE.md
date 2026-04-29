# Granity

CRM especializado para a indústria de mármore e granito, focado no controle operacional de pedreiras e serrarias.

## Contexto de Negócio

### Tipos de empresa (módulos)
| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Pedreira** | Extração de blocos. Controle de produção, custos, estoque e vendas. | Fase 1 |
| **Serraria** | Compra blocos, serra em chapas, vende para mercado interno/exportação. | Fase 2 |

### Tipos de usuário
| Tipo | Acesso | Foco |
|------|--------|------|
| **Operacional** | Uma única empresa | Cadastros do dia a dia: produção, custos, vendas |
| **Gestor / Dono** | Múltiplas empresas | Dashboards consolidados, comparativos, indicadores |

O foco da aplicação é o usuário operacional dentro de **uma única empresa** — dashboard rico e completo para aquela unidade. O gestor tem uma tela separada de seleção de empresa.

---

## Módulos — Fase 1 (Pedreira)

| Módulo | Rota | Telas |
|--------|------|-------|
| Seleção de empresa | `/empresas` | CompanySelectionView |
| Dashboard | `/` | DashboardView |
| Produção | `/producao` | ProductionIndexView, ProductionCreateView |
| Custos | `/custos` | CostIndexView, CostCreateView |
| Estoque de blocos | `/estoque` | StockIndexView |
| Vendas | `/vendas` | SaleIndexView, SaleCreateView |
| Funcionários | `/funcionarios` | EmployeeIndexView |
| Configurações | `/configuracoes` | SettingsView |

---

## Stack

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS v4 + Pinia + Vue Router — porta `3000`
- **Backend**: NestJS (Node.js) — porta `3001`
- **Ícones**: lucide-vue-next
- **HTTP**: axios via `src/helpers/api.ts`
- **Estado**: Pinia (stores em `src/stores/`)
- **Toasts**: vue-toastification

---

## Convenções de código

### Vue SFC
- `<template>` **sempre antes** de `<script setup>`
- UI e labels para o usuário em **português (BR)**
- Código (variáveis, funções, tipos, comentários) em **inglês**

### Nomenclatura de arquivos
- Views: `[Feature][Action]View.vue` → `ProductionIndexView.vue`, `CostCreateView.vue`
- Componentes reutilizáveis: `App[Name].vue` (layout) ou `[Feature][Name].vue`
- Stores: `src/stores/[feature].ts` → `production.ts`, `costs.ts`

### Stores Pinia
```ts
export const useFeatureStore = defineStore("feature", {
  state: () => ({ ... }),
  getters: { ... },
  actions: {
    async fetchItems() {
      const toast = useToast();
      try {
        const res = await api.get("/api/v1/...");
        if (res.data.success) this.items = res.data.data;
        else toast.error(extractErrorMessage(res, "Mensagem fallback"));
      } catch (error) {
        toast.error(extractErrorMessage(error, "Mensagem fallback"));
      }
    },
  },
});
```

### CSS / Tailwind
- Cores semânticas via variáveis CSS: `var(--text)`, `var(--surface)`, `var(--border)`, `var(--canvas)`
- Dark/light mode via classe `.dark` no `<html>` (gerenciado por `stores/ui.ts`)
- Cor primária: `bg-primary` / `text-primary` (índigo `#6366f1`)
- Sidebar usa gradiente `from-indigo-700 to-violet-800` — manter consistência visual

### Padrão de página
```html
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Título</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
        Ação
      </button>
    </div>
    <!-- Conteúdo -->
  </div>
</template>
```

### Padrão de card / superfície
```html
<div class="rounded-xl border p-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
```

### Padrão de tabela
```html
<div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
  <table class="w-full">
    <thead>
      <tr :style="{ borderBottom: '1px solid var(--border)' }">
        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Coluna</th>
      </tr>
    </thead>
    <tbody>
      <tr :style="{ borderBottom: '1px solid var(--border)' }">
        <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text)' }">Valor</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Padrão de input (dark/light compatível)
```html
<input
  class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  :style="{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }"
/>
```

### Padrão de modal centralizado
- Usa `<Teleport to="body">` para evitar conflitos de z-index
- Backdrop `bg-black/55`, modal com `max-h-[90vh]` e scroll interno
- Estrutura: header fixo + body scrollável + footer fixo

```html
<Teleport to="body">
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.55);">
    <div class="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      :style="{ background: 'var(--surface)' }">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 lg:px-6 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
        <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">Título</h2>
        <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" :style="{ color: 'var(--text-muted)' }">
          <X class="w-5 h-5" />
        </button>
      </div>
      <!-- Body scrollável -->
      <div class="overflow-y-auto flex-1 p-5 lg:p-6 space-y-5">...</div>
      <!-- Footer -->
      <div class="flex items-center gap-3 px-5 lg:px-6 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
        <button class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Salvar</button>
        <button @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]" :style="{ borderColor: 'var(--border)', color: 'var(--text)' }">Cancelar</button>
      </div>
    </div>
  </div>
</Teleport>
```

### Padrão de drawer lateral direito
- Usa `<Teleport to="body">` com dois `<Transition>`: `fade` no backdrop, `slide` no painel
- Largura: `w-full sm:w-[440px]`; altura: `inset-y-0`
- Animação `slide`: `translateX(100%)` → `translateX(0)` com `cubic-bezier(0.4,0,0.2,1)`

```html
<Teleport to="body">
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/40" @click="$emit('close')" />
  </Transition>
  <Transition name="slide">
    <div v-if="open" class="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] flex flex-col shadow-2xl"
      :style="{ background: 'var(--surface)' }">
      <!-- Header, body scrollável, footer -->
    </div>
  </Transition>
</Teleport>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 280ms cubic-bezier(0.4,0,0.2,1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
```

### Padrão de upload de foto (placeholder)
```html
<div class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 h-28 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
  :style="{ borderColor: 'var(--border)' }">
  <Camera class="w-5 h-5" :style="{ color: 'var(--text-muted)' }" />
  <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Clique para enviar</span>
</div>
```

### Navbar — dropdown de usuário
- Avatar no botão: círculo com as **duas iniciais** (primeiro + último nome), gradiente `from-indigo-500 to-violet-600`
- Dropdown: `var(--surface)` background (adapta ao tema)
- Topo do dropdown: card com gradiente `from-indigo-600 to-violet-700` (nome + e-mail + avatar `bg-white/20`)
- Dark mode toggle está **dentro do dropdown** (não na navbar diretamente)
- Backdrop `fixed inset-0 z-10` fecha o dropdown; container do dropdown em `z-20`
