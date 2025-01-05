import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Projects/Index.vue'),
    },
    {
      path: '/projects/create',
      name: 'projects.create',
      component: () => import('@/views/Projects/Create.vue'),
    },
    {
      path: '/stakeholders',
      name: 'stakeholders',
      component: () => import('@/views/Stakeholders/Index.vue'),
    },
    {
      path: '/stakeholders/create',
      name: 'stakeholders.create',
      component: () => import('@/views/Stakeholders/Create.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/Transactions/Index.vue'),
    },
    {
      path: '/transactions/create',
      name: 'transactions.create',
      component: () => import('@/views/Transactions/Create.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
    },
  ],
})

export default router
