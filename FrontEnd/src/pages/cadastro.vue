<template>
  <div class="register-wrapper">
    <div class="register-card" v-if="!showSuccessModal">
      <h2>Criar Conta</h2>
      <!-- Mensagem de erro -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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

    <!-- Modal de sucesso -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Registro realizado com sucesso!</h3>
        <button @click="goToLogin" class="modal-btn">Ir para tela de login</button>
        <button @click="closeModal" class="modal-btn cancel">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

export default defineComponent({
  name: 'Cadastro',
  setup() {
    const router = useRouter()
    const form = reactive({
      name: '',
      email: '',
      password: ''
    })
    const showSuccessModal = ref(false)
    const errorMessage = ref('')

    const handleRegister = async () => {
      errorMessage.value = ''
      try {
        await authService.register(form)
        showSuccessModal.value = true
      } catch (error) {
        errorMessage.value = 'Usuário já cadastrado.'
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    const closeModal = () => {
      showSuccessModal.value = false
    }

    return {
      form,
      handleRegister,
      showSuccessModal,
      goToLogin,
      closeModal,
      errorMessage
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

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  text-align: center;
  min-width: 300px;
}

.modal-btn {
  margin: 1rem 0.5rem 0 0.5rem;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #42b983;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

.modal-btn.cancel {
  background: #ccc;
  color: #333;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>