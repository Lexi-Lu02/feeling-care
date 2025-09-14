import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/HomePage.vue'
import GetSupport from './views/GetSupport.vue'
import GetInvolved from './views/GetInvolved.vue'
import AboutUs from './views/AboutUs.vue'
import LoginOrSignup from './views/LoginOrSignup.vue'
import InformationAndResources from './views/InformationAndResources.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import BlogPage from './views/BlogPage.vue'
import BlogPostDetail from './views/BlogPostDetail.vue'
import { requireAdmin } from './services/authService'
import { securityGuard } from './middleware/security'

const routes = [
  { path: '/', component: Home },
  { path: '/support', component: GetSupport },
  { path: '/involved', component: GetInvolved },
  { path: '/about', component: AboutUs },
  { path: '/resources', component: InformationAndResources },
  { path: '/auth', component: LoginOrSignup },
  { path: '/blogs', component: BlogPage },
  { path: '/blogs/:id', component: BlogPostDetail },
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: requireAdmin,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Apply security guard to all routes
router.beforeEach(securityGuard)

export default router
