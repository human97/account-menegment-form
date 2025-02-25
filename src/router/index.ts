import { createRouter, createWebHistory } from 'vue-router'
import AccountFormView from '@/views/AccountFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AccountFormView,
    },
  ],
})

export default router
