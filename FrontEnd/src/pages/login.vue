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
            v-model="email"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <input
            type="password"
            id="senha"
            v-model="senha"
            placeholder="Sua senha"
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>

      <!-- Botão que leva para a página de cadastro -->
      <p class="register-link">
        Não tem conta?
        <router-link to="/cadastro" class="register-btn">Registrar</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      senha: ""
    };
  },
  methods: {
    handleLogin() {
      // aqui você faz sua lógica de autenticação
      alert(`Login de ${this.email} realizado!`);
      this.$router.push("/home"); // exemplo de redirecionamento pós-login
    }
  }
};
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
}

.register-btn {
  margin-left: 5px;
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.register-btn:hover {
  text-decoration: underline;
}
</style>