<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Backdrop mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <AppNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main
        class="flex-1 overflow-y-auto p-4 lg:p-6"
        :style="{ backgroundColor: 'var(--canvas)' }"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import AppSidebar from "./AppSidebar.vue";
import AppNavbar from "./AppNavbar.vue";

const sidebarOpen = ref(false);

const route = useRoute();
watch(() => route.path, () => {
  sidebarOpen.value = false;
});
</script>
