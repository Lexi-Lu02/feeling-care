<template>
  <div id="app">
    <!-- Skip Links for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#main-navigation" class="skip-link">Skip to navigation</a>

    <Navbar />
    <main id="main-content" class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
