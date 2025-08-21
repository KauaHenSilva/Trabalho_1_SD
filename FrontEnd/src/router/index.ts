// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'
import Login from '../pages/login.vue'
import Cadastro from '../pages/cadastro.vue'
import BookList from '../pages/BookList.vue'
import BookCreate from '../pages/BookCreate.vue'
import BookEdit from '../pages/BookEdit.vue'
import BookDetail from '../pages/BookDetail.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/books'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro
    },
    {
      path: '/books',
      name: 'BookList',
      component: BookList,
      meta: { requiresAuth: false }
    },
    {
      path: '/books/create',
      name: 'BookCreate',
      component: BookCreate,
      meta: { requiresAuth: true }
    },
    {
      path: '/books/:id',
      name: 'BookDetail',
      component: BookDetail,
      props: true,
      meta: { requiresAuth: false }
    },
    {
      path: '/books/:id/edit',
      name: 'BookEdit',
      component: BookEdit,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
})

// ...existing code...
router.beforeEach(async (to, from, next) => {
  console.log('[ROUTER GUARD] to:', to.fullPath, 'meta.requiresAuth:', to.meta?.requiresAuth)
  if (to.meta && to.meta.requiresAuth) {
    try {
      const authenticated = authService.isAuthenticated() || await authService.validateToken().catch(() => false)
      console.log('[ROUTER GUARD] authenticated:', authenticated)
      if (!authenticated) {
        return next({ path: '/login', query: { redirect: to.fullPath } })
      }
    } catch (err) {
      console.error('[ROUTER GUARD] error validating token:', err)
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
  next()
})
// ...existing code...

export default router
