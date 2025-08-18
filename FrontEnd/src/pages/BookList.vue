<template>
  <div class="books-dashboard">
    <!-- Header Principal -->
    <header class="dashboard-header">
      <div class="header-container">
        <div class="header-left">
          <h1 class="dashboard-title">
            <span class="title-icon">📚</span>
            <span>Sistema de Biblioteca</span>
            <span v-if="dataMode" class="mode-indicator" :class="`mode-${dataMode}`">
              {{ dataMode.toUpperCase() }}
            </span>
          </h1>
        </div>
        <div class="header-right">
          <UserHeader />
        </div>
      </div>
    </header>

    <!-- Layout Principal Horizontal -->
    <div class="dashboard-layout">
      <!-- Sidebar de Controles -->
      <aside class="control-sidebar">
        <div class="sidebar-content">
          <!-- Ações Principais (Admin Only) -->
          <div v-if="canCreate" class="action-section">
            <h3 class="section-title">
              <span class="title-icon">⚡</span>
              Ações Rápidas
            </h3>
            <router-link to="/books/create" class="action-btn action-btn-primary">
              <span class="btn-icon">➕</span>
              <span class="btn-text">Adicionar Livro</span>
            </router-link>
          </div>

          <!-- Filtros e Busca -->
          <div class="filter-section">
            <h3 class="section-title">
              <span class="title-icon">🔍</span>
              Buscar & Filtrar
            </h3>
            
            <!-- Campo de Busca -->
            <div class="search-group">
              <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Buscar livros..."
                class="search-input"
                :disabled="isLoading"
              >
              <button 
                v-if="searchTerm" 
                @click="clearSearch"
                class="clear-btn"
                title="Limpar busca"
              >
                ✕
              </button>
            </div>

            <!-- Filtro por Categoria -->
            <div class="filter-group">
              <label class="filter-label">Categoria</label>
              <select v-model="categoryFilter" class="filter-select">
                <option value="">Todas</option>
                <option value="ficção">📚 Ficção</option>
                <option value="não-ficção">📖 Não-ficção</option>
                <option value="técnico">💻 Técnico</option>
                <option value="acadêmico">🎓 Acadêmico</option>
              </select>
            </div>

            <!-- Filtro por Disponibilidade -->
            <div class="filter-group">
              <label class="filter-label">Status</label>
              <select v-model="availabilityFilter" class="filter-select">
                <option value="">Todos</option>
                <option value="available">✅ Disponíveis</option>
                <option value="unavailable">❌ Indisponíveis</option>
              </select>
            </div>

            <!-- Botão Limpar Filtros -->
            <button 
              v-if="hasActiveFilters" 
              @click="clearAllFilters"
              class="clear-filters-btn"
            >
              🧹 Limpar Filtros
            </button>
          </div>

          <!-- Estatísticas -->
          <div class="stats-section">
            <h3 class="section-title">
              <span class="title-icon">📊</span>
              Estatísticas
            </h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">{{ books.length }}</span>
                <span class="stat-label">Total</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ availableBooks }}</span>
                <span class="stat-label">Disponíveis</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ filteredBooks.length }}</span>
                <span class="stat-label">Exibindo</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Área Principal de Conteúdo -->
      <main class="content-area">
        <!-- Barra de Status -->
        <div class="status-bar">
          <div class="status-left">
            <span class="results-count">
              {{ filteredBooks.length }} de {{ books.length }} livros
            </span>
          </div>
          <div class="status-right">
            <div class="view-controls">
              <button 
                @click="viewMode = 'table'" 
                :class="['view-btn', { active: viewMode === 'table' }]"
                title="Visualização em tabela"
              >
                📋
              </button>
              <button 
                @click="viewMode = 'cards'" 
                :class="['view-btn', { active: viewMode === 'cards' }]"
                title="Visualização em cards"
              >
                🗃️
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando livros...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Erro ao carregar dados</h3>
          <p>{{ error }}</p>
          <button @click="loadBooks" class="retry-btn">
            Tentar Novamente
          </button>
        </div>

        <!-- Conteúdo Principal -->
        <div v-else class="main-content">
          <!-- Visualização em Tabela -->
          <div v-if="viewMode === 'table'" class="table-view">
            <div class="table-container">
              <table class="books-table">
                <thead>
                  <tr>
                    <th>Capa</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoria</th>
                    <th>Ano</th>
                    <th>Status</th>
                    <th v-if="canEdit || canDelete">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in filteredBooks" :key="book.id" class="book-row">
                    <td class="cover-cell">
                      <div class="book-cover-mini">
                        📖
                      </div>
                    </td>
                    <td class="title-cell">
                      <div class="book-title-info">
                        <h4 class="book-title">{{ book.title }}</h4>
                        <span class="book-isbn">ISBN: {{ book.isbn }}</span>
                      </div>
                    </td>
                    <td class="author-cell">{{ book.author }}</td>
                    <td class="category-cell">
                      <span v-if="book.category" class="category-badge">
                        {{ book.category }}
                      </span>
                    </td>
                    <td class="year-cell">{{ book.year }}</td>
                    <td class="status-cell">
                      <span :class="['status-badge', book.available !== false ? 'available' : 'unavailable']">
                        {{ book.available !== false ? '✅ Disponível' : '❌ Indisponível' }}
                      </span>
                    </td>
                    <td v-if="canEdit || canDelete" class="actions-cell">
                      <div class="action-buttons">
                        <router-link 
                          :to="`/books/${book.id}`"
                          class="action-btn-sm view-btn"
                          title="Ver detalhes"
                        >
                          👁️
                        </router-link>
                        <router-link 
                          v-if="canEdit"
                          :to="`/books/${book.id}/edit`"
                          class="action-btn-sm edit-btn"
                          title="Editar"
                        >
                          ✏️
                        </router-link>
                        <button 
                          v-if="canDelete"
                          @click="confirmDelete(book)"
                          class="action-btn-sm delete-btn"
                          title="Excluir"
                          :disabled="isDeleting === book.id"
                        >
                          <span v-if="isDeleting === book.id">⏳</span>
                          <span v-else>🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Visualização em Cards -->
          <div v-else class="cards-view">
            <div class="cards-grid">
              <div v-for="book in filteredBooks" :key="book.id" class="book-card-horizontal">
                <div class="card-cover">
                  <span class="cover-icon">📖</span>
                  <div v-if="book.available === false" class="unavailable-overlay">
                    Indisponível
                  </div>
                </div>
                
                <div class="card-content">
                  <div class="card-main">
                    <h3 class="card-title">{{ book.title }}</h3>
                    <p class="card-author">por {{ book.author }}</p>
                    <div class="card-details">
                      <span v-if="book.year" class="detail-item">📅 {{ book.year }}</span>
                      <span v-if="book.pages" class="detail-item">📄 {{ book.pages }}p</span>
                      <span v-if="book.category" class="detail-item category-tag">
                        {{ book.category }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="card-actions">
                    <router-link 
                      :to="`/books/${book.id}`"
                      class="card-btn card-btn-view"
                    >
                      Ver Detalhes
                    </router-link>
                    <router-link 
                      v-if="canEdit"
                      :to="`/books/${book.id}/edit`"
                      class="card-btn card-btn-edit"
                    >
                      Editar
                    </router-link>
                    <button 
                      v-if="canDelete"
                      @click="confirmDelete(book)"
                      class="card-btn card-btn-delete"
                      :disabled="isDeleting === book.id"
                    >
                      <span v-if="isDeleting === book.id">Excluindo...</span>
                      <span v-else>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado Vazio -->
          <div v-if="filteredBooks.length === 0 && !isLoading" class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>{{ searchTerm || categoryFilter || availabilityFilter ? 'Nenhum livro encontrado' : 'Biblioteca vazia' }}</h3>
            <p>
              {{ searchTerm || categoryFilter || availabilityFilter 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece adicionando livros à biblioteca.' 
              }}
            </p>
            <router-link 
              v-if="canCreate && !searchTerm && !categoryFilter && !availabilityFilter" 
              to="/books/create" 
              class="empty-action-btn"
            >
              ➕ Adicionar Primeiro Livro
            </router-link>
            <button 
              v-else-if="searchTerm || categoryFilter || availabilityFilter" 
              @click="clearAllFilters" 
              class="empty-action-btn"
            >
              🧹 Limpar Filtros
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⚠️ Confirmar Exclusão</h3>
          <button @click="cancelDelete" class="modal-close-btn">✕</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir o livro:</p>
          <div class="book-preview">
            <strong>"{{ bookToDelete?.title }}"</strong>
            <span>por {{ bookToDelete?.author }}</span>
          </div>
          <p class="warning-text">⚠️ Esta ação não pode ser desfeita.</p>
        </div>
        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-btn modal-btn-cancel">
            Cancelar
          </button>
          <button @click="deleteBook" class="modal-btn modal-btn-danger" :disabled="!!isDeleting">
            <span v-if="isDeleting">Excluindo...</span>
            <span v-else">🗑️ Excluir</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookService } from '../services'
import type { Book } from '../services/api'
import { getCurrentDataMode } from '../services'
import UserHeader from '../components/UserHeader.vue'
import { usePermissions } from '../composables/usePermissions'

const router = useRouter()
const { canCreate, canEdit, canDelete, isAdmin } = usePermissions()

// Estado reativo
const books = ref<Book[]>([])
const searchTerm = ref('')
const categoryFilter = ref('')
const availabilityFilter = ref('')
const showDeleteModal = ref(false)
const bookToDelete = ref<Book | null>(null)
const isLoading = ref(false)
const isDeleting = ref<number | null>(null)
const error = ref('')
const dataMode = ref('')
const viewMode = ref<'table' | 'cards'>('table')

// Computed
const hasActiveFilters = computed(() => {
  return !!(searchTerm.value || categoryFilter.value || availabilityFilter.value)
})

const availableBooks = computed(() => {
  return books.value.filter(book => book.available !== false).length
})

const filteredBooks = computed(() => {
  let filtered = books.value

  // Filtro por busca
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.isbn.includes(search) ||
      (book.category && book.category.toLowerCase().includes(search))
    )
  }

  // Filtro por categoria
  if (categoryFilter.value) {
    filtered = filtered.filter(book => book.category === categoryFilter.value)
  }

  // Filtro por disponibilidade
  if (availabilityFilter.value) {
    filtered = filtered.filter(book => {
      if (availabilityFilter.value === 'available') {
        return book.available !== false
      } else if (availabilityFilter.value === 'unavailable') {
        return book.available === false
      }
      return true
    })
  }

  return filtered
})

