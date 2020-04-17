import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import HomeUsers from '@/components/home/HomeUsers.vue'
import Welcome from '@/components/Welcome.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
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
    redirect: '/welcome',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'users',
        component: HomeUsers
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'cate',
        component: Cate
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goodslist',
        component: (resolve: any) => (require(["@/components/goods/GoodsList.vue"], resolve))
      },
      {
        path: '/goods/add',
        name: 'addGoods',
        component: (resolve: any) => (require(["@/components/goods/AddGoods.vue"], resolve))
      },
      {
        path: '/orders',
        name: 'Order',
        component: (resolve: any) => (require(["@/components/order/Order.vue"], resolve))
      },
      {
        path: '/reports',
        name: 'Report',
        component: (resolve: any) => (require(['@/components/report/Report.vue'], resolve))
      }
    ],
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
