<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Biblioteca - Criar Conta</title>
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
            max-width: 450px;
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
            line-height: 1.4;
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
        input[type="password"],
        input[type="text"] {
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

        .password-requirements {
            background-color: #e9ecef;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            color: #495057;
            margin-top: 8px;
        }

        .password-requirements ul {
            margin: 8px 0 0 16px;
        }

        .password-requirements li {
            margin-bottom: 4px;
        }

        .requirement-met {
            color: #28a745;
        }

        .requirement-unmet {
            color: #dc3545;
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
                <h1 class="title">Criar Conta</h1>
                <p class="subtitle">Preencha os dados para criar sua conta na biblioteca</p>
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
                <div class="form-group">
                    <label for="fullName">Nome Completo</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        v-model="form.fullName"
                        :class="{ 'input-error': errors.fullName }"
                        placeholder="Seu nome completo" 
                        required
                        :disabled="isLoading"
                    >
                </div>

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
                    <div v-if="form.password" class="password-requirements">
                        <strong>Requisitos da senha:</strong>
                        <ul>
                            <li :class="passwordValidation.length ? 'requirement-met' : 'requirement-unmet'">
                                Pelo menos 8 caracteres
                            </li>
                            <li :class="passwordValidation.uppercase ? 'requirement-met' : 'requirement-unmet'">
                                Uma letra maiúscula
                            </li>
                            <li :class="passwordValidation.number ? 'requirement-met' : 'requirement-unmet'">
                                Um número
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirmar Senha</label>
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

                <button 
                    type="submit" 
                    class="primary-button"
                    :disabled="isLoading || !isPasswordValid"
                >
                    <span v-if="isLoading" class="loading"></span>
                    {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
                </button>

                <div class="back-link">
                    <a class="link-button" href="login.html">← Voltar ao login</a>
                </div>
            </form>
        </div>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    form: {
                        fullName: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    },
                    errors: {},
                    errorMessage: '',
                    successMessage: '',
                    isLoading: false
                }
            },
            computed: {
                passwordValidation() {
                    const password = this.form.password;
                    return {
                        length: password.length >= 8,
                        uppercase: /[A-Z]/.test(password),
                        number: /\d/.test(password)
                    };
                },
                isPasswordValid() {
                    return Object.values(this.passwordValidation).every(valid => valid) &&
                           this.form.password === this.form.confirmPassword;
                }
            },
            methods: {
                async handleRegister() {
                    this.clearMessages();
                    
                    if (!this.validateForm()) return;

                    this.isLoading = true;

                    try {
                        await this.simulateAuth();
                        
                        this.successMessage = 'Conta criada com sucesso! Redirecionando para login...';
                        
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2500);
                        
                    } catch (error) {
                        this.errorMessage = 'Erro ao criar conta. Tente novamente mais tarde.';
                    } finally {
                        this.isLoading = false;
                    }
                },

                validateForm() {
                    this.errors = {};
                    let isValid = true;

                    if (!this.form.fullName || this.form.fullName.length < 2) {
                        this.errors.fullName = true;
                        isValid = false;
                    }

                    if (!this.form.email || !this.isValidEmail(this.form.email)) {
                        this.errors.email = true;
                        isValid = false;
                    }

                    if (!this.isPasswordValid) {
                        this.errors.password = true;
                        isValid = false;
                    }

                    if (this.form.password !== this.form.confirmPassword) {
                        this.errors.confirmPassword = true;
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
                        setTimeout(resolve, 2000);
                    });
                },

                clearMessages() {
                    this.errorMessage = '';
                    this.successMessage = '';
                    this.errors = {};
                }
            },

            watch: {
                'form.fullName'() { this.errors.fullName = false; },
                'form.email'() { this.errors.email = false; },
                'form.password'() { this.errors.password = false; },
                'form.confirmPassword'() { this.errors.confirmPassword = false; }
            }
        }).mount('#app');
    </script>
</body>
</html>