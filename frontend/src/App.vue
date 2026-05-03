<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useCompanyStore } from "./stores/company";

const authStore    = useAuthStore();
const companyStore = useCompanyStore();

onMounted(async () => {
  if (!authStore.token) return;
  await companyStore.fetchCompanies();
});
</script>
