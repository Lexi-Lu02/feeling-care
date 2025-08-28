<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-primary"
    style="position: relative; z-index: 1000"
  >
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Feeling Care</router-link>
      <div>
        <ul class="navbar-nav">
          <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
          <li class="nav-item">
            <router-link class="nav-link" to="/support">Get Support</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Information & Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/involved">Get Involved</router-link>
          </li>
          <li class="nav-item"><router-link class="nav-link" to="/about">About Us</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/search">Search</router-link></li>
          <li class="nav-item">
            <router-link class="nav-link" to="/auth">Login/Signup</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
