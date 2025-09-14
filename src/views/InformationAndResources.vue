<template>
  <div class="resources-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <h1 class="hero-title">Information & Resources</h1>
            <p class="hero-description">
              Discover valuable mental health resources, educational content, and support materials
              to help you on your journey to better mental wellbeing.
            </p>
          </div>
          <div class="col-12 col-lg-4">
            <div class="hero-icon">
              <img src="/images/icon/resource.png" alt="Resources" class="hero-resource-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blogs Section -->
    <section class="content-section">
      <div class="container">
        <div class="section-header">
          <div class="section-title-with-icon">
            <img src="/images/icon/blogging.png" alt="Blogging" class="section-title-icon" />
            <h2>Blogs</h2>
          </div>
          <router-link to="/blogs" class="btn btn-outline-primary">See All →</router-link>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-4" v-for="(blog, index) in blogs" :key="index">
            <div class="content-card">
              <div class="card-image-placeholder">
                <span>📝</span>
              </div>
              <div class="card-content">
                <h3>{{ blog.title }}</h3>
                <p>{{ blog.description }}</p>
                <router-link :to="`/blogs/${blog.id}`" class="btn btn-primary"
                  >See More</router-link
                >
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
          <div class="section-title-with-icon">
            <img src="/images/icon/multimedia.png" alt="Multimedia" class="section-title-icon" />
            <h2>Podcasts</h2>
          </div>
          <button class="btn btn-outline-primary">See All →</button>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-4" v-for="(podcast, index) in podcasts" :key="index">
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
          <div class="section-title-with-icon">
            <img src="/images/icon/video.png" alt="Video" class="section-title-icon" />
            <h2>Videos</h2>
          </div>
          <button class="btn btn-outline-primary">See All →</button>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-4" v-for="(video, index) in videos" :key="index">
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
    id: 1,
    title: 'Understanding Anxiety in Youth',
    description:
      'Learn about the signs, symptoms, and effective coping strategies for managing anxiety in young people.',
  },
  {
    id: 2,
    title: 'Building Resilience Through Adversity',
    description:
      "Discover practical techniques to develop mental resilience and overcome life's challenges.",
  },
  {
    id: 3,
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
