import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/HomePage.vue'
import GetSupport from './views/GetSupport.vue'
import LoginOrSignup from './views/LoginOrSignup.vue'
import InformationAndResources from './views/InformationAndResources.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import BlogPage from './views/BlogPage.vue'
import { requireAdmin } from './services/authService'

const routes = [
  { path: '/', component: Home },
  { path: '/support', component: GetSupport },
  { path: '/resources', component: InformationAndResources },
  { path: '/auth', component: LoginOrSignup },
  { path: '/blogs', component: BlogPage },
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: requireAdmin,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
