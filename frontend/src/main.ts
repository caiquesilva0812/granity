import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import router from "./router";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Toast, {
  position: "top-center",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: true,
  maxToasts: 3,
  newestOnTop: true,
});

// Aplica o tema (dark/light) antes de montar
import { useUiStore } from "./stores/ui";
useUiStore().initTheme();

app.mount("#app");
