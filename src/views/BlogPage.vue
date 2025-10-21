<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="blog-hero">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="blog-title">Mental Health Blog</h1>
            <div class="hero-buttons">
              <router-link to="/auth" class="btn btn-primary me-3">Login</router-link>
              <router-link to="/auth" class="btn btn-primary">Signup</router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-content">
              <p>
                Discover expert insights, practical tips, and personal stories to support your
                mental health journey. Our blog features articles written by mental health
                professionals, researchers, and individuals who have navigated their own mental
                health challenges. Find guidance, hope, and practical strategies for better mental
                wellbeing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Breadcrumbs -->
    <section class="breadcrumbs-section">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/resources">Information & Resources</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/resources">Blogs</router-link>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- Tag Filtering -->
    <section class="tags-section">
      <div class="container">
        <div class="tags-container">
          <button
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-btn"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
          <button class="tag-scroll-btn">
            <span>→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="blog-posts-section">
      <div class="container">
        <div class="blog-posts">
          <article v-for="(post, index) in filteredPosts" :key="index" class="blog-post-card">
            <div class="row">
              <div class="col-md-4">
                <div class="post-image">
                  <img
                    :src="
                      post.image &&
                      (post.image.startsWith('http') || post.image.startsWith('data:'))
                        ? post.image
                        : `/images/blog/${post.image || '57.jpg'}`
                    "
                    :alt="post.title"
                    @error="handleImageError"
                    class="post-image-img"
                  />
                  <span v-if="!post.image" class="fallback-icon">📖</span>
                </div>
              </div>
              <div class="col-md-8">
                <div class="post-content">
                  <div class="post-header">
                    <h3 class="post-title">{{ post.title }}</h3>
                    <div class="post-meta">
                      <span class="save-icon">★</span>
                      <span class="post-date">{{ post.date }}</span>
                    </div>
                  </div>

                  <p class="post-author">{{ post.author }}</p>

                  <div class="post-tags">
                    <span v-for="(tag, tagIndex) in post.tags" :key="tagIndex" class="post-tag">
                      {{ tag }}
                    </span>
                  </div>

                  <p class="post-excerpt">{{ post.excerpt }}</p>

                  <div class="post-rating">
                    <div class="rating-display">
                      <div class="average-rating">
                        <span class="rating-score">{{ post.averageRating.toFixed(1) }}</span>
                        <div class="stars">
                          <span
                            v-for="star in 5"
                            :key="star"
                            class="star"
                            :class="{ filled: star <= Math.round(post.averageRating) }"
                          >
                            ★
                          </span>
                        </div>
                      </div>
                      <span class="reviews">{{ post.ratingCount }} Reviews</span>
                    </div>
                  </div>

                  <router-link :to="`/blogs/${post.id}`" class="btn btn-primary read-more-btn"
                    >Read More</router-link
                  >
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="load-more-container">
          <button v-if="hasMorePosts" @click="loadMorePosts" class="load-more-btn">
            Load More
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  getAllPosts,
  initializePostsListener,
  cleanupPostsListener,
  handleImageError,
} from '../services/firestoreBlogService'

// Posts data
const posts = ref([])
const isLoading = ref(true)
const error = ref(null)

// Tags for filtering
const tags = ref([
  'Anxiety',
  'Depression',
  'Stress',
  'Mindfulness',
  'Self-Care',
  'Relationships',
  'Parenting',
  'Teenagers',
  'Work-Life Balance',
  'Coping Skills',
])

const selectedTags = ref([])

const displayedPosts = ref(3)
const hasMorePosts = ref(true)

// Load posts from Firestore
const loadPosts = async () => {
  try {
    isLoading.value = true
    const allPosts = await getAllPosts()
    // Filter for published posts only
    posts.value = allPosts.filter((post) => post.status === 'published')
  } catch (err) {
    console.error('Error loading posts:', err)
    error.value = err.message
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

// Filter posts based on selected tags
const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    return posts.value.slice(0, displayedPosts.value)
  }

  const filtered = posts.value.filter((post) =>
    post.tags.some((tag) => selectedTags.value.includes(tag)),
  )

  return filtered.slice(0, displayedPosts.value)
})

// Toggle tag selection
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// Load more posts
const loadMorePosts = () => {
  displayedPosts.value += 3
  if (displayedPosts.value >= posts.value.length) {
    hasMorePosts.value = false
  }
}

// Initialize posts listener and load data
onMounted(async () => {
  // Initialize real-time listener for posts
  initializePostsListener()

  // Load initial data
  await loadPosts()
})

// Clean up listener when component unmounts
onUnmounted(() => {
  cleanupPostsListener()
})
</script>
