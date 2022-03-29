import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes

})
//  挂载路由导航守卫
router.beforeEach((to, from, next) => {
//  to将要访问的路径
//  from代表冲哪个路径跳转而来
//  next()放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
