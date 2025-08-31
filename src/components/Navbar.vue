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

      <!-- Navigation Links -->
      <div class="navbar-nav me-auto">
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/support">Get Support</router-link>
        <router-link class="nav-link" to="/resources">Information & Resources</router-link>
        <router-link class="nav-link" to="/involved">Get Involved</router-link>
        <router-link class="nav-link" to="/about">About Us</router-link>
      </div>

      <!-- Search Bar and Login -->
      <div class="navbar-right">
        <div class="search-container">
          <i class="search-icon">🔍</i>
          <input type="text" class="search-input" placeholder="Search" />
        </div>
        <router-link class="nav-link login-link" to="/auth">Login/Signup</router-link>
      </div>
    </div>
  </nav>
</template>
