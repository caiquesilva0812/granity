<template>
  <div class="min-h-screen flex">

    <!-- Painel esquerdo — formulário -->
    <div class="w-[45%] min-w-[380px] bg-white flex items-center justify-center p-10">
      <div class="w-full max-w-sm">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 mb-10">
          <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <span class="text-white font-extrabold text-base">G</span>
          </div>
          <span class="text-gray-900 font-bold text-xl tracking-tight">Granity</span>
        </div>

        <!-- Heading -->
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h1>
        <p class="text-gray-500 text-sm mb-8">Entre com suas credenciais para continuar</p>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="seu@email.com"
              :class="[
                'w-full px-3.5 py-2.5 rounded-lg border text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400 transition',
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'
              ]"
              @blur="validateField('email')"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">Senha</label>
              <a href="#" class="text-xs text-blue-600 hover:underline">Esqueceu sua senha?</a>
            </div>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              :class="[
                'w-full px-3.5 py-2.5 rounded-lg border text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400 transition',
                errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'
              ]"
              @blur="validateField('password')"
            />
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <button
            type="submit"
            :disabled="uiStore.isLoading"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg v-if="uiStore.isLoading" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ uiStore.isLoading ? "Entrando..." : "Entrar" }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?
          <a href="#" class="text-blue-600 font-medium hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>

    <!-- Painel direito — branding -->
    <div class="flex-1 bg-blue-600 relative flex items-center justify-center p-16 overflow-hidden">
      <div class="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-white/5" />
      <div class="absolute -bottom-36 -left-20 w-[360px] h-[360px] rounded-full bg-white/5" />
      <div class="absolute top-1/2 -translate-y-1/2 right-4 w-52 h-52 rounded-full bg-white/5" />

      <div class="relative z-10 max-w-md">
        <div class="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
          Plataforma especializada para pedreiras e serrarias
        </div>
        <h2 class="text-4xl font-bold text-white leading-tight mb-5">
          Controle total da sua pedreira, na palma da mão.
        </h2>
        <p class="text-white/70 text-base leading-relaxed mb-10">
          Gerencie produção, custos, estoque e vendas em uma plataforma feita para a indústria do granito e mármore.
        </p>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white/10 rounded-xl p-4 border border-white/15 backdrop-blur-sm">
            <Layers class="w-5 h-5 text-white/80 mb-3" />
            <p class="text-white font-medium text-sm mb-1">Produção</p>
            <p class="text-white/55 text-xs leading-relaxed">Registre e acompanhe cada extração em tempo real</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4 border border-white/15 backdrop-blur-sm">
            <Wallet class="w-5 h-5 text-white/80 mb-3" />
            <p class="text-white font-medium text-sm mb-1">Custos</p>
            <p class="text-white/55 text-xs leading-relaxed">Controle despesas e veja o custo por m³ extraído</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4 border border-white/15 backdrop-blur-sm">
            <ShoppingCart class="w-5 h-5 text-white/80 mb-3" />
            <p class="text-white font-medium text-sm mb-1">Vendas</p>
            <p class="text-white/55 text-xs leading-relaxed">Gerencie pedidos e acompanhe sua receita mensal</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useUiStore } from "../../stores/ui";
import { Layers, Wallet, ShoppingCart } from "lucide-vue-next";

const router    = useRouter();
const authStore = useAuthStore();
const uiStore   = useUiStore();

const email    = ref("");
const password = ref("");

const errors = reactive({ email: "", password: "" });

const loginSchema = z.object({
  email:    z.string().min(1, "E-mail é obrigatório.").email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória.").min(6, "Senha deve ter no mínimo 6 caracteres."),
});

function validateField(field: "email" | "password") {
  const result = loginSchema.safeParse({ email: email.value, password: password.value });
  if (result.success) {
    errors[field] = "";
    return;
  }
  const fieldError = result.error.flatten().fieldErrors[field];
  errors[field] = fieldError?.[0] ?? "";
}

function validate(): boolean {
  const result = loginSchema.safeParse({ email: email.value, password: password.value });
  if (result.success) {
    errors.email    = "";
    errors.password = "";
    return true;
  }
  const { fieldErrors } = result.error.flatten();
  errors.email    = fieldErrors.email?.[0]    ?? "";
  errors.password = fieldErrors.password?.[0] ?? "";
  return false;
}

async function handleLogin() {
  if (!validate()) return;
  const success = await authStore.login(email.value, password.value);
  if (success) router.push({ name: "company-selection" });
}
</script>
