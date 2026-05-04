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

O foco é o usuário operacional dentro de **uma única empresa**. O acesso à empresa é controlado pela tabela `Employee` (userId + companyId).

---

## Módulos — Fase 1 (Pedreira)

| Módulo | Rota frontend | Rota backend |
|--------|--------------|--------------|
| Seleção de empresa | `/empresas` | `GET /companies` |
| Dashboard | `/` | — |
| Produção | `/producao` | `POST /companies/:id/productions` |
| Custos | `/custos` | — |
| Estoque de blocos | `/estoque` | `GET /companies/:id/blocks` |
| Vendas | `/vendas` | — |
| Funcionários | `/funcionarios` | — |
| Configurações | `/configuracoes` | — |
| Tipos de Material | `/configuracoes/tipos-material` | `GET /companies/:id/material-types` |

---

## Stack

### Frontend — porta `3000`
- Vue 3 + TypeScript + Tailwind CSS v4 + Pinia + Vue Router
- `pinia-plugin-persistedstate` — persistência de stores no localStorage
- `lucide-vue-next` — ícones
- `axios` via `src/helpers/api.ts` — HTTP client
- `vue-toastification` — toasts
- `zod` — validação de formulários no cliente
- `vue-chartjs` + `chart.js` — gráficos (Bar, Doughnut)

### Backend — porta `3001`
- NestJS (Node.js) + TypeScript
- Prisma ORM + PostgreSQL
- `@nestjs/jwt` + `passport-jwt` — autenticação JWT
- `class-validator` + `class-transformer` — validação de DTOs
- `@nestjs/mapped-types` — `PartialType` para DTOs de update
- `bcrypt` — hash de senhas

---

## Arquitetura Backend (NestJS)

### Estrutura de módulos
```
src/
├── prisma/          # PrismaModule (@Global) + PrismaService
├── common/
│   ├── decorators/  # @Public(), @CurrentUser()
│   ├── guards/      # JwtAuthGuard (global), CompanyAccessGuard
│   └── filters/     # AllExceptionsFilter, PrismaExceptionFilter
│   └── interceptors/# LoggingInterceptor
├── auth/            # Login, JWT strategy
├── users/           # UsersService (findById, findByEmail)
├── companies/       # GET /companies
├── materials/       # MaterialType + MaterialClassification CRUD
└── app.module.ts
```

### Guards
- **`JwtAuthGuard`** — global via `APP_GUARD`. Rotas públicas usam `@Public()`.
- **`CompanyAccessGuard`** — aplicado com `@UseGuards(CompanyAccessGuard)` no controller. Valida que o usuário tem `Employee` na empresa do parâmetro `:companyId`. Aplicar **sempre** em controllers com `:companyId` na rota.

