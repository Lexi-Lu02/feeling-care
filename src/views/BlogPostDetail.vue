<template>
  <div class="blog-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">Loading...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>Blog Post Not Found</h2>
      <p>The blog post you're looking for doesn't exist.</p>
      <router-link to="/blogs" class="btn btn-primary">Back to Blogs</router-link>
    </div>

    <!-- Blog Post Content -->
    <div v-else-if="post.id">
      <!-- Breadcrumb Navigation -->
      <section class="breadcrumb-section">
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
                <router-link to="/blogs">Blogs</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ post.title }}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <!-- Blog Post Content -->
      <section class="blog-content-section">
        <div class="container">
          <div class="blog-detail-card">
            <!-- Header -->
            <div class="blog-header">
              <h1 class="blog-title">{{ post.title }}</h1>
              <div class="blog-meta">
                <span class="author">By {{ post.author }}</span>
                <span class="date">{{ post.date }}</span>
              </div>
              <div class="blog-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Featured Image -->
            <div class="blog-image-container">
              <img
                :src="`/images/blog/${post.image}`"
                :alt="post.title"
                class="blog-featured-image"
                @error="handleImageError"
              />
              <span v-if="!post.image" class="fallback-icon">📖</span>
            </div>

            <!-- Article Content -->
            <div class="blog-content">
              <p class="blog-excerpt">{{ post.excerpt }}</p>

              <!-- Extended content (first-person story) -->
              <div class="blog-full-content" v-html="getStoryContent(post.id).content"></div>
            </div>

            <!-- Rating System -->
            <div class="rating-section">
              <h3>Rate This Article</h3>

              <!-- Current Rating Display -->
              <div class="current-rating">
                <div class="rating-info">
                  <span class="rating-score">{{ post.averageRating.toFixed(1) }}</span>
                  <div class="rating-stars">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="star"
                      :class="{ filled: star <= Math.round(post.averageRating) }"
                    >
                      ★
                    </span>
                  </div>
                  <span class="rating-count">{{ post.ratingCount }} reviews</span>
                </div>
              </div>

              <!-- User Rating -->
              <div class="user-rating">
                <p class="rate-prompt">How would you rate this article?</p>
                <div class="rating-input">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="rating-star"
                    :class="{
                      active: star <= post.userRating,
                      hover: star <= hoverRating && star > post.userRating,
                    }"
                    @click="ratePost(post.id, star)"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                  >
                    ★
                  </span>
                </div>
                <div v-if="post.userRating > 0" class="user-rating-feedback">
                  You rated this article {{ post.userRating }} star{{
                    post.userRating !== 1 ? 's' : ''
                  }}
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="blog-navigation">
              <router-link to="/blogs" class="btn btn-outline-primary">
                ← Back to All Blogs
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { allPosts, handleImageError, getStoryContent } from '../services/blogService'

const route = useRoute()
const post = ref({})
const hoverRating = ref(0)
const loading = ref(true)
const error = ref(false)

onMounted(() => {
  const postId = parseInt(route.params.id)

  const foundPost = allPosts.value.find((p) => p.id === postId)
  if (foundPost) {
    post.value = foundPost
    loading.value = false
  } else {
    // Handle case where post is not found
    error.value = true
    loading.value = false
  }
})

// Rating functionality
const ratePost = (postId, rating) => {
  if (post.value.id === postId) {
    // Update user rating
    post.value.userRating = rating

    // Simulate updating average rating
    const oldTotal = post.value.averageRating * post.value.ratingCount
    const newTotal = oldTotal + rating
    post.value.ratingCount += 1
    post.value.averageRating = newTotal / post.value.ratingCount

    // Show feedback
    // alert(`Thank you for rating this article ${rating} stars!`)
  }
}
</script>
