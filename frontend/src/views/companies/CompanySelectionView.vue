<template>
  <div class="min-h-screen flex flex-col" :style="{ background: 'var(--canvas)' }">

    <!-- Header -->
    <header
      class="h-14 shrink-0 flex items-center justify-between px-6 border-b"
      :style="{ backgroundColor: 'var(--navbar-bg)', borderColor: 'var(--navbar-border)' }"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-brand rounded-xl flex items-center justify-center shrink-0">
          <span class="text-white font-extrabold text-sm">G</span>
        </div>
        <span class="font-bold text-base tracking-tight" :style="{ color: 'var(--text)' }">Granity</span>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm hidden sm:block" :style="{ color: 'var(--text-muted)' }">
          {{ authStore.currentUser?.email }}
        </span>
        <button
          @click="logout"
          class="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Sair
        </button>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 flex flex-col items-center py-12 px-4">
      <div class="w-full max-w-4xl">

        <!-- Title row -->
        <div class="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 class="text-2xl font-bold" :style="{ color: 'var(--text)' }">Selecione sua empresa</h1>
            <p class="text-sm mt-1" :style="{ color: 'var(--text-muted)' }">
              Escolha um espaço de trabalho para continuar
            </p>
          </div>
          <button
            v-if="!loading && companyStore.companies.length > 0"
            @click="openModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            <Plus class="w-4 h-4" />
            Nova empresa
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-24">
          <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="companyStore.companies.length === 0"
          class="rounded-xl border py-20 flex flex-col items-center text-center"
          :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
        >
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Building2 class="w-7 h-7 text-blue-500" />
          </div>
          <h2 class="font-semibold text-base mb-1" :style="{ color: 'var(--text)' }">
            Nenhuma empresa cadastrada
          </h2>
          <p class="text-sm mb-6 max-w-xs" :style="{ color: 'var(--text-muted)' }">
            Cadastre sua primeira empresa para começar a usar o Granity.
          </p>
          <button
            @click="openModal"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus class="w-4 h-4" />
            Cadastrar empresa
          </button>
        </div>

        <!-- Company cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="company in companyStore.companies"
            :key="company.id"
            @click="selectCompany(company.id)"
            class="rounded-xl border p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group w-full"
            :style="{ background: 'var(--surface)', borderColor: 'var(--border)' }"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="min-w-0">
                <h2 class="font-semibold text-base truncate" :style="{ color: 'var(--text)' }">
                  {{ company.name }}
                </h2>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1"
                  :class="typeBadgeClass(company.type)"
                >
                  {{ typeLabel(company.type) }}
                </span>
              </div>
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-3"
                :class="typeIconBgClass(company.type)"
              >
                <Mountain v-if="company.type === 'PEDREIRA'" class="w-5 h-5" :class="typeIconColorClass(company.type)" />
                <Layers    v-else                             class="w-5 h-5" :class="typeIconColorClass(company.type)" />
              </div>
            </div>

            <p class="text-xs mb-4" :style="{ color: 'var(--text-muted)' }">CNPJ: {{ company.cnpj }}</p>

            <div class="w-full py-2 bg-primary group-hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors text-center">
              Acessar
            </div>
          </button>
        </div>

      </div>
    </main>

    <!-- Create company modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background: rgba(0,0,0,0.55);"
          @click.self="closeModal"
        >
          <div
            class="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            :style="{ background: 'var(--surface)' }"
          >
            <!-- Modal header -->
            <div
              class="flex items-center justify-between px-5 py-4 border-b shrink-0"
              :style="{ borderColor: 'var(--border)' }"
            >
              <h2 class="font-semibold text-base" :style="{ color: 'var(--text)' }">Nova empresa</h2>
              <button
                @click="closeModal"
                class="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                :style="{ color: 'var(--text-muted)' }"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal body -->
            <div class="p-5 space-y-4">

              <!-- Name -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  Nome da empresa <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ex: Pedreira Serra Verde"
                  class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :style="{ background: 'var(--canvas)', borderColor: formErrors.name ? '#ef4444' : 'var(--border)', color: 'var(--text)' }"
                />
                <p v-if="formErrors.name" class="text-xs text-red-500">{{ formErrors.name }}</p>
              </div>

              <!-- CNPJ -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  CNPJ <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.cnpj"
                  type="text"
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  maxlength="18"
                  class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :style="{ background: 'var(--canvas)', borderColor: formErrors.cnpj ? '#ef4444' : 'var(--border)', color: 'var(--text)' }"
                />
                <p v-if="formErrors.cnpj" class="text-xs text-red-500">{{ formErrors.cnpj }}</p>
              </div>

              <!-- Type -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  Tipo <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="opt in typeOptions"
                    :key="opt.value"
                    type="button"
                    @click="form.type = opt.value"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all"
                    :class="form.type === opt.value
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600'
                      : 'hover:bg-[var(--surface-hover)]'"
                    :style="form.type !== opt.value ? { borderColor: 'var(--border)', color: 'var(--text)' } : {}"
                  >
                    <component :is="opt.icon" class="w-4 h-4 shrink-0" />
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- Address -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium" :style="{ color: 'var(--text)' }">
                  Endereço <span class="text-xs font-normal" :style="{ color: 'var(--text-muted)' }">(opcional)</span>
                </label>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Ex: Rod. BR-040, Km 12, Zona Rural"
                  class="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :style="{ background: 'var(--canvas)', borderColor: 'var(--border)', color: 'var(--text)' }"
                />
              </div>

            </div>

            <!-- Modal footer -->
            <div
              class="flex items-center gap-3 px-5 py-4 border-t shrink-0"
              :style="{ borderColor: 'var(--border)' }"
            >
              <button
                @click="handleCreate"
                :disabled="saving"
                class="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {{ saving ? "Salvando..." : "Cadastrar" }}
              </button>
              <button
                @click="closeModal"
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

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";
import { Building2, Layers, LogOut, Mountain, Plus, X } from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";
import { useCompanyStore } from "../../stores/company";

