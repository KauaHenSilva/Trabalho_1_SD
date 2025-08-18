<template>
  <div class="user-header">
    <div class="user-info" v-if="currentUser">
      <div class="user-avatar">
        <span class="avatar-text">
          {{ getInitials(currentUser.name) }}
        </span>
      </div>
      <div class="user-details">
        <span class="user-name">{{ currentUser.name }}</span>
        <span class="user-role" :class="`role-${currentUser.role}`">
          <span class="role-icon">{{ getRoleIcon(currentUser.role) }}</span>
          {{ getRoleLabel(currentUser.role) }}
        </span>
      </div>
    </div>
    
    <div class="user-actions">
      <button 
        @click="handleLogout" 
        class="btn btn-outline-light btn-sm logout-btn"
        title="Fazer logout"
      >
        <span class="logout-icon">🚪</span>
        Sair
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services'
import type { User } from '../services/api'

const router = useRouter()
const currentUser = ref<User | null>(null)

onMounted(() => {
  currentUser.value = authService.getCurrentUser()
})

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRoleIcon = (role: string): string => {
  return role === 'admin' ? '👑' : '👤'
}

const getRoleLabel = (role: string): string => {
  return role === 'admin' ? 'Administrador' : 'Usuário'
}

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-sm);
  color: var(--color-white);
  backdrop-filter: blur(10px);
}

.avatar-text {
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.user-name {
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-white);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.user-role {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-admin {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: var(--color-gray-800);
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

.role-user {
  background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15));
  color: var(--color-white);
  border: 1px solid rgba(255,255,255,0.2);
}

.role-icon {
  font-size: var(--font-size-xs);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.logout-icon {
  font-size: var(--font-size-sm);
}

/* Responsividade */
@media (max-width: 600px) {
  .user-header {
    gap: var(--spacing-2);
  }
  
  .user-details {
    display: none;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: var(--font-size-xs);
  }
  
  .logout-btn {
    padding: var(--spacing-2);
  }
  
  .logout-btn span:not(.logout-icon) {
    display: none;
  }
}

@media (max-width: 480px) {
  .user-role {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .user-name {
    font-size: var(--font-size-sm);
  }
}
</style>
