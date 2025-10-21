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
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading blog posts...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-warning" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Unable to load blog posts. Please try again later.
        </div>

        <!-- Blogs Grid -->
        <div v-else-if="blogs.length > 0" class="row">
          <div class="col-12 col-sm-6 col-lg-4" v-for="(blog, index) in blogs" :key="index">
            <div class="content-card">
              <div class="card-image">
                <img
                  :src="
                    blog.image && (blog.image.startsWith('http') || blog.image.startsWith('data:'))
                      ? blog.image
                      : `/images/blog/${blog.image || '57.jpg'}`
                  "
                  :alt="blog.title"
                  class="blog-image"
                  @error="handleImageError"
                />
                <span v-if="!blog.image" class="fallback-icon">📝</span>
              </div>
              <div class="card-content">
                <h3>{{ blog.title }}</h3>
                <div class="blog-meta">
                  <small class="text-muted">
                    <i class="fas fa-user me-1"></i>{{ blog.author }}
                    <span v-if="blog.date" class="ms-2">
                      <i class="fas fa-calendar me-1"></i
                      >{{ new Date(blog.date).toLocaleDateString() }}
                    </span>
                  </small>
                </div>
                <router-link :to="`/blogs/${blog.id}`" class="btn btn-primary"
                  >See More</router-link
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
          <h4>No blog posts available</h4>
          <p class="text-muted">Check back later for new content!</p>
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
import { ref, onMounted, onUnmounted } from 'vue'
import {
  getAllPosts,
  initializePostsListener,
  cleanupPostsListener,
  handleImageError,
} from '../services/firestoreBlogService'

const blogs = ref([])
const isLoading = ref(true)
const error = ref(null)

// Load published posts from Firestore
const loadBlogs = async () => {
  try {
    isLoading.value = true
    const allPosts = await getAllPosts()
    console.log('All posts from Firestore:', allPosts)

    // Filter for published posts and limit to 3 most recent for display
    const publishedPosts = allPosts.filter((post) => post.status === 'published')
    console.log('Published posts:', publishedPosts)

    blogs.value = publishedPosts.slice(0, 3).map((post) => {
      console.log('Processing post:', post.title, 'Image:', post.image ? 'Has image' : 'No image')
      if (post.image) {
        console.log(
          'Image type:',
          post.image.startsWith('data:')
            ? 'base64'
            : post.image.startsWith('http')
              ? 'URL'
              : 'local path',
        )
      }
      return {
        id: post.id,
        title: post.title,
        description: post.excerpt,
        author: post.author,
        date: post.publishedAt,
        tags: post.tags,
        image: post.image,
      }
    })
    console.log('Final blogs array:', blogs.value)
  } catch (err) {
    console.error('Error loading blogs:', err)
    error.value = err.message
    // Fallback to empty array if there's an error
    blogs.value = []
  } finally {
    isLoading.value = false
  }
}

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

// Initialize posts listener and load data
onMounted(async () => {
  // Initialize real-time listener for posts
  initializePostsListener()

  // Load initial data
  await loadBlogs()
})

// Clean up listener when component unmounts
onUnmounted(() => {
  cleanupPostsListener()
})
</script>
