import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginView.vue"),
  },
  {
    path: "/companies",
    name: "company-selection",
    component: () => import("../views/companies/CompanySelectionView.vue"),
  },
  {
    path: "/",
    component: () => import("../components/layout/AppLayout.vue"),
    children: [
      { path: "",                              name: "dashboard",        component: () => import("../views/dashboard/DashboardView.vue") },
      { path: "custos",                        name: "cost-index",       component: () => import("../views/costs/CostIndexView.vue") },
      { path: "custos/registrar",              name: "cost-create",      component: () => import("../views/costs/CostCreateView.vue") },
      { path: "estoque",                       name: "stock-index",      component: () => import("../views/stock/StockIndexView.vue") },
      { path: "vendas",                        name: "sale-index",       component: () => import("../views/sales/SaleIndexView.vue") },
      { path: "vendas/registrar",              name: "sale-create",      component: () => import("../views/sales/SaleCreateView.vue") },
      { path: "funcionarios",                  name: "employee-index",   component: () => import("../views/employees/EmployeeIndexView.vue") },
      { path: "configuracoes",                 name: "settings",         component: () => import("../views/settings/SettingsView.vue") },
      { path: "configuracoes/empresa",         name: "settings-empresa", component: () => import("../views/settings/SettingsEmpresaView.vue") },
      { path: "configuracoes/usuarios",        name: "settings-usuarios", component: () => import("../views/settings/SettingsUsuariosView.vue") },
      { path: "configuracoes/tipos-material",  name: "material-types",   component: () => import("../views/materials/MaterialTypeIndexView.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getSelectedCompanyId(): string | null {
  try {
    const raw = localStorage.getItem("company");
    return raw ? (JSON.parse(raw) as { selectedId?: string }).selectedId ?? null : null;
  } catch {
    return null;
  }
}

router.beforeEach((to, _from, next) => {
  const token      = localStorage.getItem("access_token");
  const selectedId = getSelectedCompanyId();

  // Not authenticated → only allow login page
  if (!token) {
    if (to.name === "login") return next();
    return next({ name: "login" });
  }

  // Authenticated + trying to reach login → send to company selection
  if (to.name === "login") return next({ name: "company-selection" });

  // Authenticated + no company selected + not going to company selection → redirect there
  if (!selectedId && to.name !== "company-selection") {
    return next({ name: "company-selection" });
  }

  next();
});

export default router;
