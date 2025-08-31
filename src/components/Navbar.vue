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
          <router-link class="nav-link login-link" to="/auth">Login/Signup</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
