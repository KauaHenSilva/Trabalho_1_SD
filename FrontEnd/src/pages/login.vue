<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Bem-vindo</h2>
      <p>Digite seu email e senha para entrar</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="seu@email.com" />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" placeholder="******" />
        </div>

        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <div class="extra">
        <p>Não tem conta?</p>
        <button @click="goToRegister" class="btn-register">Registrar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Exemplo de login
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!res.ok) throw new Error("Erro no login");
        const data = await res.json();
        alert("Login bem-sucedido: " + data.message);
      } catch (err) {
        alert("Erro: " + err.message);
      }
    },
    goToRegister() {
      this.$router.push("/cadastro"); // leva para Cadastro.vue
    },
  },
};
</script>

<style scoped>
.btn-login {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
}

.btn-register {
  margin-top: 10px;
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
