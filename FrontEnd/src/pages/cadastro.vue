<template>
  <div class="container">
    <div class="header">
      <div class="logo">📚</div>
      <h1 class="title">Sistema de Biblioteca</h1>
      <p class="subtitle">Crie sua conta para acessar o sistema</p>
    </div>

    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </transition>

    <transition name="fade">
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </transition>

    <form @submit.prevent="handleRegister">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Nome *</label>
          <input 
            type="text" 
            id="firstName" 
            v-model="form.firstName"
            :class="{ 'input-error': errors.firstName }"
            placeholder="Seu nome" 
            required
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label for="lastName">Sobrenome *</label>
          <input 
            type="text" 
            id="lastName" 
            v-model="form.lastName"
            :class="{ 'input-error': errors.lastName }"
            placeholder="Seu sobrenome" 
            required
            :disabled="isLoading"
          >
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email"
          :class="{ 'input-error': errors.email }"
          placeholder="seu@email.com" 
          required
          :disabled="isLoading"
        >
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="password">Senha *</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            :class="{ 'input-error': errors.password }"
            placeholder="Mínimo 6 caracteres" 
            required
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha *</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="Confirme sua senha" 
            required
            :disabled="isLoading"
          >
        </div>
      </div>

      <div class="form-group">
        <label for="phone">Telefone</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone"
          placeholder="(11) 99999-9999"
          :disabled="isLoading"
        >
      </div>

      <div class="checkbox-group">
        <input 
          type="checkbox" 
          id="terms" 
          v-model="form.acceptTerms"
          :disabled="isLoading"
        >
        <label for="terms">
          Li e aceito os <a href="#" class="link">termos de uso</a> e 
          <a href="#" class="link">política de privacidade</a> *
        </label>
      </div>

      <button 
        type="submit" 
        class="primary-button"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="loading"></span>
        {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
      </button>

      <div class="divider">
        <span>ou</span>
      </div>

      <router-link to="/login" class="secondary-button">
        Já tenho uma conta
      </router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  acceptTerms: false
})

const errors = reactive({
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  confirmPassword: false
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  clearMessages()
  
  if (!validateForm()) return

  isLoading.value = true

  try {
    await simulateRegister()
    
    // Simular criação de conta bem-sucedida
    successMessage.value = 'Conta criada com sucesso! Redirecionando para o login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Erro interno. Tente novamente mais tarde.'
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  errors.firstName = false
  errors.lastName = false
  errors.email = false
  errors.password = false
  errors.confirmPassword = false
  
  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = true
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = true
    isValid = false
  }

  if (!form.email || !isValidEmail(form.email)) {
    errors.email = true
    isValid = false
  }

  if (!form.password || form.password.length < 6) {
    errors.password = true
    isValid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = true
    isValid = false
  }

  if (!form.acceptTerms) {
    errorMessage.value = 'Você deve aceitar os termos de uso.'
    isValid = false
  }

  if (!isValid && !errorMessage.value) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios corretamente.'
  }

  return isValid
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const simulateRegister = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
  errors.firstName = false
  errors.lastName = false
  errors.email = false
  errors.password = false
  errors.confirmPassword = false
}
</script>

<style scoped>
.container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  margin: 50px auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 60px;
  height: 60px;
  background-color: #dc3545;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.title {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;
}

input:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.input-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 10px;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 2px;
  accent-color: #28a745;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
}

.link {
  color: #dc3545;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.primary-button {
  width: 100%;
  padding: 14px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.primary-button:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-1px);
}

.primary-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.secondary-button {
  width: 100%;
  padding: 12px;
  border: 2px solid #dc3545;
  border-radius: 8px;
  background-color: white;
  color: #dc3545;
  text-decoration: none;
  font-weight: 600;
  display: block;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 16px;
}

.secondary-button:hover {
  background-color: #dc3545;
  color: white;
  transform: translateY(-1px);
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
  color: #666;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}

.divider span {
  background-color: white;
  padding: 0 15px;
  position: relative;
  z-index: 2;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
}

.loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .container {
    margin: 20px auto;
    padding: 30px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>