// Métodos
const loadBooks = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await bookService.getBooks()
    books.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar livros'
    console.error('Failed to load books:', err)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (book: Book) => {
  if (!canDelete.value) {
    alert('Você não tem permissão para excluir livros.')
    return
  }
  bookToDelete.value = book
  showDeleteModal.value = true
}

const deleteBook = async () => {
  if (!bookToDelete.value || !canDelete.value) return
  
  isDeleting.value = bookToDelete.value.id
  
  try {
    await bookService.deleteBook(bookToDelete.value.id)
    books.value = books.value.filter(b => b.id !== bookToDelete.value?.id)
    cancelDelete()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao excluir livro'
    console.error('Failed to delete book:', err)
  } finally {
    isDeleting.value = null
  }
}

const cancelDelete = () => {
  bookToDelete.value = null
  showDeleteModal.value = false
}

const clearSearch = () => {
  searchTerm.value = ''
}

const clearAllFilters = () => {
  searchTerm.value = ''
  categoryFilter.value = ''
  availabilityFilter.value = ''
}

// Lifecycle
onMounted(() => {
  dataMode.value = getCurrentDataMode()
  loadBooks()
})
</script>

<style scoped>
.books-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
}

/* Header */
.dashboard-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.title-icon {
  font-size: 2rem;
}

