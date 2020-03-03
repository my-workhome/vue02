import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/Login' },
    { path: '/Login', component: Login },
    { path: '/home', component: Home }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页直接放行。登录页没有权限要求
  if (to.path === '/login') return next()
  // 访问的不是登录页。获取sessionStorage中的token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
