import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Dell',
    name: 'Dell',
    component: () => import('../views/Dell')
  },
  {
    path: '/DB',
    name: 'DB',
    component: () => import('../views/DB')
  },
  {
    path: '/ActiveXObject',
    name: 'ActiveXObject',
    component: () => import('../views/ActiveXObject')
  }
]

const router = new VueRouter({
  routes
})

export default router
