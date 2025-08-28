import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/HomePage.vue'
import GetSupport from './views/GetSupport.vue'
import LoginOrSignup from './views/LoginOrSignup.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/support', component: GetSupport },
  { path: '/auth', component: LoginOrSignup },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
