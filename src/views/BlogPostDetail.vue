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

              <!-- User Rating (only for authenticated users) -->
              <div v-if="isLoggedIn" class="user-rating">
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

              <!-- Login prompt for unauthenticated users -->
              <div v-else class="login-prompt">
                <p class="rate-prompt">
                  Please <router-link to="/auth" class="login-link">sign in</router-link> to rate
                  this article
                </p>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
              <h3>Comments ({{ comments.length }})</h3>

              <!-- Comment Form (only for authenticated users) -->
              <div v-if="isLoggedIn" class="comment-form">
                <h4>Leave a Comment</h4>
                <p class="comment-as">
                  Commenting as: <strong>{{ currentUser.username }}</strong>
                </p>
                <form @submit.prevent="submitComment">
                  <div class="form-group">
                    <label for="commentContent">Your Comment</label>
                    <textarea
                      id="commentContent"
                      v-model="newComment.content"
                      required
                      rows="4"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Post Comment</button>
                </form>
              </div>

              <!-- Login prompt for unauthenticated users -->
              <div v-else class="login-prompt">
                <h4>Leave a Comment</h4>
                <p>
                  Please <router-link to="/auth" class="login-link">sign in</router-link> to post a
                  comment
                </p>
              </div>

              <!-- Comments List -->
              <div class="comments-list">
                <div v-if="comments.length === 0" class="no-comments">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>

                <div v-for="comment in comments" :key="comment.id" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-author">
                      <strong>{{ comment.author }}</strong>
                      <span class="comment-date">{{ formatDate(comment.timestamp) }}</span>
                    </div>
                    <button
                      v-if="isLoggedIn && comment.author === currentUser.username"
                      @click="deleteComment(comment.id)"
                      class="btn-delete-comment"
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  </div>

                  <div class="comment-content">
                    {{ comment.content }}
                  </div>

                  <div class="comment-actions">
                    <button
                      v-if="isLoggedIn"
                      @click="toggleLike(comment.id)"
                      class="btn-like"
                      :class="{ active: comment.userLiked }"
                      :title="comment.userLiked ? 'Unlike' : 'Like'"
                    >
                      👍 {{ comment.likes }}
                    </button>
                    <button
                      v-if="isLoggedIn"
                      @click="toggleDislike(comment.id)"
                      class="btn-dislike"
                      :class="{ active: comment.userDisliked }"
                      :title="comment.userDisliked ? 'Remove dislike' : 'Dislike'"
                    >
                      👎 {{ comment.dislikes }}
                    </button>
                    <div v-if="!isLoggedIn" class="login-prompt-small">
                      <router-link to="/auth" class="login-link">Sign in</router-link> to
                      like/dislike
                    </div>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { allPosts, handleImageError, getStoryContent } from '../services/blogService'
import { getCurrentUser, isAuthenticated } from '../services/authService'

const route = useRoute()
const post = ref({})
const hoverRating = ref(0)
const loading = ref(true)
const error = ref(false)

// Comment system state
const comments = ref([])
const newComment = ref({
  author: '',
  content: '',
})

// Authentication state
const currentUser = computed(() => getCurrentUser())
const isLoggedIn = computed(() => isAuthenticated())

onMounted(() => {
  const postId = parseInt(route.params.id)

  const foundPost = allPosts.value.find((p) => p.id === postId)
  if (foundPost) {
    post.value = foundPost
    loading.value = false

    loadComments(postId)
  } else {
    // Handle case where post is not found
    error.value = true
    loading.value = false
  }
})

// Comment functionality
const loadComments = (postId) => {
  const storedComments = localStorage.getItem(`comments_${postId}`)
  if (storedComments) {
    comments.value = JSON.parse(storedComments)
  }
}

const saveComments = () => {
  localStorage.setItem(`comments_${post.value.id}`, JSON.stringify(comments.value))
}

const submitComment = () => {
  if (isLoggedIn.value && newComment.value.content.trim()) {
    const comment = {
      id: Date.now(),
      author: currentUser.value.username,
      content: newComment.value.content.trim(),
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      userLiked: false,
      userDisliked: false,
    }

    comments.value.unshift(comment)

    // Clear form
    newComment.value = {
      author: '',
      content: '',
    }

    saveComments()
  }
}

const deleteComment = (commentId) => {
  if (isLoggedIn.value && confirm('Are you sure you want to delete this comment?')) {
    comments.value = comments.value.filter((comment) => comment.id !== commentId)
    saveComments()
  }
}

const toggleLike = (commentId) => {
  if (!isLoggedIn.value) return

  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    if (comment.userLiked) {
      // Remove like
      comment.userLiked = false
      comment.likes--
    } else {
      // Add like
      if (comment.userDisliked) {
        // Remove dislike first
        comment.userDisliked = false
        comment.dislikes--
      }
      comment.userLiked = true
      comment.likes++
    }
    saveComments()
  }
}

const toggleDislike = (commentId) => {
  if (!isLoggedIn.value) return

  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    if (comment.userDisliked) {
      // Remove dislike
      comment.userDisliked = false
      comment.dislikes--
    } else {
      // Add dislike
      if (comment.userLiked) {
        // Remove like first
        comment.userLiked = false
        comment.likes--
      }
      comment.userDisliked = true
      comment.dislikes++
    }
    saveComments()
  }
}

const formatDate = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    return commentDate.toLocaleDateString()
  }
}

// Rating functionality
const ratePost = (postId, rating) => {
  if (!isLoggedIn.value) return

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
