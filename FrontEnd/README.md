# FrontEnd

# Sistema de Biblioteca - Frontend

Um sistema responsivo de gerenciamento de biblioteca desenvolvido em Vue.js 3 com TypeScript.

## ✨ **Como Alternar Entre Dados Mockados e API Real**

### 🧪 **Modo Mockado (Desenvolvimento Local)**

Para usar dados simulados localmente (padrão):

1. **Configure o arquivo `.env`:**
```env
VITE_DATA_MODE=mock
VITE_API_BASE_URL=http://localhost:3000/api
```

2. **Características do modo mock:**
- ✅ Dados salvos no localStorage
- ✅ Simulação de delays de rede
- ✅ Credenciais de teste pré-definidas
- ✅ Funciona sem backend
- ✅ Ideal para desenvolvimento frontend

3. **Credenciais de teste:**
```
Admin: admin@biblioteca.com / 123456
User:  user@biblioteca.com  / password
```

### 🌐 **Modo API Real**

Para conectar com sua API:

1. **Configure o arquivo `.env`:**
```env
VITE_DATA_MODE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

2. **Para produção:**
```env
VITE_DATA_MODE=api
VITE_API_BASE_URL=https://sua-api-production.com/api
VITE_APP_ENV=production
```

### 🔄 **Alternando Entre Modos**

**Método 1: Arquivo .env**
```bash
# Altere no arquivo .env
VITE_DATA_MODE=mock  # para dados locais
# ou
VITE_DATA_MODE=api   # para API real

# Depois reinicie o servidor
npm run dev
```

**Método 2: Via Console (desenvolvimento)**
```javascript
// No DevTools do navegador
__APP_SERVICES__.getCurrentDataMode()  // ver modo atual
// Para alterar, edite o .env e recarregue a página
```

### 🎯 **Indicadores Visuais**

- **🧪 TEST**: Modo mockado ativo
- **🌐 API**: Modo API real ativo
- **Credenciais de teste**: Aparece automaticamente em modo mock

## 🚀 Características

- **Totalmente Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Sistema Dual**: Alterna facilmente entre dados mockados e API real
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Componentes Reutilizáveis**: Arquitetura modular e escalável
- **Design System**: Variáveis CSS customizáveis e classes utilitárias
- **Acessibilidade**: Componentes acessíveis e navegação por teclado

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AppLayout.vue   # Layout responsivo principal
│   └── ...
├── composables/         # Hooks personalizados
│   ├── useApi.ts       # Gerenciamento de API
│   └── useResponsive.ts # Controle de responsividade
├── pages/              # Páginas da aplicação
│   ├── login.vue       # Página de login
│   ├── BookList.vue    # Lista de livros
│   └── ...
├── services/           # Serviços de API
│   ├── index.ts        # 🔄 Selector de modo (mock/api)
│   ├── api.ts          # Cliente HTTP base
│   ├── authService.ts  # Autenticação (API real)
│   ├── bookService.ts  # Livros (API real)
│   └── mockService.ts  # 🧪 Dados simulados
├── router/             # Configuração de rotas
└── assets/             # Recursos estáticos
```

## 🔧 Configuração da API Real

### 1. Estrutura da API Esperada

