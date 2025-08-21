<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Bem-vindo</h2>
      <p>Digite seu email e senha para entrar</p>

      <!-- Mensagens de sucesso e erro -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="seu@email.com"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <input
            type="password"
            id="senha"
            v-model="form.password"
            placeholder="Sua senha"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">Carregando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="register-link">
        Não tem conta?
        <router-link to="/cadastro" class="register-btn">Registrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const form = reactive({
    email: '',
    password: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    clearMessages()
    isLoading.value = true

    try {
        await authService.login({
            email: form.email,
            password: form.password
        })

        
        setTimeout(() => {router.push('/books')}, 1000)
    } catch (error) {
        errorMessage.value = 'Email ou senha incorretos.'
    } finally {
        isLoading.value = false
    }
}

const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 350px;
}

.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 0.5rem;
}

.input-group input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #42b983;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
}

.register-btn {
  margin-left: 5px;
  color: #42b983;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.register-btn:hover {
  text-decoration: underline;
}

.success-message {
  color: #42b983;
  text-align: center;
  margin-bottom: 1rem;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>