<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Define component name to fix linter error
defineOptions({
  name: 'NavigationBar',
})

const router = useRouter()
const auth = getAuth()
const currentUser = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})

function goToAuth() {
  router.push('/auth')
}

function goToDashboard() {
  if (!currentUser.value) return
  const email = currentUser.value.email?.toLowerCase() || ''
  if (email.includes('admin')) {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
}

const logout = () => {
  auth.signOut()
  currentUser.value = null
  window.location.reload()
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-primary"
    style="position: relative; z-index: 1000"
  >
    <div class="container-fluid">
      <!-- Logo -->
      <div class="logo-container">
        <router-link to="/" class="navbar-brand">
          <img src="/images/icon/mental-health.png" alt="Feeling Care Logo" class="logo-image" />
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
            <img src="/images/icon/loupe.png" alt="Search" class="search-icon" />
            <input type="text" class="search-input" placeholder="Search" />
          </div>
          <template v-if="currentUser">
            <div class="user-menu">
              <span class="user-info">{{ currentUser.displayName || currentUser.email }}</span>
              <router-link class="nav-link" to="/dashboard" active-class="active">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </router-link>
              <button @click="logout" class="btn btn-outline-danger btn-sm">Logout</button>
            </div>
          </template>
          <template v-else>
            <router-link class="nav-link" to="/auth" active-class="active"
              >Login / Sign Up</router-link
            >
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
