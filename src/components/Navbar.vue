<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { isAdmin } from '../services/authService'

// Define component name to fix linter error
defineOptions({
  name: 'NavigationBar',
})

const auth = getAuth()
const currentUser = ref(null)
const userIsAdmin = ref(false)

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      // Check if user is admin
      userIsAdmin.value = await isAdmin()
    } else {
      userIsAdmin.value = false
    }
  })
})

// Computed property to determine dashboard route
const dashboardRoute = computed(() => {
  return userIsAdmin.value ? '/admin' : '/dashboard'
})

const logout = () => {
  auth.signOut()
  currentUser.value = null
  userIsAdmin.value = false
  window.location.reload()
}
</script>

<template>
  <nav
    id="main-navigation"
    class="navbar navbar-expand-lg navbar-dark bg-primary"
    style="position: relative; z-index: 1000"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="container-fluid">
      <!-- Logo -->
      <div class="logo-container">
        <router-link to="/" class="navbar-brand" aria-label="Feeling Care - Go to homepage">
          <img
            src="/images/icon/mental-health.png"
            alt="Mental health support icon"
            class="logo-image"
          />
          <span class="logo-text">Feeling Care</span>
        </router-link>
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
            <label for="navbar-search" class="visually-hidden">Search the site</label>
            <img
              src="/images/icon/loupe.png"
              alt="Search magnifying glass icon"
              class="search-icon"
            />
            <input
              type="text"
              id="navbar-search"
              class="search-input"
              placeholder="Search"
              aria-label="Search the site"
            />
          </div>
          <template v-if="currentUser">
            <div class="user-menu">
              <span class="user-info">{{ currentUser.displayName || currentUser.email }}</span>
              <router-link
                class="nav-link"
                :to="dashboardRoute"
                active-class="active"
                aria-label="Go to dashboard"
              >
                <i class="fas fa-tachometer-alt me-1" aria-hidden="true"></i>
                Dashboard
              </router-link>
              <button
                @click="logout"
                class="btn btn-outline-danger btn-sm"
                aria-label="Logout from your account"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <router-link
              class="nav-link"
              to="/auth"
              active-class="active"
              aria-label="Login or sign up for an account"
              >Login / Sign Up</router-link
            >
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
