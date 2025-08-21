<template>
    <div class="user-header">
        <div class="user-info" v-if="currentUser">
            <span class="user-icon">👤</span>
            <span class="user-email">{{ currentUser.email }}</span>
        </div>
        <button @click="handleLogout" class="logout-btn" :disabled="isLoggingOut">
            <span class="btn-text">{{ isLoggingOut ? 'Saindo...' : 'Sair da Conta' }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()
const isLoggingOut = ref(false)

// Computed para obter o usuário atual
const currentUser = computed(() => {
    return authService.getCurrentUser()
})

const handleLogout = async () => {
    if (isLoggingOut.value) return

    isLoggingOut.value = true

    try {
        // Chama o logout do authService
        authService.logout()

        // Simula um pequeno delay para melhor UX
        await new Promise(resolve => setTimeout(resolve, 500))

        await router.push('/login')
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, limpa o token local e redireciona
        authService.logout()
        await router.push('/login')
    } finally {
        isLoggingOut.value = false
    }
}

// Verifica se o usuário está autenticado ao montar o componente
onMounted(() => {
    if (!authService.isAuthenticated()) {
        router.push('/login')
    }
})
</script>

<style scoped>
.user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;

    max-height: 35px;
}

.user-icon {
    font-size: 1.0rem;
}

.user-email {
    font-size: 0.875rem;
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: .5rem;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    min-width: 100px;

    max-height: 35px;

    justify-content: center;
}

.logout-btn:hover:not(:disabled) {
    background: rgba(220, 38, 38, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logout-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.btn-text {
    font-size: 0.875rem;
}

/* Responsividade */
@media (max-width: 768px) {
    .user-header {
        gap: 0.5rem;
    }

    .user-info {
        display: none;
        /* Esconde o email em telas pequenas */
    }

    .logout-btn {
        padding: 0.5rem;
        min-width: 80px;
    }

    .btn-text {
        display: none;
        /* Esconde o texto em telas muito pequenas */
    }
}

@media (max-width: 480px) {
    .logout-btn {
        min-width: 60px;
        padding: 0.5rem;
    }
}
</style>
