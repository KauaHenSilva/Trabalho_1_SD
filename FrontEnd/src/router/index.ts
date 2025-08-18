import { createRouter, createWebHistory } from 'vue-router'
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
      redirect: '/login'
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
      component: BookList
    },
    {
      path: '/books/create',
      name: 'BookCreate',
      component: BookCreate
    },
    {
      path: '/books/:id',
      name: 'BookDetail',
      component: BookDetail,
      props: true
    },
    {
      path: '/books/:id/edit',
      name: 'BookEdit',
      component: BookEdit,
      props: true
    }
  ]
})

export default router
