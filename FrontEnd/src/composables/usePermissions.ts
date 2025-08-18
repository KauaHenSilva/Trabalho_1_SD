import { computed } from 'vue'
import { authService } from '../services'
import type { User } from '../services/api'

export function usePermissions() {
  const currentUser = computed<User | null>(() => {
    return authService.getCurrentUser()
  })

  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin'
  })

  const isUser = computed(() => {
    return currentUser.value?.role === 'user'
  })

  const canCreate = computed(() => {
    return isAdmin.value // Apenas admins podem criar
  })

  const canEdit = computed(() => {
    return isAdmin.value // Apenas admins podem editar
  })

  const canDelete = computed(() => {
    return isAdmin.value // Apenas admins podem deletar
  })

  const canView = computed(() => {
    return true // Todos podem visualizar
  })

  return {
    currentUser,
    isAdmin,
    isUser,
    canCreate,
    canEdit,
    canDelete,
    canView
  }
}
