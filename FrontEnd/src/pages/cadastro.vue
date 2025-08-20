<template>
  <div class="register-wrapper">
    <div class="register-card">
      <h2>Criar Conta</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>

        <button type="submit" class="btn-register">Registrar</button>
      </form>
      <p>
        Já tem conta?
        <router-link to="/login" class="link-login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService' // Corrigido aqui

export default defineComponent({
  name: 'Cadastro',
  setup() {
    const router = useRouter()
    const form = reactive({
      name: '',
      email: '',
      password: ''
    })

    const handleRegister = async () => {
      try {
        await authService.register(form) // Corrigido aqui
        alert('Registro realizado com sucesso!')
        router.push('/login')
      } catch (error) {
        alert('Falha no registro. Tente novamente.')
      }
    }

    return {
      form,
      handleRegister
    }
  }
})
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
}

.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn-register {
  background: #42b983;
  color: white;
  padding: 0.8rem;
  width: 100%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-register:hover {
  background: #36976d;
}

.link-login {
  color: #42b983;
  font-weight: bold;
  text-decoration: none;
}

.register-card p {
  text-align: center;
  margin-top: 1rem;
}
</style>