### Padrão de módulo
```
feature/
├── dto/
│   ├── create-feature.dto.ts     # class-validator
│   ├── update-feature.dto.ts     # PartialType(CreateDto)
│   └── feature-response.dto.ts  # nunca expõe campos sensíveis
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

### Padrão de controller
```ts
@UseGuards(CompanyAccessGuard)              // se tiver :companyId
@Controller('companies/:companyId/feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.featureService.findAll(companyId);
  }
}
// Usar `import type { JwtPayload }` quando JwtPayload for parâmetro decorado
```

### Padrão de service
```ts
@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  // Acesso à empresa já garantido pelo CompanyAccessGuard
  // Validar que o recurso pertence à empresa via query filter: { id, companyId }
  private async findOrThrow(companyId: string, id: string) {
    const item = await this.prisma.feature.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException('...');
    return item;
  }
}
```

### Response DTOs — segurança
- Sempre retornar DTOs, nunca objetos Prisma diretos
- `Decimal` do Prisma → converter para `Number` com `Number(value)`
- Nunca expor: `passwordHash`, tokens, campos internos

### Filtros de exceção (ordem importa)
```ts
// app.module.ts — registrar nesta ordem:
{ provide: APP_FILTER, useClass: AllExceptionsFilter },   // catch-all (menor prioridade)
{ provide: APP_FILTER, useClass: PrismaExceptionFilter }, // Prisma (maior prioridade)
```

---

## Arquitetura Frontend

### Stores Pinia — padrão atual
```ts
export const useFeatureStore = defineStore("feature", {
  state: () => ({ items: [] as Item[] }),
  actions: {
    async fetchItems() {
      const toast = useToast();
      try {
        const res       = await api.get<Item[]>("/api/v1/...");
        this.items      = res.data;           // backend retorna array direto, sem wrapper
      } catch (error) {
        toast.error(extractErrorMessage(error, "Mensagem fallback."));
      }
    },
  },
  // Persistência seletiva — só o que precisa sobreviver ao reload
  persist: { key: "feature", pick: ["selectedId"] },
});
```

**Importante:** O backend **não** usa wrapper `{ success, data }` — retorna o dado direto. Não usar `res.data.success`.

### Store de contexto da empresa
```ts
import { useCompanyStore } from "../stores/company";
const companyStore = useCompanyStore();
// companyStore.selectedId → companyId para URLs
// companyStore.selected   → objeto Company completo
```

URL pattern para requests: `/api/v1/companies/${companyStore.selectedId}/feature`

Sempre verificar `if (!companyStore.selectedId) return;` antes de chamar a API.

### Logout — coordenar no componente, não no store
```ts
// AppNavbar.vue (ou quem chamar logout)
authStore.logout();
companyStore.clear();
router.push({ name: "login" });
```

### Validação de formulário com Zod
```ts
import { z } from "zod";
const schema = z.object({
  name: z.string().min(1, "Obrigatório.").min(2, "Mínimo 2 caracteres."),
  price: z.number().min(0.01, "Deve ser maior que zero."),
});
function validate(): boolean {
  const result = schema.safeParse(form);
  if (result.success) { /* limpa errors */ return true; }
  const { fieldErrors } = result.error.flatten();
  // popula errors por campo
  return false;
}
```

### api.ts — comportamento
- Adiciona `Authorization: Bearer <token>` automaticamente
- Incrementa/decrementa `uiStore.activeRequests` (loading global)
- Em 401 fora de rotas `/auth/`: remove token e redireciona para login
- Rotas `/auth/*` não disparam redirect em 401

---

## Convenções Vue SFC

- `<template>` **sempre antes** de `<script setup>`
- UI e labels em **português (BR)**; código em **inglês**
- Validação de formulários com **Zod** (inline errors por campo, não toast)
- `novalidate` no `<form>` para desativar validação nativa do browser

### Nomenclatura de arquivos
- Views: `[Feature][Action]View.vue` → `ProductionIndexView.vue`
- Componentes de layout: `App[Name].vue`
- Componentes de feature: `[Feature][Name].vue` → `MaterialTypeDrawer.vue`
- Stores: `src/stores/[feature].ts`

---

## Convenções CSS / Tailwind

- Cores semânticas: `var(--text)`, `var(--surface)`, `var(--border)`, `var(--canvas)`, `var(--text-muted)`
- Dark/light via classe `.dark` no `<html>` (gerenciado por `stores/ui.ts`)
- Cor primária: `bg-primary` / `text-primary` (indigo `#6366f1`)
- Sidebar e elementos de destaque: `bg-blue-700` / `bg-blue-600` — azul sólido, sem gradiente
- `surface-hover`: `hover:bg-[var(--surface-hover)]`

---

## Padrões de componente

### Página padrão
```html
<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Título</h1>
    <button class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
      Ação
    </button>
  </div>
</div>
```

### Página com botão Voltar (sub-página de configurações)
```html
<div class="flex items-center gap-3">
  <RouterLink to="/configuracoes" class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" :style="{ color: 'var(--text-muted)' }">
    <ArrowLeft class="w-5 h-5" />
  </RouterLink>
  <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Título</h1>
</div>
```

### Card / superfície
```html
<div class="rounded-xl border p-5" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
```

### Card com acento de cor (ex: estoque, materiais)
```html
<div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
  <div class="h-1 w-full bg-primary" />  <!-- ou bg-emerald-500, bg-blue-500, etc. -->
  <div class="p-4">...</div>
</div>
```

### Tabela
```html
<div class="rounded-xl border overflow-hidden" :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }">
  <table class="w-full">
    <thead>
      <tr :style="{ borderBottom: '1px solid var(--border)' }">
        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" :style="{ color: 'var(--text-muted)' }">Coluna</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-[var(--surface-hover)] transition-colors" :style="{ borderBottom: '1px solid var(--border)' }">
        <td class="px-4 py-3 text-sm" :style="{ color: 'var(--text)' }">Valor</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Input (dark/light compatível)
```html
<input
  class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
/>
```

### Modal centralizado
- `<Teleport to="body">`, backdrop `rgba(0,0,0,0.55)`, `max-h-[90vh]`
- Estrutura: header fixo + body scrollável + footer fixo

```html
<Teleport to="body">
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.55);" @click.self="$emit('close')">
      <div class="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" :style="{ background: 'var(--surface)' }">
        <div class="flex items-center justify-between px-5 py-4 border-b shrink-0" :style="{ borderColor: 'var(--border)' }">
          <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">Título</h2>
          <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" :style="{ color: 'var(--text-muted)' }"><X class="w-5 h-5" /></button>
        </div>
        <div class="overflow-y-auto flex-1 p-5 space-y-5">...</div>
        <div class="flex items-center gap-3 px-5 py-4 border-t shrink-0" :style="{ borderColor: 'var(--border)' }">
          <button class="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Salvar</button>
          <button @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors hover:bg-[var(--surface-hover)]" :style="{ borderColor: 'var(--border)', color: 'var(--text)' }">Cancelar</button>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
```

### Drawer lateral direito
- `<Teleport to="body">`, `w-full sm:w-[460px]`, `inset-y-0 right-0 z-50`
- Dois `<Transition>`: `fade` no backdrop, `slide` no painel

```html
<Teleport to="body">
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/40" @click="$emit('close')" />
  </Transition>
  <Transition name="slide">
    <div v-if="open" class="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] flex flex-col shadow-2xl" :style="{ background: 'var(--surface)' }">
      <!-- header + body scrollável + footer -->
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

### Navbar — dropdown de usuário
- Avatar: `bg-blue-600`, iniciais via `displayName()` (nome se disponível, senão prefixo do email)
- Topo do dropdown: `bg-blue-600`
- Dark mode toggle dentro do dropdown
- Logout chama `authStore.logout()` + `companyStore.clear()` + `router.push('login')`
