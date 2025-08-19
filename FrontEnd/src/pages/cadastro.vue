<template>
  <div class="cadastro-wrapper">
    <div class="cadastro-card">
      <h2>Cadastro</h2>
      <p>Crie sua conta preenchendo os campos abaixo</p>

      <form @submit.prevent="handleCadastro">
        <div class="input-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="nome" placeholder="Seu nome" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="seu@email.com" required />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="senha" placeholder="Senha" required />
        </div>

        <div class="input-group">
          <label for="confirmarSenha">Confirmar Senha</label>
          <input type="password" id="confirmarSenha" v-model="confirmarSenha" placeholder="Confirme sua senha" required />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      <p class="login-link">
        Já tem uma conta? <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cadastro",
  data() {
    return {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: ""
    };
  },
  methods: {
    handleCadastro() {
      if (this.senha !== this.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      // Aqui você faria a lógica para salvar o usuário (API, localStorage, etc.)
      alert(`Usuário ${this.nome} cadastrado com sucesso!`);
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.cadastro-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}

.cadastro-card {
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

.login-link {
  margin-top: 1rem;
  text-align: center;
}
</style>
