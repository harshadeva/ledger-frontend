import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import { isAuthenticated } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Projects/Index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/create',
      name: 'projects.create',
      component: () => import('@/views/Projects/Create.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/stakeholders',
      name: 'stakeholders',
      component: () => import('@/views/Stakeholders/Index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/stakeholders/create',
      name: 'stakeholders.create',
      component: () => import('@/views/Stakeholders/Create.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/Transactions/Index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions/create',
      name: 'transactions.create',
      component: () => import('@/views/Transactions/Create.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
