<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <div class="hero-content">
              <h1 id="hero-title" class="hero-title">Feeling Care is Here to Help</h1>
              <p class="hero-description">
                Your trusted mental health companion for youth. We provide support, resources, and a
                safe space for young people to find help when they need it most.
              </p>
              <router-link
                to="/auth"
                class="btn btn-primary hero-btn"
                aria-label="Login or sign up for an account"
                >Login/Sign up</router-link
              >
            </div>
          </div>
          <div class="col-lg-5">
            <div class="hero-icon">
              <img
                src="/images/icon/mental-health.png"
                alt="Mental health support icon showing a heart and brain"
                class="hero-icon-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Three Column Data Section -->
    <section class="data-section" aria-labelledby="data-section-title">
      <div class="container">
        <h2 id="data-section-title" class="visually-hidden">Our Impact Statistics</h2>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="data-card">
              <div class="data-icon">
                <img
                  src="/images/icon/analytics.png"
                  alt="Analytics chart icon"
                  class="data-icon-image"
                />
              </div>
              <div class="data-number" aria-label="One thousand two hundred thirty four">1,234</div>
              <p class="data-label">Youth Helped</p>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="data-card">
              <div class="data-icon">
                <img
                  src="/images/icon/group.png"
                  alt="Group of people icon"
                  class="data-icon-image"
                />
              </div>
              <div class="data-number" aria-label="Five hundred sixty seven">567</div>
              <p class="data-label">Active Volunteers</p>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-4">
            <div class="data-card">
              <div class="data-icon">
                <img
                  src="/images/icon/hospital.png"
                  alt="Hospital building icon"
                  class="data-icon-image"
                />
              </div>
              <div class="data-number" aria-label="Eighty nine">89</div>
              <p class="data-label">Partner Organizations</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Cards Section -->
    <section class="cards-section" aria-labelledby="cards-section-title">
      <div class="container">
        <h2 id="cards-section-title" class="visually-hidden">Available Services and Resources</h2>
        <div class="row">
          <!-- Large Card -->
          <div class="col-12 col-lg-6">
            <div class="card large-card">
              <div class="card-body">
                <div class="card-icon">
                  <img
                    src="/images/icon/support.png"
                    alt="Support hands icon"
                    class="card-icon-image large-icon"
                  />
                </div>
                <h3 class="card-title">Get Support Today</h3>
                <p class="card-text">
                  Connect with trained counselors and mental health professionals who understand
                  what you're going through.
                </p>
                <router-link
                  to="/support"
                  class="btn btn-primary"
                  aria-label="View support services"
                  >Services</router-link
                >
              </div>
            </div>
          </div>

          <!-- Small Cards -->
          <div class="col-12 col-lg-6">
            <div class="right-column-wrapper">
              <div class="info-resources-wrapper">
                <div class="card small-card info-resources-card">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-8">
                        <h4 class="card-title">Information & Resources</h4>
                        <router-link
                          to="/resources"
                          class="btn btn-primary"
                          aria-label="Learn more about information and resources"
                          >Learn More</router-link
                        >
                      </div>
                      <div class="col-4">
                        <div class="card-icon info-resources-icon">
                          <img
                            src="/images/icon/resource.png"
                            alt="Information resources icon"
                            class="card-icon-image info-resources-icon-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="middle-spacer"></div>
              <div class="bottom-cards-wrapper">
                <div class="row">
                  <div class="col-6">
                    <div class="card mini-card">
                      <div class="card-body">
                        <div class="card-icon">
                          <img
                            src="/images/icon/handshake.png"
                            alt="Handshake icon"
                            class="card-icon-image"
                          />
                        </div>
                        <h5 class="card-title">Get Involved</h5>
                        <router-link
                          to="/involved"
                          class="btn btn-primary"
                          aria-label="Join us and get involved"
                          >Join Us</router-link
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="card mini-card">
                      <div class="card-body">
                        <div class="card-icon">
                          <img
                            src="/images/icon/information.png"
                            alt="Information icon"
                            class="card-icon-image"
                          />
                        </div>
                        <h5 class="card-title">About Us</h5>
                        <router-link
                          to="/about"
                          class="btn btn-primary"
                          aria-label="Learn more about us"
                          >Learn More</router-link
                        >
                      </div>
                    </div>
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
