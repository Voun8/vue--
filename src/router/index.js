import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 网页打开第一次默认路由路径是/
    redirect: '/home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      // user
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar.vue')
      }
      // ,
      // {
      //   path: 'user-pwd',
      //   component: () => import('@/views/user/userPwd.vue')
      // },
      // // art
      // {
      //   path: 'artCate',
      //   component: ()=> import('@/views/art/artCate.vue')
      // },
      // {
      //   path: 'artList',
      //   component: () => import('@/views/art/artList.vue')
      // }

    ]
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
const whiteList = ['/login', '/reg']
// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫函数
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 强制切换到登录路径
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
