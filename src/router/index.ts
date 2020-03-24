import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'index',
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // ...
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token') || ''
  if (!token) return next('/login')
  next()
})
export default router
