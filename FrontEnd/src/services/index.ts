import { authService as realAuthService } from './authService'
import { bookService as realBookService } from './bookService'
import { mockAuthService, mockBookService } from './mockService'
import type { AuthService } from './authService'
import type { BookService } from './bookService'

// Verificar se deve usar dados mockados ou API real
const getDataMode = (): 'mock' | 'api' => {
  const mode = import.meta.env.VITE_DATA_MODE
  return mode === 'api' ? 'api' : 'mock'
}

// Exibir no console qual modo está sendo usado
const currentMode = getDataMode()
console.log(`🔧 Modo de dados: ${currentMode.toUpperCase()}`)

if (currentMode === 'mock') {
  console.log('📱 Usando dados mockados locais')
  console.log('💡 Para usar API real, altere VITE_DATA_MODE=api no arquivo .env')
} else {
  console.log('🌐 Usando API real')
  console.log(`🔗 URL da API: ${import.meta.env.VITE_API_BASE_URL}`)
}

// Factory para criar o serviço de autenticação apropriado
const createAuthService = (): AuthService => {
  if (getDataMode() === 'mock') {
    // Adapter para que o mock service tenha a mesma interface
    return {
      login: mockAuthService.login.bind(mockAuthService),
      register: mockAuthService.register.bind(mockAuthService),
      logout: mockAuthService.logout.bind(mockAuthService),
      getCurrentUser: mockAuthService.getCurrentUser.bind(mockAuthService),
      getToken: mockAuthService.getToken.bind(mockAuthService),
      isAuthenticated: mockAuthService.isAuthenticated.bind(mockAuthService),
      validateToken: mockAuthService.validateToken.bind(mockAuthService)
    }
  }
  return realAuthService
}

// Factory para criar o serviço de livros apropriado
const createBookService = (): BookService => {
  if (getDataMode() === 'mock') {
    // Adapter para que o mock service tenha a mesma interface
    return {
      getBooks: mockBookService.getBooks.bind(mockBookService),
      getBookById: mockBookService.getBookById.bind(mockBookService),
      createBook: mockBookService.createBook.bind(mockBookService),
      updateBook: mockBookService.updateBook.bind(mockBookService),
      deleteBook: mockBookService.deleteBook.bind(mockBookService),
      searchBooks: mockBookService.searchBooks.bind(mockBookService)
    }
  }
  return realBookService
}

// Exportar as instâncias configuradas
export const authService = createAuthService()
export const bookService = createBookService()

// Exportar função para alternar modo (útil para debugging)
export const switchDataMode = (mode: 'mock' | 'api') => {
  console.warn(`⚠️  Para alterar o modo de dados para ${mode.toUpperCase()}, atualize VITE_DATA_MODE=${mode} no arquivo .env e recarregue a página`)
}

// Exportar função para verificar modo atual
export const getCurrentDataMode = () => getDataMode()

// Exportar credenciais de teste (apenas para modo mock)
export const getTestCredentials = () => {
  if (getDataMode() === 'mock') {
    return [
      { email: 'admin@biblioteca.com', password: '123456', role: 'admin' },
      { email: 'user@biblioteca.com', password: 'password', role: 'user' }
    ]
  }
  return null
}
