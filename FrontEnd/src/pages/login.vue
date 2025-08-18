<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-header">
          <div class="logo">📚</div>
          <h1 class="title">Sistema de Biblioteca</h1>
          <p class="subtitle">Faça login para acessar sua conta</p>
          
          <!-- Informações de teste (apenas em modo mock) -->
          <div v-if="dataMode === 'mock'" class="test-info">
            <div class="test-badge">
              🧪 Modo de Teste
            </div>
            <details class="test-credentials">
              <summary>Credenciais de teste</summary>
              <div class="credentials-list">
                <div 
                  v-for="cred in testCredentials" 
                  :key="cred.email"
                  class="credential-item"
                  @click="fillTestCredentials(cred)"
                >
                  <strong>{{ cred.role === 'admin' ? '👤 Admin' : '👤 User' }}:</strong>
                  <span>{{ cred.email }}</span>
                  <small>Senha: {{ cred.password }}</small>
                  <span class="click-hint">Clique para preencher</span>
                </div>
              </div>
            </details>
          </div>
        </div>

        <transition name="fade">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
        </transition>

        <transition name="fade">
          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>
        </transition>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email"
              :class="['form-control', { 'is-invalid': errors.email }]"
              placeholder="seu@email.com" 
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password"
              :class="['form-control', { 'is-invalid': errors.password }]"
              placeholder="Digite sua senha" 
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-check">
            <input 
              type="checkbox" 
              id="remember" 
              v-model="form.rememberMe"
              class="form-check-input"
              :disabled="isLoading"
            >
            <label for="remember" class="form-check-label">Lembrar de mim</label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-login"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner me-2"></span>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="text-center mt-3">
            <a href="#" @click.prevent="handleForgotPassword" class="link-secondary">
              Esqueceu sua senha?
            </a>
          </div>

          <div class="divider">
            <span>ou</span>
          </div>

          <router-link to="/cadastro" class="btn btn-outline-primary btn-register">
            Criar nova conta
          </router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services'
import { getTestCredentials, getCurrentDataMode } from '../services'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: false,
  password: false
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const dataMode = ref('')
const testCredentials = ref<any[]>([])

onMounted(() => {
  dataMode.value = getCurrentDataMode()
  const creds = getTestCredentials()
  if (creds) {
    testCredentials.value = creds
  }
})

const handleLogin = async () => {
  clearMessages()
  
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Usar o serviço configurado (mock ou API real)
    await authService.login({
      email: form.email,
      password: form.password
    })
    
    successMessage.value = 'Login realizado com sucesso! Redirecionando...'
    
    setTimeout(() => {
      router.push('/books')
    }, 1000) // Reduzido de 1500 para 1000ms
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro interno. Tente novamente mais tarde.'
  } finally {
    isLoading.value = false
  }
}

const fillTestCredentials = (credentials: any) => {
  form.email = credentials.email
  form.password = credentials.password
  clearMessages()
}

const handleForgotPassword = () => {
  if (dataMode.value === 'mock') {
    alert('Em modo de teste, use as credenciais fornecidas acima.')
  } else {
    alert('Funcionalidade de recuperação de senha será implementada em breve.')
  }
}

const validateForm = () => {
  errors.email = false
  errors.password = false
  let isValid = true

  if (!form.email || !isValidEmail(form.email)) {
    errors.email = true
    isValid = false
  }

  if (!form.password || form.password.length < 3) {
    errors.password = true
    isValid = false
  }

  if (!isValid) {
    errorMessage.value = 'Por favor, preencha todos os campos corretamente.'
  }

  return isValid
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
  errors.email = false
  errors.password = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
  padding: var(--spacing-4);
}

.login-container {
  background-color: var(--color-white);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  border-radius: 50%;
  margin: 0 auto var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  font-weight: bold;
  box-shadow: var(--shadow-md);
}

.title {
  color: var(--color-gray-700);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-2);
}

.subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

/* Informações de teste */
.test-info {
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
}

.test-badge {
  background-color: #fd7e14;
  color: white;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  display: inline-block;
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-xs);
}

.test-credentials {
  margin-top: var(--spacing-2);
}

.test-credentials summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-gray-600);
  padding: var(--spacing-1) 0;
  user-select: none;
}

.test-credentials summary:hover {
  color: var(--color-primary);
}

.credentials-list {
  margin-top: var(--spacing-2);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.credential-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.credential-item:hover {
  border-color: var(--color-primary);
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

.credential-item strong {
  color: var(--color-gray-700);
}

.credential-item span:not(.click-hint) {
  color: var(--color-gray-600);
}

.credential-item small {
  color: var(--color-gray-500);
  font-family: monospace;
}

.click-hint {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.credential-item:hover .click-hint {
  opacity: 1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-label {
  color: var(--color-gray-600);
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.form-check {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.form-check-input {
  accent-color: var(--color-primary);
  transform: scale(1.1);
}

.form-check-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  cursor: pointer;
}

.btn-login,
.btn-register {
  width: 100%;
  padding: var(--spacing-4);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-register {
  border-width: 2px;
}

.link-secondary {
  color: var(--color-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color 0.3s ease;
}

.link-secondary:hover {
  color: var(--color-secondary-dark);
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: var(--spacing-6) 0;
  position: relative;
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-gray-200);
  z-index: 1;
}

.divider span {
  background-color: var(--color-white);
  padding: 0 var(--spacing-4);
  position: relative;
  z-index: 2;
}

.alert {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  border: 1px solid;
  margin-bottom: var(--spacing-4);
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.me-2 {
  margin-right: var(--spacing-2);
}

.mt-3 {
  margin-top: var(--spacing-3);
}

/* Responsividade mobile */
@media (max-width: 480px) {
  .login-page {
    padding: var(--spacing-2);
  }
  
  .login-container {
    padding: var(--spacing-6);
    margin: var(--spacing-4) 0;
  }
  
  .title {
    font-size: var(--font-size-xl);
  }
  
  .logo {
    width: 50px;
    height: 50px;
    font-size: var(--font-size-xl);
  }
}

/* Responsividade tablet */
@media (min-width: 768px) {
  .login-container {
    padding: var(--spacing-10);
  }
}

/* Estados de foco aprimorados para acessibilidade */
.form-control:focus,
.form-check-input:focus,
.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Animações suaves */
.form-control,
.btn {
  transition: all 0.3s ease;
}

/* Melhor contraste para modo escuro (preparação futura) */
@media (prefers-color-scheme: dark) {
  .login-page {
    background: linear-gradient(135deg, #1a5632 0%, #0f4c81 100%);
  }
}
</style>