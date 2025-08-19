// import type { Book, User, LoginRequest, RegisterRequest, PaginatedResponse } from './api'

// // Dados mockados para desenvolvimento
// export const mockUsers: User[] = [
//   {
//     id: 1,
//     email: 'admin@biblioteca.com',
//     name: 'Administrador',
//     role: 'admin',
//     createdAt: '2024-01-01T00:00:00Z'
//   },
//   {
//     id: 2,
//     email: 'user@biblioteca.com',
//     name: 'Usuário Teste',
//     role: 'user',
//     createdAt: '2024-01-02T00:00:00Z'
//   }
// ]

// export const mockBooks: Book[] = [
//   {
//     id: 1,
//     title: "O Senhor dos Anéis: A Sociedade do Anel",
//     author: "J.R.R. Tolkien",
//     isbn: "978-85-595-0031-6",
//     year: 1954,
//     pages: 423,
//     description: "Primeira parte da épica saga de fantasia que mudou o gênero para sempre.",
//     category: "ficção",
//     available: true,
//     createdAt: '2024-01-01T00:00:00Z',
//     updatedAt: '2024-01-01T00:00:00Z'
//   },
//   {
//     id: 2,
//     title: "1984",
//     author: "George Orwell",
//     isbn: "978-85-250-4683-2",
//     year: 1949,
//     pages: 416,
//     description: "Um clássico distópico sobre vigilância e controle totalitário.",
//     category: "ficção",
//     available: true,
//     createdAt: '2024-01-02T00:00:00Z',
//     updatedAt: '2024-01-02T00:00:00Z'
//   },
//   {
//     id: 3,
//     title: "Dom Casmurro",
//     author: "Machado de Assis",
//     isbn: "978-85-359-0277-5",
//     year: 1899,
//     pages: 256,
//     description: "Romance brasileiro que explora ciúme e dúvida em um casamento.",
//     category: "ficção",
//     available: false,
//     createdAt: '2024-01-03T00:00:00Z',
//     updatedAt: '2024-01-03T00:00:00Z'
//   },
//   {
//     id: 4,
//     title: "Clean Code",
//     author: "Robert C. Martin",
//     isbn: "978-0-13-235088-4",
//     year: 2008,
//     pages: 464,
//     description: "Manual de boas práticas para escrever código limpo e maintível.",
//     category: "técnico",
//     available: true,
//     createdAt: '2024-01-04T00:00:00Z',
//     updatedAt: '2024-01-04T00:00:00Z'
//   },
//   {
//     id: 5,
//     title: "Sapiens",
//     author: "Yuval Noah Harari",
//     isbn: "978-85-430-0077-9",
//     year: 2014,
//     pages: 512,
//     description: "Uma breve história da humanidade desde o paleolítico até o século XXI.",
//     category: "não-ficção",
//     available: true,
//     createdAt: '2024-01-05T00:00:00Z',
//     updatedAt: '2024-01-05T00:00:00Z'
//   },
//   {
//     id: 6,
//     title: "O Pequeno Príncipe",
//     author: "Antoine de Saint-Exupéry",
//     isbn: "978-85-260-1311-7",
//     year: 1943,
//     pages: 96,
//     description: "Fábula poética sobre amizade, amor e perda.",
//     category: "ficção",
//     available: true,
//     createdAt: '2024-01-06T00:00:00Z',
//     updatedAt: '2024-01-06T00:00:00Z'
//   }
// ]

// // Simulação de delay de rede - REMOVIDO para testes mais rápidos
// const simulateNetworkDelay = (min = 0, max = 0): Promise<void> => {
//   // Delay removido para facilitar testes
//   return Promise.resolve()
// }

// // Simulação de erro aleatório - DESABILITADO para testes
// const simulateRandomError = (errorRate = 0): void => {
//   // Erros desabilitados para facilitar testes
//   return
// }

// // Serviço de autenticação mockado
// export class MockAuthService {
//   private readonly STORAGE_KEYS = {
//     TOKEN: 'mock-auth-token',
//     USER: 'mock-user'
//   }

//   async login(credentials: LoginRequest) {
//     await simulateNetworkDelay()
//     simulateRandomError() // Sem chance de erro

//     // Credenciais válidas para teste - CORRIGIDAS
//     const validCredentials = [
//       { email: 'admin@biblioteca.com', password: '123456' },
//       { email: 'user@biblioteca.com', password: 'password' }
//     ]

//     const isValid = validCredentials.some(
//       cred => cred.email === credentials.email && cred.password === credentials.password
//     )

//     if (!isValid) {
//       console.error('Credenciais inválidas:', credentials.email)
//       console.log('Credenciais válidas:', validCredentials)
//       throw new Error('Email ou senha incorretos')
//     }

//     // Buscar usuário correspondente
//     const user = mockUsers.find(u => u.email === credentials.email)
//     if (!user) {
//       throw new Error('Usuário não encontrado')
//     }

//     const token = `mock-token-${Date.now()}-${user.id}`
    
//     // Salvar no localStorage
//     localStorage.setItem(this.STORAGE_KEYS.TOKEN, token)
//     localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user))

//     console.log('Login bem-sucedido:', user.email)
    
//     return {
//       token,
//       user
//     }
//   }

//   async register(userData: RegisterRequest) {
//     await simulateNetworkDelay()
//     simulateRandomError(0.05)

