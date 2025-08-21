import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Tipagem para desenvolvimento
declare global {
  interface Window {
    __APP_SERVICES__?: any
  }
}

const app = createApp(App)

// Prover serviços globalmente
// Informações de desenvolvimento
if (import.meta.env.DEV) {
  // Disponibilizar no window para debugging
  window.__APP_SERVICES__ = {
  }
}

app.use(router).mount('#app')
