import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout')
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    store.dispatch('getUserInfoActions')
  }
  next()
})
export default router