//     // Verificar se email já existe
//     const existingUser = mockUsers.find(u => u.email === userData.email)
//     if (existingUser) {
//       throw new Error('Email já está em uso')
//     }

//     const newUser: User = {
//       id: Math.max(...mockUsers.map(u => u.id)) + 1,
//       email: userData.email,
//       name: userData.name,
//       role: 'user', // Novos usuários são 'user' por padrão
//       createdAt: new Date().toISOString()
//     }

//     mockUsers.push(newUser)
//     return newUser
//   }

//   logout() {
//     localStorage.removeItem(this.STORAGE_KEYS.TOKEN)
//     localStorage.removeItem(this.STORAGE_KEYS.USER)
//   }

//   getCurrentUser(): User | null {
//     const userStr = localStorage.getItem(this.STORAGE_KEYS.USER)
//     if (userStr) {
//       try {
//         return JSON.parse(userStr)
//       } catch {
//         return null
//       }
//     }
//     return null
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.STORAGE_KEYS.TOKEN)
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken()
//   }

//   async validateToken(): Promise<boolean> {
//     // Sem delay para facilitar testes
//     return this.isAuthenticated()
//   }
// }

// // Serviço de livros mockado
// export class MockBookService {
//   private getStoredBooks(): Book[] {
//     const stored = localStorage.getItem('mock-books')
//     if (stored) {
//       try {
//         return JSON.parse(stored)
//       } catch {
//         return [...mockBooks]
//       }
//     }
    
//     // Primeira vez - salvar dados mockados
//     localStorage.setItem('mock-books', JSON.stringify(mockBooks))
//     return [...mockBooks]
//   }

//   private saveBooks(books: Book[]): void {
//     localStorage.setItem('mock-books', JSON.stringify(books))
//   }

//   async getBooks(filters: any = {}): Promise<PaginatedResponse<Book>> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     let books = this.getStoredBooks()

//     // Aplicar filtros
//     if (filters.title) {
//       books = books.filter(book => 
//         book.title.toLowerCase().includes(filters.title.toLowerCase())
//       )
//     }

//     if (filters.author) {
//       books = books.filter(book => 
//         book.author.toLowerCase().includes(filters.author.toLowerCase())
//       )
//     }

//     if (filters.category) {
//       books = books.filter(book => book.category === filters.category)
//     }

//     if (filters.available !== undefined) {
//       books = books.filter(book => book.available === filters.available)
//     }

//     // Paginação
//     const page = filters.page || 1
//     const limit = filters.limit || 10
//     const startIndex = (page - 1) * limit
//     const endIndex = startIndex + limit

//     const paginatedBooks = books.slice(startIndex, endIndex)

//     return {
//       data: paginatedBooks,
//       pagination: {
//         page,
//         limit,
//         total: books.length,
//         totalPages: Math.ceil(books.length / limit)
//       }
//     }
//   }

//   async getBookById(id: number): Promise<Book> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     const books = this.getStoredBooks()
//     const book = books.find(b => b.id === id)
    
//     if (!book) {
//       throw new Error('Livro não encontrado')
//     }

//     return book
//   }

//   async createBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     const books = this.getStoredBooks()
    
//     // Verificar se ISBN já existe
//     const existingBook = books.find(b => b.isbn === bookData.isbn)
//     if (existingBook) {
//       throw new Error('Livro com este ISBN já existe')
//     }

//     const newBook: Book = {
//       ...bookData,
//       id: Math.max(...books.map(b => b.id)) + 1,
//       available: bookData.available ?? true,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }

//     books.push(newBook)
//     this.saveBooks(books)

//     return newBook
//   }

//   async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     const books = this.getStoredBooks()
//     const index = books.findIndex(b => b.id === id)
    
//     if (index === -1) {
//       throw new Error('Livro não encontrado')
//     }

//     // Verificar ISBN duplicado (se alterado)
//     if (bookData.isbn && bookData.isbn !== books[index].isbn) {
//       const existingBook = books.find(b => b.isbn === bookData.isbn && b.id !== id)
//       if (existingBook) {
//         throw new Error('Livro com este ISBN já existe')
//       }
//     }

//     const updatedBook: Book = {
//       ...books[index],
//       ...bookData,
//       id, // Garantir que o ID não seja alterado
//       updatedAt: new Date().toISOString()
//     }

//     books[index] = updatedBook
//     this.saveBooks(books)

//     return updatedBook
//   }

//   async deleteBook(id: number): Promise<void> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     const books = this.getStoredBooks()
//     const index = books.findIndex(b => b.id === id)
    
//     if (index === -1) {
//       throw new Error('Livro não encontrado')
//     }

//     books.splice(index, 1)
//     this.saveBooks(books)
//   }

//   async searchBooks(query: string): Promise<Book[]> {
//     // Sem delay para facilitar testes
//     simulateRandomError()

//     const books = this.getStoredBooks()
//     const searchQuery = query.toLowerCase()

//     return books.filter(book =>
//       book.title.toLowerCase().includes(searchQuery) ||
//       book.author.toLowerCase().includes(searchQuery) ||
//       book.isbn.includes(query) ||
//       (book.description && book.description.toLowerCase().includes(searchQuery)) ||
//       (book.category && book.category.toLowerCase().includes(searchQuery))
//     )
//   }
// }

// // Instâncias dos serviços mockados
// export const mockAuthService = new MockAuthService()
// export const mockBookService = new MockBookService()