#### Autenticação
```typescript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Livros
```typescript
// GET /api/books
{
  "data": [
    {
      "id": 1,
      "title": "Título do Livro",
      "author": "Autor",
      "isbn": "978-85-595-0031-6",
      "year": 2023,
      "pages": 300,
      "category": "ficção",
      "available": true,
      "description": "Descrição do livro",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// POST /api/books
{
  "title": "Novo Livro",
  "author": "Autor",
  "isbn": "978-85-595-0031-6",
  "year": 2023,
  "pages": 300,
  "category": "ficção",
  "description": "Descrição"
}

// PUT /api/books/:id
// DELETE /api/books/:id
```

## 🧪 Dados Mockados

### Características dos Dados de Teste:
- **6 livros** pré-cadastrados
- **Categorias**: ficção, não-ficção, técnico
- **Disponibilidade**: alguns livros indisponíveis
- **Persistência**: dados salvos no localStorage
- **Simulação realista**: delays de rede e possibilidade de erros

### Livros de Exemplo:
1. O Senhor dos Anéis - J.R.R. Tolkien
2. 1984 - George Orwell
3. Dom Casmurro - Machado de Assis
4. Clean Code - Robert C. Martin
5. Sapiens - Yuval Noah Harari
6. O Pequeno Príncipe - Antoine de Saint-Exupéry

## 📱 Responsividade

O sistema utiliza breakpoints padrão:

- **xs**: < 576px (Mobile Portrait)
- **sm**: 576px - 767px (Mobile Landscape)
- **md**: 768px - 991px (Tablet)
- **lg**: 992px - 1199px (Desktop)
- **xl**: 1200px - 1399px (Large Desktop)
- **2xl**: ≥ 1400px (Extra Large Desktop)

### Classes Utilitárias

```html
<!-- Display responsivo -->
<div class="d-none d-md-block">Visível apenas em tablet+</div>
<div class="d-block d-md-none">Visível apenas em mobile</div>

<!-- Grid responsivo -->
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">Responsivo</div>
</div>

<!-- Flexbox -->
<div class="d-flex flex-column flex-md-row">
  <div class="flex-1">Conteúdo</div>
</div>
```

## 🔌 Uso dos Serviços

### Serviço Unificado (Recomendado)

```typescript
import { authService, bookService, getCurrentDataMode } from '@/services'

// Funciona tanto em modo mock quanto API real
const loginUser = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password })
    console.log('Usuário logado:', response.user)
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

// Verificar modo atual
console.log('Modo atual:', getCurrentDataMode()) // 'mock' ou 'api'
```

### Debugging no Console

```javascript
// Acessar serviços no DevTools
__APP_SERVICES__.authService
__APP_SERVICES__.bookService
__APP_SERVICES__.getCurrentDataMode()
__APP_SERVICES__.getTestCredentials() // apenas em modo mock
```

## 🚀 Início Rápido

### 1. **Clone e Instale**
```bash
git clone <repo>
cd FrontEnd
npm install
```

### 2. **Configure o Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Para desenvolvimento com dados mockados (padrão)
# Mantenha: VITE_DATA_MODE=mock

# Para API real, altere para:
# VITE_DATA_MODE=api
```

### 3. **Execute**
```bash
npm run dev
```

### 4. **Teste**
- Acesse: http://localhost:5173
- **Modo Mock**: Use credenciais mostradas na tela
- **Modo API**: Configure sua API e use credenciais reais

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🚀 Deploy

### Para Desenvolvimento
```bash
# 1. Use modo mock
VITE_DATA_MODE=mock

# 2. Build
npm run build

# 3. Deploy pasta dist/
```

### Para Produção
```bash
# 1. Configure API real
VITE_DATA_MODE=api
VITE_API_BASE_URL=https://sua-api.com/api

# 2. Build
npm run build

# 3. Deploy pasta dist/
```

## 🔍 Debugging

### Verificar Estado dos Serviços
```javascript
// No console do navegador
console.log('Modo:', __APP_SERVICES__.getCurrentDataMode())
console.log('Autenticado:', __APP_SERVICES__.authService.isAuthenticated())
console.log('Token:', __APP_SERVICES__.authService.getToken())
```

### Logs Automáticos
- ✅ Modo de dados no console
- ✅ Credenciais de teste (modo mock)
- ✅ URL da API (modo real)
- ✅ Erros detalhados

## 🤝 Fluxo de Desenvolvimento

### 1. **Desenvolvimento Frontend**
```bash
# Use dados mockados
VITE_DATA_MODE=mock
npm run dev
```

### 2. **Integração com Backend**
```bash
# Alterne para API real quando o backend estiver pronto
VITE_DATA_MODE=api
npm run dev
```

### 3. **Produção**
```bash
# Configure API de produção
VITE_DATA_MODE=api
VITE_API_BASE_URL=https://api-producao.com/api
npm run build
```

## 📄 Licença

Este projeto está sob a licença MIT.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
