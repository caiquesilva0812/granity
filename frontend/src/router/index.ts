import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginView.vue"),
  },
  {
    path: "/",
    component: () => import("../components/layout/AppLayout.vue"),
    // meta: { requiresAuth: true },
    children: [
      { path: "",              name: "dashboard",         component: () => import("../views/dashboard/DashboardView.vue") },
      { path: "empresas",      name: "company-selection", component: () => import("../views/companies/CompanySelectionView.vue") },
      { path: "producao",      name: "production-index",  component: () => import("../views/production/ProductionIndexView.vue") },
      { path: "producao/registrar", name: "production-create", component: () => import("../views/production/ProductionCreateView.vue") },
      { path: "custos",        name: "cost-index",        component: () => import("../views/costs/CostIndexView.vue") },
      { path: "custos/registrar",   name: "cost-create",  component: () => import("../views/costs/CostCreateView.vue") },
      { path: "estoque",       name: "stock-index",       component: () => import("../views/stock/StockIndexView.vue") },
      { path: "vendas",        name: "sale-index",        component: () => import("../views/sales/SaleIndexView.vue") },
      { path: "vendas/registrar",   name: "sale-create",  component: () => import("../views/sales/SaleCreateView.vue") },
      { path: "funcionarios",          name: "employee-index",    component: () => import("../views/employees/EmployeeIndexView.vue") },
      { path: "configuracoes",         name: "settings",          component: () => import("../views/settings/SettingsView.vue") },
      { path: "configuracoes/empresa", name: "settings-empresa",  component: () => import("../views/settings/SettingsEmpresaView.vue") },
      { path: "configuracoes/usuarios",name: "settings-usuarios", component: () => import("../views/settings/SettingsUsuariosView.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const token = localStorage.getItem("access_token");

  if (requiresAuth && !token) return next({ name: "login" });
  if (!requiresAuth && token && to.name === "login") return next({ name: "dashboard" });

  next();
});

export default router;
