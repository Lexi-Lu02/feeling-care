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
                    :src="`/images/blog/${post.image}`"
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
                    <div class="stars">
                      <span v-for="star in 5" :key="star" class="star">★</span>
                    </div>
                    <span class="reviews">{{ post.reviews }} Reviews</span>
                  </div>

                  <button class="btn btn-primary read-more-btn">Read More</button>
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
import { ref, computed } from 'vue'

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

// Blog posts data
const allPosts = ref([
  {
    title: "Understanding Anxiety in Young People: A Parent's Guide",
    author: 'Dr. Sarah Johnson',
    date: '15/12/2024',
    tags: ['Anxiety', 'Teenagers', 'Mental Health'],
    excerpt:
      'Anxiety is one of the most common mental health challenges facing young people today. In this comprehensive guide, we explore the signs and symptoms of anxiety in children and teenagers, common triggers, and evidence-based strategies for support. Learn how to recognize when your child might be struggling and discover practical ways to help them build resilience and coping skills.',
    reviews: 127,
    image: '57.jpg',
  },
  {
    title: "Building Resilience: How to Bounce Back from Life's Challenges",
    author: 'Prof. Michael Chen',
    date: '12/12/2024',
    tags: ['Resilience', 'Coping Skills', 'Self-Care'],
    excerpt:
      "Resilience isn't about avoiding difficulties—it's about developing the skills to navigate them effectively. This article explores the science behind resilience and provides practical techniques for building mental strength. From developing a growth mindset to practicing self-compassion, discover how to cultivate resilience in yourself and support others in their journey.",
    reviews: 89,
    image: '102.jpg',
  },
  {
    title: 'Digital Wellbeing: Finding Balance in a Connected World',
    author: 'Dr. Emily Rodriguez',
    date: '10/12/2024',
    tags: ['Digital Health', 'Work-Life Balance', 'Technology'],
    excerpt:
      'Technology has transformed how we live, work, and connect, but it also presents new challenges for our mental health. Learn about the impact of digital devices on our wellbeing and discover strategies for creating healthy boundaries with technology. From digital detox techniques to mindful social media use, find practical ways to maintain balance in our increasingly connected world.',
    reviews: 203,
    image: '108.jpg',
  },
  {
    title: 'Supporting Your Child Through Mental Health Challenges',
    author: 'Dr. Lisa Thompson',
    date: '08/12/2024',
    tags: ['Parenting', 'Children', 'Support'],
    excerpt:
      "When your child is struggling with mental health challenges, it can feel overwhelming and isolating. This guide provides parents with practical advice on how to support their child's mental health journey. Learn about effective communication strategies, when to seek professional help, and how to take care of your own mental health while supporting your child.",
    reviews: 156,
    image: '112.jpg',
  },
  {
    title: 'Mindfulness in Daily Life: Simple Practices for Better Mental Health',
    author: 'Sarah Williams',
    date: '05/12/2024',
    tags: ['Mindfulness', 'Self-Care', 'Techniques'],
    excerpt:
      "Mindfulness isn't just about meditation—it's a way of living that can transform your relationship with stress and anxiety. Discover simple mindfulness practices you can integrate into your daily routine, from mindful breathing exercises to present-moment awareness techniques. Learn how these practices can help reduce stress, improve focus, and enhance overall wellbeing.",
    reviews: 94,
    image: '125.jpg',
  },
  {
    title: 'Breaking the Stigma: How to Talk About Mental Health',
    author: 'Dr. James Wilson',
    date: '03/12/2024',
    tags: ['Stigma', 'Awareness', 'Mental Health'],
    excerpt:
      'Mental health stigma remains one of the biggest barriers to people seeking help. This article explores how stigma affects individuals and communities, and provides practical strategies for challenging misconceptions about mental health. Learn how to have open, supportive conversations about mental health and contribute to creating a more understanding and compassionate society.',
    reviews: 178,
    image: '126.jpg',
  },
])

const displayedPosts = ref(3)
const hasMorePosts = ref(true)

// Filter posts based on selected tags
const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    return allPosts.value.slice(0, displayedPosts.value)
  }

  const filtered = allPosts.value.filter((post) =>
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
  if (displayedPosts.value >= allPosts.value.length) {
    hasMorePosts.value = false
  }
}

// Handle image loading errors
const handleImageError = (event) => {
  // Hide the broken image and show fallback
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) {
    fallback.style.display = 'flex'
  }
}
</script>
