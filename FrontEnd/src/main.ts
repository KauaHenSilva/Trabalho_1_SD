import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authService, bookService, getCurrentDataMode, getTestCredentials } from './services'

// Tipagem para desenvolvimento
declare global {
  interface Window {
    __APP_SERVICES__?: any
  }
}

const app = createApp(App)

// Prover serviços globalmente
app.provide('authService', authService)
app.provide('bookService', bookService)

// Informações de desenvolvimento
if (import.meta.env.DEV) {
  // Disponibilizar no window para debugging
  window.__APP_SERVICES__ = {
    authService,
    bookService,
    getCurrentDataMode,
    getTestCredentials
  }
  
  // Mostrar credenciais de teste se estiver em modo mock
  const testCredentials = getTestCredentials()
  if (testCredentials) {
    console.log('🔑 Credenciais de teste:')
    testCredentials.forEach(cred => {
      console.log(`   ${cred.role}: ${cred.email} / ${cred.password}`)
    })
  }
}

app.use(router).mount('#app')
