<template>
  <div class="resources-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title">Information & Resources</h1>
            <p class="hero-description">
              Discover valuable mental health resources, educational content, and support materials
              to help you on your journey to better mental wellbeing.
            </p>
            <div class="hero-buttons">
              <router-link to="/auth" class="btn btn-primary me-3">Login</router-link>
              <router-link to="/auth" class="btn btn-primary">Signup</router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-content-placeholder">
              <p>
                Access comprehensive mental health information, expert insights, and practical tools
                designed to support your mental wellbeing journey. Our curated collection of
                resources includes articles, podcasts, videos, and interactive content to help you
                understand, manage, and improve your mental health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blogs Section -->
    <section class="content-section">
      <div class="container">
        <div class="section-header">
          <h2>Blogs</h2>
          <button class="btn btn-outline-primary">See All →</button>
        </div>
        <div class="row">
          <div class="col-md-4" v-for="(blog, index) in blogs" :key="index">
            <div class="content-card">
              <div class="card-image-placeholder">
                <span>📝</span>
              </div>
              <div class="card-content">
                <h3>{{ blog.title }}</h3>
                <p>{{ blog.description }}</p>
                <button class="btn btn-primary">See More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Podcasts Section -->
    <section class="content-section">
      <div class="container">
        <div class="section-header">
          <h2>Podcasts</h2>
          <button class="btn btn-outline-primary">See All →</button>
        </div>
        <div class="row">
          <div class="col-md-4" v-for="(podcast, index) in podcasts" :key="index">
            <div class="content-card">
              <div class="card-image-placeholder">
                <span>🎧</span>
              </div>
              <div class="card-content">
                <h3>{{ podcast.title }}</h3>
                <p>{{ podcast.description }}</p>
                <button class="btn btn-primary">See More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Videos Section -->
    <section class="content-section">
      <div class="container">
        <div class="section-header">
          <h2>Videos</h2>
          <button class="btn btn-outline-primary">See All →</button>
        </div>
        <div class="row">
          <div class="col-md-4" v-for="(video, index) in videos" :key="index">
            <div class="content-card">
              <div class="card-image-placeholder">
                <span>🎥</span>
              </div>
              <div class="card-content">
                <h3>{{ video.title }}</h3>
                <p>{{ video.description }}</p>
                <button class="btn btn-primary">See More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const blogs = ref([
  {
    title: 'Understanding Anxiety in Youth',
    description:
      'Learn about the signs, symptoms, and effective coping strategies for managing anxiety in young people.',
  },
  {
    title: 'Building Resilience Through Adversity',
    description:
      "Discover practical techniques to develop mental resilience and overcome life's challenges.",
  },
  {
    title: 'Digital Wellbeing in the Modern Age',
    description:
      'Explore the impact of technology on mental health and strategies for maintaining digital balance.',
  },
])

const podcasts = ref([
  {
    title: 'Mindful Moments: Daily Meditation',
    description: 'Short, guided meditation sessions designed specifically for busy young people.',
  },
  {
    title: 'Teen Talk: Mental Health Conversations',
    description:
      'Open discussions about mental health topics relevant to teenagers and young adults.',
  },
  {
    title: 'Parenting Through Mental Health Challenges',
    description:
      'Support and guidance for parents helping their children navigate mental health issues.',
  },
])

const videos = ref([
  {
    title: 'Breathing Techniques for Stress Relief',
    description:
      'Step-by-step guide to breathing exercises that can help reduce stress and anxiety.',
  },
  {
    title: 'Creating a Healthy Sleep Routine',
    description:
      'Practical tips for establishing better sleep habits and improving overall wellbeing.',
  },
  {
    title: 'Building Healthy Relationships',
    description:
      'Guidance on developing and maintaining positive relationships with family and friends.',
  },
])
</script>
