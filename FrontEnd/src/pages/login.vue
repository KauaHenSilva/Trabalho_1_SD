<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Biblioteca - Login</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 100%;
            max-width: 400px;
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

        input[type="email"],
        input[type="password"] {
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

        .primary-button:active {
            transform: translateY(0);
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

        .link-button {
            color: #dc3545;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
            cursor: pointer;
        }

        .link-button:hover {
            color: #c82333;
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
            animation: fadeIn 0.3s ease;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
            animation: fadeIn 0.3s ease;
        }

        .remember-me {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .remember-me input[type="checkbox"] {
            margin-right: 8px;
            accent-color: #28a745;
        }

        .remember-me label {
            margin-bottom: 0;
            font-weight: normal;
            font-size: 14px;
            color: #666;
            cursor: pointer;
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

        .back-link {
            text-align: center;
            margin: 20px 0;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.3s ease;
        }

        .fade-enter-from, .fade-leave-to {
            opacity: 0;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="container">
            <div class="header">
                <div class="logo">📚</div>
                <h1 class="title">Sistema de Biblioteca</h1>
                <p class="subtitle">Faça login para acessar sua conta</p>
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

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
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

                <div class="form-group">
                    <label for="password">Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        v-model="form.password"
                        :class="{ 'input-error': errors.password }"
                        placeholder="Digite sua senha" 
                        required
                        :disabled="isLoading"
                    >
                </div>

                <div class="remember-me">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        v-model="form.rememberMe"
                        :disabled="isLoading"
                    >
                    <label for="remember">Lembrar de mim</label>
                </div>

                <button 
                    type="submit" 
                    class="primary-button"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading" class="loading"></span>
                    {{ isLoading ? 'Entrando...' : 'Entrar' }}
                </button>

                <div class="back-link">
                    <a class="link-button" href="forgot-password.html">Esqueceu sua senha?</a>
                </div>

                <div class="divider">
                    <span>ou</span>
                </div>

                <a href="register.html" class="secondary-button">
                    Criar nova conta
                </a>
            </form>
        </div>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    form: {
                        email: '',
                        password: '',
                        rememberMe: false
                    },
                    errors: {
                        email: false,
                        password: false
                    },
                    errorMessage: '',
                    successMessage: '',
                    isLoading: false
                }
            },
            methods: {
                async handleLogin() {
                    this.clearMessages();
                    
                    if (!this.validateForm()) return;

                    this.isLoading = true;

                    try {
                        await this.simulateAuth();
                        
                        if (this.form.email === 'admin@biblioteca.com' && this.form.password === '123456') {
                            this.successMessage = 'Login realizado com sucesso! Redirecionando...';
                            
                            setTimeout(() => {
                                alert('Bem-vindo ao sistema da biblioteca!');
                                this.resetForm();
                            }, 2000);
                        } else {
                            this.errorMessage = 'Email ou senha incorretos. Tente novamente.';
                        }
                    } catch (error) {
                        this.errorMessage = 'Erro interno. Tente novamente mais tarde.';
                    } finally {
                        this.isLoading = false;
                    }
                },

                validateForm() {
                    this.errors = { email: false, password: false };
                    let isValid = true;

                    if (!this.form.email || !this.isValidEmail(this.form.email)) {
                        this.errors.email = true;
                        isValid = false;
                    }

                    if (!this.form.password || this.form.password.length < 3) {
                        this.errors.password = true;
                        isValid = false;
                    }

                    if (!isValid) {
                        this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
                    }

                    return isValid;
                },

                isValidEmail(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                },

                simulateAuth() {
                    return new Promise(resolve => {
                        setTimeout(resolve, 1500);
                    });
                },

                clearMessages() {
                    this.errorMessage = '';
                    this.successMessage = '';
                    this.errors = { email: false, password: false };
                },

                resetForm() {
                    this.form = {
                        email: '',
                        password: '',
                        rememberMe: false
                    };
                    this.clearMessages();
                }
            },

            watch: {
                'form.email'() {
                    if (this.errors.email) {
                        this.errors.email = false;
                    }
                },
                'form.password'() {
                    if (this.errors.password) {
                        this.errors.password = false;
                    }
                }
            }
        }).mount('#app');
    </script>
</body>
</html>