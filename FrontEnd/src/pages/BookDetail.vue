<template>
    <div class="book-detail-container">
        <header class="header">
            <div class="header-content">
                <h1> <span class="title-icon"><img src="/favicon.svg" alt="Livro"
                            style="height:2em;vertical-align:middle;" /></span>
                    Sistema de Biblioteca</h1>
                <router-link to="/books" class="back-btn">← Voltar</router-link>
            </div>
        </header>

        <main class="main-content">
            <div v-if="book" class="book-detail">
                <div class="book-header">
                    <div class="book-cover">
                        <span class="book-icon">📖</span>
                    </div>
                    <div class="book-main-info">
                        <h1 class="book-title">{{ book.title }}</h1>
                        <p class="book-author">por {{ book.author }}</p>
                        <div class="book-meta">
                            <span class="meta-item">📅 {{ book.year }}</span>
                            <span class="meta-item">📄 {{ book.pages }} páginas</span>
                        </div>
                    </div>
                    <div class="book-actions">
                        <router-link v-if="canEdit" :to="`/books/${book.id}/edit`" class="action-btn edit-btn">
                            ✏️ Editar
                        </router-link>
                        <button v-if="canDelete" @click="confirmDelete" class="action-btn delete-btn">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>

                <div class="book-details">
                    <div class="detail-section">
                        <h3>Informações Bibliográficas</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Ano de Publicação:</label>
                                <span>{{ book.year }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Número de Páginas:</label>
                                <span>{{ book.pages }}</span>
                            </div>
                            <div v-if="book.createdAt" class="detail-item">
                                <label>Cadastrado em:</label>
                                <span>{{ formatDate(book.createdAt) }}</span>
                            </div>
                        </div>
                    </div>


                    <div class="detail-section">
                        <h3>Estatísticas</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <span class="stat-number">{{ book.pages }}</span>
                                <span class="stat-label">Páginas</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">{{ new Date().getFullYear() - book.year }}</span>
                                <span class="stat-label">Anos desde publicação</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">{{ book.title.length }}</span>
                                <span class="stat-label">Caracteres no título</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="not-found">
                <h2>📚 Livro não encontrado</h2>
                <p>O livro que você está procurando não existe ou foi removido.</p>
                <router-link to="/books" class="back-to-list">← Voltar para a lista</router-link>
            </div>

            <div v-else class="loading-container">
                <div class="loading-spinner"></div>
                <p>Carregando informações do livro...</p>
            </div>
        </main>

        <!-- Modal de confirmação de exclusão -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
            <div class="modal" @click.stop>
                <h3>Confirmar Exclusão</h3>
                <p>Tem certeza que deseja excluir o livro "{{ book?.title }}"?</p>
                <div class="modal-actions">
                    <button @click="cancelDelete" class="cancel-btn">Cancelar</button>
                    <button @click="deleteBook" class="confirm-delete-btn">Excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from '@/services/api'
import { bookService } from '@/services/bookService'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'

const router = useRouter()
const route = useRoute()
const { canEdit, canDelete } = usePermissions()

const book = ref<Book | null>(null)
const loading = ref(true)
const showDeleteModal = ref(false)

const loadBook = async () => {
    try {
        const response = await bookService.getBookById(Number(route.params.id))

        book.value = response
    } catch (error) {
        console.error('Erro ao carregar livro:', error)
        book.value = null
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}

const confirmDelete = () => {
    if (!canDelete.value) {
        alert('Você não tem permissão para excluir livros.')
        return
    }
    showDeleteModal.value = true
}

const deleteBook = async () => {
    if (!book.value || !canDelete.value) return

    try {
        await bookService.deleteBook(Number(route.params.id))
        router.push('/books')
    } catch (error) {
        console.error('Erro ao excluir livro:', error)
        alert('Erro ao excluir livro. Tente novamente.')
    }
}

const cancelDelete = () => {
    showDeleteModal.value = false
}

onMounted(() => {
    loadBook()
})
</script>

<style scoped>
.book-detail-container {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.header {
    background-color: #28a745;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

.book-detail {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.book-cover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 160px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-icon {
    font-size: 4rem;
    color: #6c757d;
}

.book-main-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.book-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
}

.book-author {
    font-size: 1.25rem;
    color: #666;
    font-style: italic;
    margin: 0 0 1rem 0;
}

.book-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.meta-item {
    background: #fff;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #666;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
    min-width: 120px;
    justify-content: center;
}

.edit-btn {
    background-color: #ffc107;
    color: #212529;
}

.edit-btn:hover {
    background-color: #e0a800;
    transform: translateY(-1px);
}

.delete-btn {
    background-color: #dc3545;
    color: white;
}

.delete-btn:hover {
    background-color: #c82333;
    transform: translateY(-1px);
}

.book-details {
    padding: 2rem;
}

.detail-section {
    margin-bottom: 2rem;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h3 {
    color: #333;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-item label {
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
}

.detail-item span {
    color: #333;
    font-size: 1rem;
}

.book-description {
    color: #666;
    line-height: 1.6;
    margin: 0;
    font-size: 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e9ecef;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #007bff;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.not-found {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
    color: #333;
    margin: 0 0 1rem 0;
}

.not-found p {
    color: #666;
    margin: 0 0 2rem 0;
}

.back-to-list {
    background-color: #007bff;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.3s;
}

.back-to-list:hover {
    background-color: #0056b3;
}

.loading-container {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e9ecef;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
}

.modal h3 {
    margin: 0 0 1rem 0;
    color: #333;
}

.modal p {
    margin: 0 0 1.5rem 0;
    color: #666;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.cancel-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #5a6268;
}

.confirm-delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-delete-btn:hover {
    background-color: #c82333;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .header-content {
        padding: 0 1rem;
    }

    .main-content {
        padding: 1rem;
    }

    .book-header {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 1rem;
    }

    .book-actions {
        flex-direction: row;
        justify-content: center;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
