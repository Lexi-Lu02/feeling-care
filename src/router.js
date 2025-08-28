import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/HomePage.vue'
import GetSupport from './views/GetSupport.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/services', component: GetSupport },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
