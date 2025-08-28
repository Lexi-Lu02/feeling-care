<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Feeling Care is Here to Help</h1>
          <p class="hero-description">
            Your trusted mental health companion for youth. We provide support, resources, and a
            safe space for young people to find help when they need it most.
          </p>
          <button class="btn btn-primary hero-btn">Signup now</button>
        </div>
      </div>
    </section>

    <!-- Three Column Data Section -->
    <section class="data-section">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="data-card">
              <div class="data-icon">📊</div>
              <div class="data-number">1,234</div>
              <p class="data-label">Youth Helped</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="data-card">
              <div class="data-icon">👥</div>
              <div class="data-number">567</div>
              <p class="data-label">Active Volunteers</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="data-card">
              <div class="data-icon">🏥</div>
              <div class="data-number">89</div>
              <p class="data-label">Partner Organizations</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Cards Section -->
    <section class="cards-section">
      <div class="container">
        <div class="row">
          <!-- Large Card -->
          <div class="col-lg-8">
            <div class="card large-card">
              <div class="card-body">
                <div class="card-icon">💙</div>
                <h3 class="card-title">Get Support Today</h3>
                <p class="card-text">
                  Connect with trained counselors and mental health professionals who understand
                  what you're going through.
                </p>
                <router-link to="/support" class="btn btn-primary">Services</router-link>
              </div>
            </div>
          </div>

          <!-- Small Cards -->
          <div class="col-lg-4">
            <div class="row">
              <div class="col-12 mb-3">
                <div class="card small-card">
                  <div class="card-body">
                    <div class="card-icon">📚</div>
                    <h4 class="card-title">Information & Resources</h4>
                    <router-link to="/resources" class="btn btn-primary">Learn More</router-link>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card mini-card">
                  <div class="card-body">
                    <div class="card-icon">🤝</div>
                    <h5 class="card-title">Get Involved</h5>
                    <router-link to="/involved" class="btn btn-primary">Join Us</router-link>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card mini-card">
                  <div class="card-body">
                    <div class="card-icon">ℹ️</div>
                    <h5 class="card-title">About Us</h5>
                    <router-link to="/about" class="btn btn-primary">Learn More</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Component logic can be added here
</script>
