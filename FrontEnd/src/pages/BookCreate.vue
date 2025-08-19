<template>
  <div class="book-create-container">
    <header class="header">
      <div class="header-content">
        <h1>📚 Sistema de Biblioteca</h1>
        <router-link to="/books" class="back-btn">← Voltar</router-link>
      </div>
    </header>

    <main class="main-content">
      <div class="form-container">
        <h2>Adicionar Novo Livro</h2>
        
        <form @submit.prevent="createBook" class="book-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Título *</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title"
                :class="{ 'input-error': errors.title }"
                placeholder="Digite o título do livro"
                required
              >
              <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="author">Autor *</label>
              <input 
                type="text" 
                id="author" 
                v-model="form.author"
                :class="{ 'input-error': errors.author }"
                placeholder="Nome do autor"
                required
              >
              <span v-if="errors.author" class="error-text">{{ errors.author }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="year">Ano de Publicação *</label>
              <input 
                type="number" 
                id="year" 
                v-model="form.year"
                :class="{ 'input-error': errors.year }"
                placeholder="2023"
                min="1000"
                :max="currentYear"
                required
              >
              <span v-if="errors.year" class="error-text">{{ errors.year }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pages">Número de Páginas *</label>
              <input 
                type="number" 
                id="pages" 
                v-model="form.pages"
                :class="{ 'input-error': errors.pages }"
                placeholder="300"
                min="1"
                required
              >
              <span v-if="errors.pages" class="error-text">{{ errors.pages }}</span>
            </div>

          </div>

          <div class="form-actions">
            <router-link to="/books" class="cancel-btn">Cancelar</router-link>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="loading"></span>
              {{ isSubmitting ? 'Salvando...' : 'Salvar Livro' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { bookService } from '@/services/bookService'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

interface BookForm {
  title: string
  author: string
  year: number | null
  pages: number | null
}

const router = useRouter()

const form = reactive<BookForm>({
  title: '',
  author: '',
  year: null,
  pages: null,
})

const errors = reactive({
  title: '',
  author: '',
  year: '',
  pages: ''
})

const isSubmitting = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const validateForm = (): boolean => {
  // Limpar erros anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validar título
  if (!form.title.trim()) {
    errors.title = 'Título é obrigatório'
    isValid = false
  } else if (form.title.trim().length < 2) {
    errors.title = 'Título deve ter pelo menos 2 caracteres'
    isValid = false
  }

  // Validar autor
  if (!form.author.trim()) {
    errors.author = 'Autor é obrigatório'
    isValid = false
  } else if (form.author.trim().length < 2) {
    errors.author = 'Nome do autor deve ter pelo menos 2 caracteres'
    isValid = false
  }

  if (!form.year) {
    errors.year = 'Ano de publicação é obrigatório'
    isValid = false
  } else if (form.year < 1000 || form.year > currentYear.value) {
    errors.year = `Ano deve estar entre 1000 e ${currentYear.value}`
    isValid = false
  }

  // Validar páginas
  if (!form.pages) {
    errors.pages = 'Número de páginas é obrigatório'
    isValid = false
  } else if (form.pages < 1) {
    errors.pages = 'Número de páginas deve ser maior que 0'
    isValid = false
  }

  return isValid
}

const createBook = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Criar novo livro
    const newBook = {
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year!,
      pages: form.pages!,
      createdAt: new Date().toISOString()
    }

    await bookService.createBook(newBook)

    // Redirecionar para lista de livros com timestamp para forçar reload
    router.push(`/books?created=${Date.now()}`)
  } catch (error) {
    console.error('Erro ao criar livro:', error)
    alert('Erro ao salvar livro. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.book-create-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  background-color: #28a745;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.back-btn {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #5a6268;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-container h2 {
  color: #333;
  margin: 0 0 2rem 0;
  text-align: center;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.input-error {
  border-color: #dc3545 !important;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
