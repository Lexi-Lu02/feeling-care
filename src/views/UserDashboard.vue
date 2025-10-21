<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore'
import InteractiveTable from '../components/InteractiveTable.vue'

const auth = getAuth()
const db = getFirestore()
const router = useRouter()
const isLoggingOut = ref(false)

// User profile data
const userProfile = ref({
  displayName: '',
  email: '',
  phone: '',
  role: '',
  createdAt: '',
  updatedAt: '',
})

const isEditingProfile = ref(false)
const isLoadingProfile = ref(false)

async function handleLogout() {
  try {
    isLoggingOut.value = true
    await signOut(auth)
    router.push('/auth')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Load user profile from Firestore
async function loadUserProfile() {
  const user = auth.currentUser
  if (!user) return

  try {
    isLoadingProfile.value = true
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      userProfile.value = { ...userDoc.data(), email: user.email }
    } else {
      // If no Firestore document exists, create one with basic info
      userProfile.value = {
        displayName: user.displayName || '',
        email: user.email || '',
        phone: '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  } finally {
    isLoadingProfile.value = false
  }
}

// Save profile updates to Firestore
async function saveProfileUpdates(profileData) {
  const user = auth.currentUser
  if (!user) return

  try {
    await updateDoc(doc(db, 'users', user.uid), {
      ...profileData,
      updatedAt: new Date().toISOString(),
    })
    console.log('Profile updated successfully')
    isEditingProfile.value = false
    // Reload profile data to show updated information
    await loadUserProfile()
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

// Toggle profile editing mode
function toggleProfileEdit() {
  isEditingProfile.value = !isEditingProfile.value
}

// Handle profile form submission
async function handleProfileSubmit() {
  await saveProfileUpdates(userProfile.value)
}

// Initialize profile data on component mount
onMounted(() => {
  loadUserProfile()
})
</script>

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

          <!-- Interactive Tables Section -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-table me-2"></i>
                My Activity History
              </h3>
            </div>
            <InteractiveTable
              v-if="userActivities && userActivities.length > 0"
              :data="userActivities"
              :columns="activityColumns"
            />
            <div v-else class="no-data-message">
              <p>No activity data available.</p>
            </div>
          </div>

          <!-- Saved Resources Table -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-bookmark me-2"></i>
                Saved Resources
              </h3>
            </div>
            <InteractiveTable
              v-if="savedResourcesList && savedResourcesList.length > 0"
              :data="savedResourcesList"
              :columns="resourceColumns"
            />
            <div v-else class="no-data-message">
              <p>No saved resources available.</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <!-- User Profile Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-user me-2"></i>
                My Profile
              </h3>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="toggleProfileEdit"
                  :disabled="isLoadingProfile"
                >
                  {{ isEditingProfile ? 'Cancel' : 'Edit Profile' }}
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="handleLogout"
                  :disabled="isLoggingOut"
                >
                  <i class="fas fa-sign-out-alt me-1"></i>
                  {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
                </button>
              </div>
            </div>

            <div v-if="isLoadingProfile" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading profile...</span>
              </div>
            </div>

            <div v-else class="profile-content">
              <!-- Profile Display Mode -->
              <div v-if="!isEditingProfile" class="profile-display">
                <div class="profile-item">
                  <label>Name:</label>
                  <span>{{ userProfile.displayName || 'Not set' }}</span>
                </div>
                <div class="profile-item">
                  <label>Email:</label>
                  <span>{{ userProfile.email || 'Not set' }}</span>
                </div>
                <div class="profile-item">
                  <label>Phone:</label>
                  <span>{{ userProfile.phone || 'Not set' }}</span>
                </div>
                <div class="profile-item">
                  <label>Role:</label>
                  <span class="badge bg-primary">{{ userProfile.role || 'user' }}</span>
                </div>
                <div class="profile-item">
                  <label>Member since:</label>
                  <span>{{ formatDate(new Date(userProfile.createdAt)) }}</span>
                </div>
              </div>

              <!-- Profile Edit Mode -->
              <div v-else class="profile-edit">
                <form @submit.prevent="handleProfileSubmit">
                  <div class="mb-3">
                    <label class="form-label">Display Name</label>
                    <input
                      v-model="userProfile.displayName"
                      type="text"
                      class="form-control"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input
                      v-model="userProfile.email"
                      type="email"
                      class="form-control"
                      readonly
                      title="Email cannot be changed"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input
                      v-model="userProfile.phone"
                      type="tel"
                      class="form-control"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Role</label>
                    <select v-model="userProfile.role" class="form-select">
                      <option value="user">User</option>
                      <option value="myself">Seeking help for myself</option>
                      <option value="someone-else">Seeking help for someone else</option>
                    </select>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                      <i class="fas fa-save me-1"></i>
                      Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary" @click="toggleProfileEdit">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

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
  components: {
    InteractiveTable,
  },
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
      // User Activities Data for Interactive Table
      userActivities: [
        {
          id: 1,
          date: new Date(Date.now() - 7 * 86400000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.1',
          duration: '2h 30m',
        },
        {
          id: 2,
          date: new Date(Date.now() - 6 * 86400000),
          type: 'Email Sent',
          description: 'Sent email to support@example.com',
          duration: '5m',
        },
        {
          id: 3,
          date: new Date(Date.now() - 5 * 86400000),
          type: 'Profile Update',
          description: 'Updated profile picture',
          duration: '3m',
        },
        {
          id: 4,
          date: new Date(Date.now() - 4 * 86400000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.2',
          duration: '1h 45m',
        },
        {
          id: 5,
          date: new Date(Date.now() - 3 * 86400000),
          type: 'Email Sent',
          description: 'Sent email to info@example.com',
          duration: '8m',
        },
        {
          id: 6,
          date: new Date(Date.now() - 2 * 86400000),
          type: 'Password Change',
          description: 'Changed password',
          duration: '2m',
        },
        {
          id: 7,
          date: new Date(Date.now() - 1 * 86400000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.1',
          duration: '3h 15m',
        },
        {
          id: 8,
          date: new Date(Date.now() - 12 * 3600000),
          type: 'Email Sent',
          description: 'Sent email to sales@example.com',
          duration: '6m',
        },
        {
          id: 9,
          date: new Date(Date.now() - 6 * 3600000),
          type: 'Profile Update',
          description: 'Updated contact info',
          duration: '4m',
        },
        {
          id: 10,
          date: new Date(Date.now() - 3 * 3600000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.3',
          duration: '45m',
        },
        {
          id: 11,
          date: new Date(Date.now() - 2 * 3600000),
          type: 'Email Sent',
          description: 'Sent email to hr@example.com',
          duration: '7m',
        },
        {
          id: 12,
          date: new Date(Date.now() - 1 * 3600000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.2',
          duration: '1h 20m',
        },
        {
          id: 13,
          date: new Date(Date.now() - 30 * 60000),
          type: 'Resource Saved',
          description: 'Saved article about stress management',
          duration: '2m',
        },
        {
          id: 14,
          date: new Date(Date.now() - 15 * 60000),
          type: 'Mood Entry',
          description: 'Logged daily mood as "Good"',
          duration: '1m',
        },
        {
          id: 15,
          date: new Date(Date.now() - 5 * 60000),
          type: 'Login',
          description: 'Logged in from IP 192.168.1.1',
          duration: '10m',
        },
      ],
      activityColumns: [
        { key: 'id', label: 'ID', sortable: true, searchable: false },
        { key: 'date', label: 'Date', sortable: true, searchable: true, type: 'date' },
        { key: 'type', label: 'Activity Type', sortable: true, searchable: true },
        { key: 'description', label: 'Description', sortable: false, searchable: true },
        { key: 'duration', label: 'Duration', sortable: true, searchable: false },
      ],
      savedResourcesList: [
        {
          id: 1,
          type: 'Article',
          title: '10 Tips for Better Sleep',
          description: 'Evidence-based strategies to improve your sleep quality',
          savedDate: new Date(Date.now() - 2 * 86400000),
          category: 'Sleep',
          author: 'Dr. Sarah Johnson',
        },
        {
          id: 2,
          type: 'Video',
          title: 'Mindfulness Meditation',
          description: '15-minute guided meditation for beginners',
          savedDate: new Date(Date.now() - 86400000),
          category: 'Meditation',
          author: 'Mindful Moments',
        },
        {
          id: 3,
          type: 'Podcast',
          title: 'Managing Anxiety',
          description: 'Expert interview on anxiety management techniques',
          savedDate: new Date(),
          category: 'Anxiety',
          author: 'Mental Health Podcast',
        },
        {
          id: 4,
          type: 'Article',
          title: 'Building Healthy Habits',
          description: 'Step-by-step guide to creating lasting positive changes',
          savedDate: new Date(Date.now() - 3 * 86400000),
          category: 'Habits',
          author: 'Dr. Michael Chen',
        },
        {
          id: 5,
          type: 'Video',
          title: 'Yoga for Stress Relief',
          description: 'Gentle yoga routine to reduce stress and tension',
          savedDate: new Date(Date.now() - 4 * 86400000),
          category: 'Exercise',
          author: 'Yoga with Emma',
        },
        {
          id: 6,
          type: 'Article',
          title: 'Understanding Depression',
          description: 'Comprehensive guide to recognizing and managing depression',
          savedDate: new Date(Date.now() - 5 * 86400000),
          category: 'Depression',
          author: 'Dr. Lisa Rodriguez',
        },
        {
          id: 7,
          type: 'Podcast',
          title: 'Sleep Science',
          description: 'Latest research on sleep and its impact on mental health',
          savedDate: new Date(Date.now() - 6 * 86400000),
          category: 'Sleep',
          author: 'Science of Sleep',
        },
        {
          id: 8,
          type: 'Video',
          title: 'Breathing Techniques',
          description: 'Simple breathing exercises for anxiety and stress',
          savedDate: new Date(Date.now() - 7 * 86400000),
          category: 'Breathing',
          author: 'Calm Breathing',
        },
        {
          id: 9,
          type: 'Article',
          title: 'Nutrition and Mental Health',
          description: 'How diet affects your mood and cognitive function',
          savedDate: new Date(Date.now() - 8 * 86400000),
          category: 'Nutrition',
          author: 'Dr. Amanda Foster',
        },
        {
          id: 10,
          type: 'Podcast',
          title: 'Work-Life Balance',
          description: 'Strategies for maintaining healthy boundaries',
          savedDate: new Date(Date.now() - 9 * 86400000),
          category: 'Work-Life',
          author: 'Balance Matters',
        },
        {
          id: 11,
          type: 'Video',
          title: 'Progressive Muscle Relaxation',
          description: 'Guided technique for deep relaxation',
          savedDate: new Date(Date.now() - 10 * 86400000),
          category: 'Relaxation',
          author: 'Relaxation Studio',
        },
        {
          id: 12,
          type: 'Article',
          title: 'Social Connection and Mental Health',
          description: 'The importance of relationships for wellbeing',
          savedDate: new Date(Date.now() - 11 * 86400000),
          category: 'Relationships',
          author: 'Dr. James Wilson',
        },
      ],
      resourceColumns: [
        { key: 'id', label: 'ID', sortable: true, searchable: false },
        { key: 'type', label: 'Type', sortable: true, searchable: true },
        { key: 'title', label: 'Title', sortable: true, searchable: true },
        { key: 'category', label: 'Category', sortable: true, searchable: true },
        { key: 'author', label: 'Author', sortable: true, searchable: true },
        { key: 'savedDate', label: 'Saved Date', sortable: true, searchable: true, type: 'date' },
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
  async mounted() {
    // Wait for DOM to be ready before initializing
    await this.$nextTick()

    // Ensure data is properly initialized
    if (!this.userActivities || this.userActivities.length === 0) {
      console.warn('User activities data not properly initialized')
    }
    if (!this.savedResourcesList || this.savedResourcesList.length === 0) {
      console.warn('Saved resources data not properly initialized')
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
      if (!date) return 'N/A'
      try {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(date))
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date'
      }
    },
    formatTime(date) {
      if (!date) return 'N/A'
      try {
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(date))
      } catch (error) {
        console.error('Error formatting time:', error)
        return 'Invalid Time'
      }
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
