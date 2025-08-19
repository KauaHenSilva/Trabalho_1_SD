<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Bem-vindo</h2>
      <p>Digite seu email e senha para entrar</p>

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
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Digite sua senha"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">Carregando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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

        successMessage.value = 'Login realizado com sucesso! Redirecionando...'
        setTimeout(() => {router.push('/books')}, 1000)
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Erro interno. Tente novamente mais tarde.'
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
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background-color: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  width: 350px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  margin-bottom: 10px;
  color: #333;
}

p {
  margin-bottom: 20px;
  color: #666;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #444;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input:focus {
  border-color: #2575fc;
  outline: none;
  box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #2575fc;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #6a11cb;
}

.error {
  color: red;
  margin-top: 15px;
}
</style>

