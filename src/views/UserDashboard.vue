<script setup>
import { getAuth, signOut, updateProfile } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore'
// Removed InteractiveTable usage for Email History

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
const profileUpdateMessage = ref('')

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

// Save profile updates to Firestore and Firebase Auth
async function saveProfileUpdates(profileData) {
  const user = auth.currentUser
  if (!user) return

  try {
    // Update Firebase Auth profile if displayName changed
    if (profileData.displayName && profileData.displayName !== user.displayName) {
      await updateProfile(user, {
        displayName: profileData.displayName,
      })
    }

    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      ...profileData,
      updatedAt: new Date().toISOString(),
    })

    console.log('Profile updated successfully')
    profileUpdateMessage.value = 'Profile updated successfully!'
    isEditingProfile.value = false
    // Reload profile data to show updated information
    await loadUserProfile()

    // Clear success message after 3 seconds
    setTimeout(() => {
      profileUpdateMessage.value = ''
    }, 3000)
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
  // Validate display name
  if (userProfile.value.displayName && userProfile.value.displayName.length < 2) {
    alert('Display name must be at least 2 characters long')
    return
  }

  if (userProfile.value.displayName && userProfile.value.displayName.length > 50) {
    alert('Display name must be less than 50 characters')
    return
  }

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
          <!-- Mood & Journal (Unified, offline-enabled) -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-heart me-2"></i>
                Mood & Journal
              </h3>
              <button class="btn btn-sm btn-outline-primary" @click="openJournalHistory">
                View History
              </button>
            </div>
            <div class="mood-journal-container">
              <div class="mood-section">
                <h5 class="mb-3">
                  <i class="fas fa-smile me-2"></i>
                  How are you feeling today?
                </h5>
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
              </div>

              <div class="journal-section">
                <h5 class="mb-3">
                  <i class="fas fa-pen me-2"></i>
                  Journal Entry
                </h5>
                <div class="journal-input">
                  <textarea
                    class="form-control journal-textarea"
                    placeholder="Share your thoughts, experiences, or reflections... (optional)"
                    v-model="journalContent"
                    rows="6"
                    maxlength="500"
                  ></textarea>
                  <div class="journal-actions mt-3">
                    <button
                      class="btn btn-primary"
                      @click="saveJournalDraft"
                      :disabled="!selectedMood && !journalContent.trim()"
                    >
                      <i class="fas fa-save me-1"></i>
                      Save Draft
                    </button>
                    <button class="btn btn-outline-secondary" @click="clearJournal">
                      <i class="fas fa-eraser me-1"></i>
                      Clear
                    </button>
                    <small class="text-muted ms-3">
                      {{ journalContent.length }}/500 characters
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Journal History Section -->
          <div class="dashboard-section mb-4">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-history me-2"></i>
                Journal History
              </h3>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="loadJournalHistory">
                  <i class="fas fa-sync me-1"></i>
                  Refresh
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="toggleHistoryView">
                  <i class="fas fa-th-large me-1"></i>
                  {{ historyViewMode === 'grid' ? 'List View' : 'Grid View' }}
                </button>
              </div>
            </div>
            <div class="journal-history">
              <div v-if="isLoadingHistory" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading journal history...</p>
              </div>
              <div v-else-if="journalHistory.length === 0" class="no-entries">
                <div class="text-center py-5">
                  <i class="fas fa-journal-whills fa-3x text-muted mb-3"></i>
                  <h5>No journal entries yet</h5>
                  <p class="text-muted">Start writing your first journal entry above!</p>
                </div>
              </div>
              <div v-else :class="historyViewMode === 'grid' ? 'journal-grid' : 'journal-list'">
                <div
                  v-for="entry in displayedJournalHistory"
                  :key="entry.id"
                  class="journal-entry"
                  :class="[
                    historyViewMode === 'grid' ? 'journal-card' : 'journal-item',
                    { editing: editingEntry === entry.id },
                  ]"
                >
                  <!-- View Mode -->
                  <div
                    v-if="editingEntry !== entry.id"
                    class="entry-view"
                    @click="toggleExpanded(entry)"
                  >
                    <div class="entry-header">
                      <div class="entry-date">{{ formatDate(entry.timestamp || entry.date) }}</div>
                      <div class="entry-actions">
                        <div v-if="entry.mood" class="entry-mood">
                          <i :class="getMoodIcon(entry.mood)" :title="getMoodLabel(entry.mood)"></i>
                          <span class="mood-label">{{ getMoodLabel(entry.mood) }}</span>
                        </div>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click.stop="startEdit(entry)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                    <div class="entry-content">
                      <p v-if="entry.content" class="entry-text">
                        <span v-if="expandedEntry === entry.id">{{ entry.content }}</span>
                        <span v-else>{{ getPreviewText(entry.content) }}</span>
                      </p>
                      <p v-else class="entry-text text-muted italic">No content</p>
                      <div
                        v-if="
                          entry.content && entry.content.length > 150 && expandedEntry !== entry.id
                        "
                        class="expand-hint"
                      >
                        <i class="fas fa-chevron-down"></i> Click to read more
                      </div>
                      <div v-if="expandedEntry === entry.id" class="collapse-hint">
                        <i class="fas fa-chevron-up"></i> Click to collapse
                      </div>
                    </div>
                  </div>

                  <!-- Edit Mode -->
                  <div v-else class="entry-edit">
                    <div class="edit-header">
                      <h6>Edit Entry - {{ formatDate(entry.timestamp || entry.date) }}</h6>
                    </div>
                    <div class="edit-mood mb-3">
                      <label class="form-label">Mood:</label>
                      <div class="mood-selector">
                        <div
                          class="mood-option"
                          v-for="mood in moods"
                          :key="mood.id"
                          :class="{ active: editMood === mood.id }"
                          @click="editMood = mood.id"
                        >
                          <i :class="mood.icon"></i>
                          <span>{{ mood.label }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="edit-content mb-3">
                      <label class="form-label">Content:</label>
                      <textarea
                        class="form-control"
                        v-model="editContent"
                        rows="4"
                        maxlength="500"
                      ></textarea>
                    </div>
                    <div class="edit-actions">
                      <button class="btn btn-primary btn-sm" @click="saveEdit(entry)">
                        <i class="fas fa-save me-1"></i>
                        Save
                      </button>
                      <button class="btn btn-outline-secondary btn-sm" @click="cancelEdit">
                        <i class="fas fa-times me-1"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Load More Button -->
                <div v-if="journalHistory.length > displayedEntries" class="text-center mt-4">
                  <button class="btn btn-outline-primary" @click="loadMoreEntries">
                    <i class="fas fa-plus me-1"></i>
                    Load More ({{ journalHistory.length - displayedEntries }} remaining)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Email History Section -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-envelope me-2"></i>
                Email History
              </h3>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="loadEmailHistory">
                  <i class="fas fa-sync me-1"></i>
                  Refresh
                </button>
              </div>
            </div>
            <div class="email-history">
              <div v-if="isLoadingEmails" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="emailHistory.length === 0" class="no-data-message">
                <p>No email activity yet.</p>
              </div>
              <div v-else class="email-list">
                <div
                  v-for="(e, idx) in emailHistory"
                  :key="idx"
                  class="email-item d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                >
                  <div class="d-flex align-items-center gap-2">
                    <i class="fas fa-paper-plane text-primary"></i>
                    <strong>{{ e.subject || 'No subject' }}</strong>
                    <span class="text-muted">→ {{ e.to }}</span>
                  </div>
                  <small class="text-muted"
                    >{{ formatDate(e.timestamp || e.clientTs) }}
                    {{ formatTime(e.timestamp || e.clientTs) }}</small
                  >
                </div>
              </div>
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
              <!-- Success Message -->
              <div
                v-if="profileUpdateMessage"
                class="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {{ profileUpdateMessage }}
                <button type="button" class="btn-close" @click="profileUpdateMessage = ''"></button>
              </div>

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
                  <span>{{ userProfile.role || 'user' }}</span>
                </div>
                <div class="profile-item">
                  <label>Member since:</label>
                  <span>{{ formatDate(userProfile.createdAt) }}</span>
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
  components: {},
  data() {
    return {
      streakDays: 7,
      savedResources: 12,
      selectedMood: null,
      journalContent: '',
      isOnline: navigator.onLine,
      journalHistory: [],
      isLoadingHistory: false,
      historyViewMode: 'list', // 'grid' or 'list'
      displayedEntries: 6, // Show only 6 entries initially
      editingEntry: null, // Currently editing entry
      editMood: null,
      editContent: '',
      expandedEntry: null, // Currently expanded entry for full content view
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
      // Email history state
      emailHistory: [],
      isLoadingEmails: false,
      // Saved Resources section removed
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
      // optional: console.warn('User activities data not properly initialized')
    }

    // Load journal history on mount
    this.loadJournalHistory()

    // Load email history on mount
    this.loadEmailHistory()

    // Generate sample journal data for development (only for lanxinlu1239@gmail.com)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        const { generateJournalEntries } = await import('../utils/generateJournalData.js')
        const { clearDuplicateJournalEntries } = await import('../services/offlineService.js')

        // First, clear any existing duplicate entries
        clearDuplicateJournalEntries()

        // Then generate new sample data
        await generateJournalEntries()

        // Reload history after generating sample data
        setTimeout(() => this.loadJournalHistory(), 1000)
      } catch (e) {
        console.warn('Failed to generate sample journal data:', e)
      }
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.loadJournalHistory() // Refresh when back online
    })
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  },
  computed: {
    displayedJournalHistory() {
      return this.journalHistory.slice(0, this.displayedEntries)
    },
  },
  methods: {
    async loadEmailHistory() {
      this.isLoadingEmails = true
      try {
        // Load local first (already capped to 100 and 30 days in offlineService)
        const { getLocalEmails } = await import('../services/offlineService')
        const localEmails = getLocalEmails()

        // Merge with cloud if online
        let cloudEmails = []
        if (this.isOnline) {
          try {
            const { getAllEmailEventsFromCloud } = await import('../services/userDataService')
            cloudEmails = await getAllEmailEventsFromCloud()
          } catch (e) {
            console.warn('Failed to load cloud emails:', e)
          }
        }

        const all = [...localEmails, ...cloudEmails]
        // Deduplicate by timestamp+to+subject
        const unique = all.filter(
          (e, i, self) =>
            i ===
            self.findIndex(
              (x) =>
                (x.timestamp || x.clientTs) === (e.timestamp || e.clientTs) &&
                x.to === e.to &&
                x.subject === e.subject,
            ),
        )

        this.emailHistory = unique
          .sort((a, b) => (b.timestamp || b.clientTs || 0) - (a.timestamp || a.clientTs || 0))
          .slice(0, 100)
      } finally {
        this.isLoadingEmails = false
      }
    },
    selectMood(moodId) {
      this.selectedMood = moodId
    },
    async saveJournalDraft() {
      // Ensure we have at least mood or content
      if (!this.selectedMood && !this.journalContent.trim()) {
        alert('Please select a mood or write some content before saving.')
        return
      }

      const entry = {
        mood: this.selectedMood,
        content: this.journalContent.trim(),
        timestamp: Date.now(),
      }
      try {
        const { addLocalJournalEntry, enqueueSync } = await import('../services/offlineService')
        const { saveJournalEntryToCloud } = await import('../services/userDataService')
        addLocalJournalEntry(entry)
        try {
          await saveJournalEntryToCloud(entry)
        } catch {
          enqueueSync({ type: 'journal', payload: entry })
        }
        alert('Saved!')
        this.clearJournal()
        this.loadJournalHistory() // Refresh the history
      } catch (e) {
        console.error('Save draft error', e)
        alert('Failed to save draft')
      }
    },
    clearJournal() {
      this.journalContent = ''
      this.selectedMood = null
    },
    openJournalHistory() {
      this.loadJournalHistory()
    },
    async loadJournalHistory() {
      this.isLoadingHistory = true
      try {
        // Load from local storage first
        const { getLocalJournals } = await import('../services/offlineService')
        const localJournals = getLocalJournals()

        // Try to load from cloud if online
        let cloudJournals = []
        if (this.isOnline) {
          try {
            const { getAllJournalEntriesFromCloud } = await import('../services/userDataService')
            cloudJournals = await getAllJournalEntriesFromCloud()
          } catch (e) {
            console.warn('Failed to load cloud journals:', e)
          }
        }

        // Merge and deduplicate
        const allJournals = [...localJournals, ...cloudJournals]
        const uniqueJournals = allJournals.filter(
          (journal, index, self) =>
            index ===
            self.findIndex(
              (j) => j.timestamp === journal.timestamp && j.content === journal.content,
            ),
        )

        this.journalHistory = uniqueJournals.sort(
          (a, b) => (b.timestamp || b.clientTs || 0) - (a.timestamp || a.clientTs || 0),
        )
      } catch (e) {
        console.error('Failed to load journal history:', e)
      } finally {
        this.isLoadingHistory = false
      }
    },
    toggleHistoryView() {
      this.historyViewMode = this.historyViewMode === 'grid' ? 'list' : 'grid'
    },
    getMoodIcon(moodId) {
      const mood = this.moods.find((m) => m.id === moodId)
      return mood ? mood.icon : 'fas fa-question'
    },
    getMoodLabel(moodId) {
      const mood = this.moods.find((m) => m.id === moodId)
      return mood ? mood.label : 'Unknown'
    },
    startEdit(entry) {
      this.editingEntry = entry.id
      this.editMood = entry.mood
      this.editContent = entry.content || ''
    },
    cancelEdit() {
      this.editingEntry = null
      this.editMood = null
      this.editContent = ''
    },
    async saveEdit(entry) {
      if (!this.editMood && !this.editContent.trim()) {
        alert('Please select a mood or write some content.')
        return
      }

      const updatedEntry = {
        ...entry,
        mood: this.editMood,
        content: this.editContent.trim(),
        timestamp: entry.timestamp, // Keep original timestamp
      }

      try {
        const { addLocalJournalEntry, enqueueSync } = await import('../services/offlineService')
        const { saveJournalEntryToCloud } = await import('../services/userDataService')
        addLocalJournalEntry(updatedEntry)
        try {
          await saveJournalEntryToCloud(updatedEntry)
        } catch {
          enqueueSync({ type: 'journal', payload: updatedEntry })
        }
        this.cancelEdit()
        this.loadJournalHistory() // Refresh the history
        alert('Entry updated!')
      } catch (e) {
        console.error('Update error', e)
        alert('Failed to update entry')
      }
    },
    loadMoreEntries() {
      this.displayedEntries = Math.min(this.displayedEntries + 7, this.journalHistory.length)
    },
    toggleExpanded(entry) {
      this.expandedEntry = this.expandedEntry === entry.id ? null : entry.id
    },
    getPreviewText(content) {
      if (!content) return ''
      return content.length > 150 ? content.substring(0, 150) + '...' : content
    },
    formatDate(date) {
      if (!date) return 'N/A'
      try {
        let dateObj
        // Handle Firestore Timestamp objects
        if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate()
        } else if (date && date.seconds) {
          // Handle Firestore Timestamp with seconds property
          dateObj = new Date(date.seconds * 1000)
        } else {
          dateObj = new Date(date)
        }

        if (isNaN(dateObj.getTime())) return 'Invalid Date'
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(dateObj)
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date'
      }
    },
    formatTime(date) {
      if (!date) return 'N/A'
      try {
        let dateObj
        // Handle Firestore Timestamp objects
        if (date && typeof date.toDate === 'function') {
          dateObj = date.toDate()
        } else if (date && date.seconds) {
          // Handle Firestore Timestamp with seconds property
          dateObj = new Date(date.seconds * 1000)
        } else {
          dateObj = new Date(date)
        }

        if (isNaN(dateObj.getTime())) return 'Invalid Time'
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(dateObj)
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
@import '../assets/journal-styles.css';
</style>
