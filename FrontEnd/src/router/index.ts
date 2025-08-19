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
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
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

router.beforeEach(async (to, from, next) => {
  const token_valido = await authService.validateToken()
  if (to.meta.requiresAuth && !token_valido) {
    console.log('Rota protegida. Redirecionando para o login...')
    next('/login')
  } else {
    next()
  }
})

export default router
