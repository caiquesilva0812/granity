<template>
  <div class="min-h-screen flex">
    <!-- Painel esquerdo -->
    <div class="w-2/5 min-w-80 bg-login-left flex flex-col p-10">
      <div class="mb-12">
        <span class="text-white font-bold text-xl tracking-wide">Granity</span>
      </div>

      <div class="flex-1 flex flex-col justify-center max-w-sm w-full">
        <h1 class="text-white text-3xl font-bold mb-8">Entrar</h1>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">
              E-mail <span class="text-red-400">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              class="w-full px-3 py-2 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-white/80 text-sm font-medium mb-1.5">
              Senha <span class="text-red-400">*</span>
            </label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full px-3 py-2 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded transition-colors mt-2"
          >
            Entrar
          </button>

          <div class="flex justify-between text-sm pt-1">
            <a href="#" class="text-indigo-300 hover:underline">Esqueceu sua senha?</a>
            <a href="#" class="text-indigo-300 hover:underline">Cadastre-se</a>
          </div>
        </form>
      </div>
    </div>

    <!-- Painel direito -->
    <div class="flex-1 relative flex items-center justify-center p-16 text-white bg-gradient-to-br from-indigo-600 to-violet-700">
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 24px 24px;"
      />
      <div class="relative z-10 max-w-lg">
        <h2 class="text-4xl font-bold mb-5 leading-snug">
          Transforme a forma como seu negócio opera
        </h2>
        <p class="text-white/75 text-lg leading-relaxed">
          Granity conecta pessoas, processos e dados em uma plataforma poderosa,
          feita para simplificar cada projeto e aumentar a produtividade.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

async function handleLogin() {
  const success = await authStore.login(email.value, password.value);
  if (success) router.push({ name: "dashboard" });
}
</script>