const router       = useRouter();
const authStore    = useAuthStore();
const companyStore = useCompanyStore();

const loading   = ref(false);
const showModal = ref(false);
const saving    = ref(false);

const typeOptions = [
  { value: "PEDREIRA" as const, label: "Pedreira", icon: Mountain },
  { value: "SERRARIA" as const, label: "Serraria", icon: Layers },
];

const form = reactive({
  name:    "",
  cnpj:    "",
  type:    "PEDREIRA" as "PEDREIRA" | "SERRARIA",
  address: "",
});

const formErrors = reactive({ name: "", cnpj: "" });

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  cnpj: z.string().min(14, "CNPJ inválido."),
});

function validate(): boolean {
  const result = schema.safeParse({ name: form.name, cnpj: form.cnpj });
  if (result.success) {
    formErrors.name = "";
    formErrors.cnpj = "";
    return true;
  }
  const { fieldErrors } = result.error.flatten();
  formErrors.name = fieldErrors.name?.[0] ?? "";
  formErrors.cnpj = fieldErrors.cnpj?.[0] ?? "";
  return false;
}

function typeBadgeClass(type: string) {
  return type === "PEDREIRA"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
    : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
}

function typeLabel(type: string) {
  return type === "PEDREIRA" ? "Pedreira" : "Serraria";
}

function typeIconBgClass(type: string) {
  return type === "PEDREIRA" ? "bg-blue-500/10" : "bg-amber-500/10";
}

function typeIconColorClass(type: string) {
  return type === "PEDREIRA" ? "text-blue-500" : "text-amber-500";
}

function openModal() {
  form.name    = "";
  form.cnpj    = "";
  form.type    = "PEDREIRA";
  form.address = "";
  formErrors.name = "";
  formErrors.cnpj = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleCreate() {
  if (!validate()) return;
  saving.value = true;
  const company = await companyStore.createCompany({
    name:    form.name,
    cnpj:    form.cnpj,
    type:    form.type,
    address: form.address || undefined,
  });
  saving.value = false;
  if (company) {
    closeModal();
    router.push({ name: "dashboard" });
  }
}

function selectCompany(id: string) {
  companyStore.select(id);
  router.push({ name: "dashboard" });
}

function logout() {
  authStore.logout();
  companyStore.clear();
  router.push({ name: "login" });
}

onMounted(async () => {
  loading.value = true;
  await companyStore.fetchCompanies();
  loading.value = false;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
