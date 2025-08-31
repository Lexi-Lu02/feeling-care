<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-primary"
    style="position: relative; z-index: 1000"
  >
    <div class="container-fluid">
      <!-- Logo Placeholder -->
      <div class="logo-placeholder">
        <span>Logo</span>
      </div>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/support">Get Support</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Information & Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/involved">Get Involved</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About Us</router-link>
          </li>
        </ul>

        <!-- Search Bar and Login -->
        <div class="navbar-right">
          <div class="search-container">
            <i class="search-icon">🔍</i>
            <input type="text" class="search-input" placeholder="Search" />
          </div>
          <template v-if="currentUser">
            <div class="user-menu">
              <span class="user-info">{{ currentUser.username }} ({{ currentUser.role }})</span>
              <router-link
                v-if="currentUser.role === 'admin'"
                class="nav-link admin-link"
                to="/admin"
                >Admin Dashboard</router-link
              >
              <button @click="logout" class="btn btn-outline-danger btn-sm">Logout</button>
            </div>
          </template>
          <template v-else>
            <router-link class="nav-link login-link" to="/auth">Login/Signup</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, logout as authLogout } from '../services/authService'

// Define component name to fix linter error
defineOptions({
  name: 'NavigationBar',
})

const currentUser = ref(null)

const logout = () => {
  authLogout()
  currentUser.value = null
  window.location.reload()
}

onMounted(() => {
  currentUser.value = getCurrentUser()
})
</script>
