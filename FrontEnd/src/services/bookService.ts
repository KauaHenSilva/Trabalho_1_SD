import { apiClient } from './api'
import type { Book, PaginatedResponse } from './api'

export interface BookFilters {
  title?: string
  author?: string
  category?: string
  available?: boolean
  page?: number
  limit?: number
}

export class BookService {
  async getBooks(filters: BookFilters = {}): Promise<PaginatedResponse<Book>> {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value))
        }
      })

      const endpoint = `/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get<PaginatedResponse<Book>>(endpoint)
      return response
    } catch (error) {
      console.error('Failed to fetch books:', error)
      throw new Error('Falha ao carregar livros.')
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await apiClient.get<Book>(`/books/${id}`)
      return response
    } catch (error) {
      console.error('Failed to fetch book:', error)
      throw new Error('Falha ao carregar o livro.')
    }
  }

  async createBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    try {
      const response = await apiClient.post<Book>('/books', bookData)
      return response
    } catch (error) {
      console.error('Failed to create book:', error)
      throw new Error('Falha ao criar o livro.')
    }
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
    try {
      const response = await apiClient.put<Book>(`/books/${id}`, bookData)
      return response
    } catch (error) {
      console.error('Failed to update book:', error)
      throw new Error('Falha ao atualizar o livro.')
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      await apiClient.delete(`/books/${id}`)
    } catch (error) {
      console.error('Failed to delete book:', error)
      throw new Error('Falha ao excluir o livro.')
    }
  }

  async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await apiClient.get<Book[]>(`/books/search?q=${encodeURIComponent(query)}`)
      return response
    } catch (error) {
      console.error('Failed to search books:', error)
      throw new Error('Falha na busca de livros.')
    }
  }
}

export const bookService = new BookService()