.mode-indicator {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  margin-left: 1rem;
}

.mode-mock {
  background-color: #fbbf24;
  color: #1f2937;
}

.mode-api {
  background-color: #10b981;
  color: white;
}

/* Layout Principal */
.dashboard-layout {
  display: flex;
  flex: 1;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

/* Sidebar */
.control-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 80px);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #374151;
}

/* Ações */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  width: 100%;
}

.action-btn-primary {
  background: #3b82f6;
  color: white;
}

.action-btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.125rem;
}

/* Filtros */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-group {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background: #dc2626;
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

/* Área de Conteúdo */
.content-area {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.results-count {
  font-weight: 600;
  color: #374151;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  border-color: #3b82f6;
}

.view-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Estados */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-top: 1rem;
}

/* Visualização em Tabela */
.table-container {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
}

.books-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.book-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.book-row:hover {
  background: #f9fafb;
}

.books-table td {
  padding: 1rem;
  vertical-align: middle;
}

.book-cover-mini {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.book-title-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.book-isbn {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.available {
  background: #dcfce7;
  color: #166534;
}

.status-badge.unavailable {
  background: #fecaca;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn-sm {
  padding: 0.375rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.view-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn {
  background: #fef3c7;
  color: #92400e;
}

.delete-btn {
  background: #fecaca;
  color: #991b1b;
}

.action-btn-sm:hover {
  transform: scale(1.1);
}

/* Visualização em Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
}

.book-card-horizontal {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  overflow: hidden;
  transition: all 0.2s;
}

.book-card-horizontal:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-cover {
  width: 120px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-icon {
  font-size: 2.5rem;
  color: white;
}

.unavailable-overlay {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.card-author {
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.card-btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.card-btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.card-btn-delete {
  background: #fecaca;
  color: #991b1b;
}

.card-btn:hover {
  transform: translateY(-1px);
}

/* Estado Vazio */
.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-action-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  display: inline-block;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  margin: 0 1rem;
}

.modal-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 1.5rem;
}

.book-preview {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.warning-text {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
}

.modal-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.modal-btn-cancel:hover {
  background: #e5e7eb;
}

.modal-btn-danger {
  background: #ef4444;
  color: white;
}

.modal-btn-danger:hover {
  background: #dc2626;
}

/* Responsividade */
@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .control-sidebar {
    width: 100%;
    height: auto;
    padding: 1rem;
  }
  
  .sidebar-content {
    flex-direction: row;
    gap: 1rem;
    overflow-x: auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    min-width: 200px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .books-table {
    font-size: 0.875rem;
  }
  
  .books-table th,
  .books-table td {
    padding: 0.75rem;
  }
}
</style>