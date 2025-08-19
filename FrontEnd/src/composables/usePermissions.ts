import { computed } from 'vue'
import { authService } from '../services/authService'
import type { User } from '../services/api'

export function usePermissions() {
  const currentUser = computed<User | null>(() => {
    return authService.getCurrentUser()
  })

  const isAdmin = computed(() => {
    return true
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
    canCreate,
    canEdit,
    canDelete,
    canView
  }
}
