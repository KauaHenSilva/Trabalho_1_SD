import { computed } from 'vue'
import { authService } from '../services/authService'
import type { User } from '../services/api'

export function usePermissions() {
  const currentUser = computed<User | null>(() => {
    return authService.getCurrentUser()
  })

  const isAuthenticated = computed(() => {
    return authService.isAuthenticated() && currentUser.value !== null
  })

  const isAdmin = computed(() => {
    return isAuthenticated.value // Considera admin qualquer usuário autenticado
  })

  const canCreate = computed(() => {
    return isAuthenticated.value // Apenas usuários autenticados podem criar
  })

  const canEdit = computed(() => {
    return isAuthenticated.value // Apenas usuários autenticados podem editar
  })

  const canDelete = computed(() => {
    return isAuthenticated.value // Apenas usuários autenticados podem deletar
  })

  const canView = computed(() => {
    return true // Todos podem visualizar (autenticados e não autenticados)
  })

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    canCreate,
    canEdit,
    canDelete,
    canView
  }
}
