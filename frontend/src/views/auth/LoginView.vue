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
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="seu@email.com"
              class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-medium text-gray-700">Senha</label>
              <a href="#" class="text-xs text-blue-600 hover:underline">Esqueceu sua senha?</a>
            </div>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm mt-2"
          >
            Entrar
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
      <!-- Círculos decorativos -->
      <div class="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-white/5" />
      <div class="absolute -bottom-36 -left-20 w-[360px] h-[360px] rounded-full bg-white/5" />
      <div class="absolute top-1/2 -translate-y-1/2 right-4 w-52 h-52 rounded-full bg-white/5" />

      <!-- Conteúdo -->
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

        <!-- Feature cards -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { Layers, Wallet, ShoppingCart } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

async function handleLogin() {
  const success = await authStore.login(email.value, password.value);
  if (success) router.push({ name: "dashboard" });
}
</script>
