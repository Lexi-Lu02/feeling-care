<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="dashboard-title">
              <i class="fas fa-tachometer-alt me-3"></i>
              My Dashboard
            </h1>
            <p class="dashboard-subtitle">Track your wellness journey and manage your resources</p>
          </div>
          <div class="col-lg-4 text-end">
            <div class="dashboard-stats">
              <div class="stat-item">
                <span class="stat-number">{{ streakDays }}</span>
                <span class="stat-label">Day Streak</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ savedResources }}</span>
                <span class="stat-label">Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container dashboard-content">
      <div class="row">
        <!-- Left Column -->
        <div class="col-lg-8">
          <!-- Mood Tracker Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-heart me-2"></i>
                Daily Mood Tracker
              </h3>
              <button class="btn btn-sm btn-outline-primary">View History</button>
            </div>
            <div class="mood-tracker">
              <div class="today-mood">
                <h5>Today's Mood</h5>
                <div class="mood-selector">
                  <div
                    class="mood-option"
                    v-for="mood in moods"
                    :key="mood.id"
                    :class="{ active: selectedMood === mood.id }"
                    @click="selectMood(mood.id)"
                  >
                    <i :class="mood.icon"></i>
                    <span>{{ mood.label }}</span>
                  </div>
                </div>
                <div class="mood-notes mt-3">
                  <textarea
                    class="form-control"
                    placeholder="How are you feeling today? (optional)"
                    v-model="moodNotes"
                    rows="3"
                  ></textarea>
                  <button class="btn btn-primary mt-2" @click="saveMood">Save Mood</button>
                </div>
              </div>
              <div class="mood-chart">
                <h5>This Week's Mood</h5>
                <div class="chart-placeholder">
                  <i class="fas fa-chart-line fa-3x text-muted"></i>
                  <p>Mood trend chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Daily Journey Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-route me-2"></i>
                Daily Journey
              </h3>
              <button class="btn btn-sm btn-outline-primary">View All Entries</button>
            </div>
            <div class="journey-entries">
              <div class="entry-item" v-for="entry in recentEntries" :key="entry.id">
                <div class="entry-date">{{ formatDate(entry.date) }}</div>
                <div class="entry-content">
                  <h6>{{ entry.title }}</h6>
                  <p>{{ entry.content }}</p>
                  <div class="entry-tags">
                    <span class="tag" v-for="tag in entry.tags" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3">
                <button class="btn btn-outline-secondary">
                  <i class="fas fa-plus me-2"></i>
                  Add New Entry
                </button>
              </div>
            </div>
          </div>

          <!-- Saved Resources Section -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-bookmark me-2"></i>
                Saved Resources
              </h3>
              <div class="resource-filters">
                <select class="form-select form-select-sm">
                  <option>All Types</option>
                  <option>Articles</option>
                  <option>Videos</option>
                  <option>Podcasts</option>
                </select>
              </div>
            </div>
            <div class="saved-resources">
              <div class="resource-grid">
                <div
                  class="resource-card"
                  v-for="resource in savedResourcesList"
                  :key="resource.id"
                >
                  <div class="resource-type">
                    <i :class="getResourceIcon(resource.type)"></i>
                    <span>{{ resource.type }}</span>
                  </div>
                  <h6 class="resource-title">{{ resource.title }}</h6>
                  <p class="resource-description">{{ resource.description }}</p>
                  <div class="resource-meta">
                    <small class="text-muted">Saved {{ formatDate(resource.savedDate) }}</small>
                    <button class="btn btn-sm btn-outline-danger ms-auto">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <!-- Browsing History Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-history me-2"></i>
                Recent Activity
              </h3>
              <button class="btn btn-sm btn-outline-primary">Clear History</button>
            </div>
            <div class="browsing-history">
              <div class="history-item" v-for="item in browsingHistory" :key="item.id">
                <div class="history-icon">
                  <i :class="getResourceIcon(item.type)"></i>
                </div>
                <div class="history-content">
                  <h6>{{ item.title }}</h6>
                  <small class="text-muted">{{ formatTime(item.timestamp) }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Wellness Goals Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-target me-2"></i>
                Wellness Goals
              </h3>
              <button class="btn btn-sm btn-outline-primary">Add Goal</button>
            </div>
            <div class="wellness-goals">
              <div class="goal-item" v-for="goal in wellnessGoals" :key="goal.id">
                <div class="goal-progress">
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: goal.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ goal.progress }}%</span>
                </div>
                <h6>{{ goal.title }}</h6>
                <small class="text-muted">{{ goal.description }}</small>
              </div>
            </div>
          </div>

          <!-- Support Contacts Section -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-users me-2"></i>
                Quick Support
              </h3>
            </div>
            <div class="support-contacts">
              <div class="contact-item">
                <i class="fas fa-phone contact-icon"></i>
                <div>
                  <h6>Crisis Hotline</h6>
                  <small>24/7 Support</small>
                </div>
                <button class="btn btn-sm btn-outline-primary">Call</button>
              </div>
              <div class="contact-item">
                <i class="fas fa-comments contact-icon"></i>
                <div>
                  <h6>Chat Support</h6>
                  <small>Available Now</small>
                </div>
                <button class="btn btn-sm btn-outline-primary">Chat</button>
              </div>
              <div class="contact-item">
                <i class="fas fa-calendar contact-icon"></i>
                <div>
                  <h6>Book Session</h6>
                  <small>With Counselor</small>
                </div>
                <button class="btn btn-sm btn-outline-primary">Book</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      streakDays: 7,
      savedResources: 12,
      selectedMood: null,
      moodNotes: '',
      moods: [
        { id: 1, icon: 'fas fa-smile', label: 'Great' },
        { id: 2, icon: 'fas fa-grin', label: 'Good' },
        { id: 3, icon: 'fas fa-meh', label: 'Okay' },
        { id: 4, icon: 'fas fa-frown', label: 'Not Good' },
        { id: 5, icon: 'fas fa-sad-tear', label: 'Terrible' },
      ],
      recentEntries: [
        {
          id: 1,
          date: new Date(),
          title: 'Morning Reflection',
          content:
            "Feeling grateful for the small things today. The weather is beautiful and I had a good night's sleep.",
          tags: ['gratitude', 'morning', 'positive'],
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000),
          title: 'Stress Management',
          content:
            'Work was challenging but I used the breathing techniques I learned. Feeling more in control.',
          tags: ['stress', 'work', 'coping'],
        },
      ],
      savedResourcesList: [
        {
          id: 1,
          type: 'Article',
          title: '10 Tips for Better Sleep',
          description: 'Evidence-based strategies to improve your sleep quality',
          savedDate: new Date(Date.now() - 2 * 86400000),
        },
        {
          id: 2,
          type: 'Video',
          title: 'Mindfulness Meditation',
          description: '15-minute guided meditation for beginners',
          savedDate: new Date(Date.now() - 86400000),
        },
        {
          id: 3,
          type: 'Podcast',
          title: 'Managing Anxiety',
          description: 'Expert interview on anxiety management techniques',
          savedDate: new Date(),
        },
      ],
      browsingHistory: [
        {
          id: 1,
          type: 'Article',
          title: 'Understanding Depression',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          type: 'Video',
          title: 'Yoga for Stress Relief',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: 3,
          type: 'Article',
          title: 'Building Healthy Habits',
          timestamp: new Date(Date.now() - 10800000),
        },
      ],
      wellnessGoals: [
        {
          id: 1,
          title: 'Daily Meditation',
          description: 'Meditate for 10 minutes every day',
          progress: 75,
        },
        {
          id: 2,
          title: 'Physical Activity',
          description: 'Exercise 3 times per week',
          progress: 60,
        },
        {
          id: 3,
          title: 'Sleep Schedule',
          description: 'Go to bed before 11 PM',
          progress: 40,
        },
      ],
    }
  },
  methods: {
    selectMood(moodId) {
      this.selectedMood = moodId
    },
    saveMood() {
      if (this.selectedMood) {
        // Here you would typically save to backend
        console.log('Mood saved:', this.selectedMood, this.moodNotes)
        alert('Mood saved successfully!')
        this.moodNotes = ''
        this.selectedMood = null
      }
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    },
    formatTime(date) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date)
    },
    getResourceIcon(type) {
      const icons = {
        Article: 'fas fa-file-alt',
        Video: 'fas fa-play-circle',
        Podcast: 'fas fa-microphone',
      }
      return icons[type] || 'fas fa-file'
    },
  },
}
</script>

<style scoped>
@import '../assets/dashboard.css';
</style>
