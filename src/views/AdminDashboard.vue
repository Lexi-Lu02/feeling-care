<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../services/firebaseService'
import { getCurrentUser, isAdmin } from '../services/authService'
import { userManagementService } from '../services/userManagementService'
import InteractiveTable from '../components/InteractiveTable.vue'

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Check if user is admin
if (!isAdmin()) {
  window.location.href = '/auth'
}

const currentUser = ref(getCurrentUser())

// Admin Actions
const adminActions = ref([
  {
    icon: '👤',
    title: 'Manage Users',
    description: 'Add, edit, or remove user accounts',
    buttonText: 'Manage Users',
    handler: () => {
      // User management feature clicked
    },
  },
  {
    icon: '📝',
    title: 'Content Management',
    description: 'Manage website content and resources',
    buttonText: 'Manage Content',
    handler: () => {
      // Content management feature clicked
    },
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'View detailed system analytics and reports',
    buttonText: 'View Analytics',
    handler: () => {
      // Analytics feature clicked
    },
  },
  {
    icon: '⚙️',
    title: 'System Settings',
    description: 'Configure system settings and preferences',
    buttonText: 'Settings',
    handler: () => {
      // System settings feature clicked
    },
  },
  {
    icon: '🔒',
    title: 'Security',
    description: 'Manage security settings and access controls',
    buttonText: 'Security',
    handler: () => {
      // Security feature clicked
    },
  },
  {
    icon: '📋',
    title: 'Reports',
    description: 'Generate and view system reports',
    buttonText: 'Reports',
    handler: () => {
      // Reports feature clicked
    },
  },
])

// User Management Data
const users = ref([])
const isLoadingUsers = ref(false)
const selectedUser = ref(null)

// Posts Management Data
const posts = ref([])
const isLoadingPosts = ref(false)
const selectedPost = ref(null)

// User table columns configuration
const userColumns = ref([
  { key: 'id', label: 'ID', sortable: true, searchable: false },
  { key: 'username', label: 'Username', sortable: true, searchable: true },
  { key: 'email', label: 'Email', sortable: true, searchable: true },
  { key: 'role', label: 'Role', sortable: true, searchable: true },
  { key: 'status', label: 'Status', sortable: true, searchable: true },
  { key: 'emailVerified', label: 'Verified', sortable: true, searchable: false },
  { key: 'provider', label: 'Provider', sortable: true, searchable: true },
  { key: 'createdAt', label: 'Created', sortable: true, searchable: true, type: 'date' },
  { key: 'lastSignIn', label: 'Last Sign In', sortable: true, searchable: true, type: 'date' },
  { key: 'actions', label: 'Actions', sortable: false, searchable: false, type: 'actions' },
])

// Posts table columns configuration
const postColumns = ref([
  { key: 'id', label: 'ID', sortable: true, searchable: false },
  { key: 'title', label: 'Title', sortable: true, searchable: true },
  { key: 'content', label: 'Content', sortable: false, searchable: true },
  { key: 'author', label: 'Author', sortable: true, searchable: true },
  { key: 'category', label: 'Category', sortable: true, searchable: true },
  { key: 'status', label: 'Status', sortable: true, searchable: true },
  { key: 'createdAt', label: 'Created', sortable: true, searchable: true, type: 'date' },
  { key: 'updatedAt', label: 'Updated', sortable: true, searchable: true, type: 'date' },
  { key: 'actions', label: 'Actions', sortable: false, searchable: false, type: 'actions' },
])

// System Settings
const settings = ref({
  siteName: 'Feeling Care',
  maintenanceMode: false,
  sessionTimeout: 30,
  passwordPolicy: 'medium',
})

// User management methods
const loadUsers = async () => {
  isLoadingUsers.value = true
  try {
    const userData = await userManagementService.getUsers()
    users.value = userData
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoadingUsers.value = false
  }
}

const refreshUsers = () => {
  loadUsers()
}

// Posts management methods
const loadPosts = async () => {
  isLoadingPosts.value = true
  try {
    const snap = await getDocs(collection(db, 'posts'))
    posts.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error loading posts:', error)
  } finally {
    isLoadingPosts.value = false
  }
}

const refreshPosts = () => {
  loadPosts()
}

// Delete post functionality
const deletePost = async (post) => {
  if (confirm(`Are you sure you want to delete post: "${post.title}"?`)) {
    try {
      // Call Cloud Function to delete post
      const response = await fetch(
        'https://us-central1-assignment3-lanxin-lu-33912645.cloudfunctions.net/deletePost',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: post.id }),
        },
      )

      if (response.ok) {
        alert('Post deleted successfully')
        await loadPosts() // Refresh the posts list
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }
}

// Update user role functionality
const updateUserRole = async (user, newRole) => {
  try {
    const response = await fetch(
      'https://us-central1-assignment3-lanxin-lu-33912645.cloudfunctions.net/updateUserRole',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          newRole: newRole,
        }),
      },
    )

    if (response.ok) {
      alert('User role updated successfully')
      await loadUsers() // Refresh the users list
    } else {
      alert('Failed to update user role')
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    alert('Failed to update user role')
  }
}

// Edit user role functionality (prompts for new role)
const editUserRole = (user) => {
  const newRole = prompt(`Enter new role for ${user.email || user.username}:`, user.role || 'user')
  if (newRole && newRole !== user.role) {
    updateUserRole(user, newRole)
  }
}

// CSV Export functionality
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Get headers from the first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || ''
          // Escape commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value
        })
        .join(','),
    ),
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportUsersCSV = () => {
  exportToCSV(users.value, 'users.csv')
}

const exportPostsCSV = () => {
  exportToCSV(posts.value, 'posts.csv')
}

const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-danger' : 'bg-primary'
}

const editUser = (user) => {
  // Edit user functionality - could open a modal or navigate to edit page
  console.log('Edit user:', user)
  alert(`Edit user functionality for: ${user.username}`)
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete user: ${user.username}?`)) {
    try {
      const result = await userManagementService.deleteUser(user.id)
      if (result.success) {
        alert('User deleted successfully')
        await loadUsers() // Refresh the user list
        closeUserModal() // Close modal if open
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }
}

// Modal methods
const openUserModal = (user) => {
  selectedUser.value = user
}

const closeUserModal = () => {
  selectedUser.value = null
}

// Post modal methods
const openPostModal = (post) => {
  selectedPost.value = post
}

const closePostModal = () => {
  selectedPost.value = null
}

// Date formatting method
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const saveSettings = () => {
  // General settings saved
}

const saveSecuritySettings = () => {
  // Security settings saved
}

onMounted(async () => {
  users.value = await userManagementService.getUsers()

  // Fetch posts from Firestore
  const snap = await getDocs(collection(db, 'posts'))
  posts.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
})
</script>

<template>
  <div class="admin-dashboard">
    <!-- Admin Header -->
    <section class="admin-header">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="admin-title">Admin Dashboard</h1>
            <p class="admin-subtitle">Welcome back, {{ currentUser?.username }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Actions -->
    <section class="admin-actions-section">
      <div class="container">
        <h2>Administrative Actions</h2>
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-4"
            v-for="(action, index) in adminActions"
            :key="index"
          >
            <div class="action-card">
              <div class="action-icon">{{ action.icon }}</div>
              <h3>{{ action.title }}</h3>
              <p>{{ action.description }}</p>
              <button @click="action.handler" class="btn btn-primary">
                {{ action.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- User Management -->
    <section class="user-management">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-users me-2"></i>
            User Management
          </h2>
          <p class="section-description">Manage user accounts, roles, and permissions</p>
          <div class="section-actions">
            <button
              @click="refreshUsers"
              class="btn btn-outline-primary me-2"
              :disabled="isLoadingUsers"
            >
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoadingUsers }"></i>
              {{ isLoadingUsers ? 'Loading...' : 'Refresh Users' }}
            </button>
            <button
              @click="exportUsersCSV"
              class="btn btn-success"
              :disabled="!users || users.length === 0"
            >
              <i class="fas fa-download me-1"></i>
              Export CSV
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingUsers" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading users...</span>
          </div>
          <p class="mt-2">Loading user data...</p>
        </div>

        <!-- Interactive User Table -->
        <div v-else-if="users && users.length > 0">
          <InteractiveTable
            :data="users"
            :columns="userColumns"
            @row-click="openUserModal"
            @edit-user-role="editUserRole"
          />
        </div>

        <!-- No Users State -->
        <div v-else class="no-users-state">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h4>No users found</h4>
          <p class="text-muted">There are no users to display at the moment.</p>
        </div>
      </div>
    </section>

    <!-- Posts Management -->
    <section class="posts-management">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-newspaper me-2"></i>
            Posts Management
          </h2>
          <p class="section-description">Manage blog posts and content</p>
          <div class="section-actions">
            <button
              @click="refreshPosts"
              class="btn btn-outline-primary me-2"
              :disabled="isLoadingPosts"
            >
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoadingPosts }"></i>
              {{ isLoadingPosts ? 'Loading...' : 'Refresh Posts' }}
            </button>
            <button
              @click="exportPostsCSV"
              class="btn btn-success"
              :disabled="!posts || posts.length === 0"
            >
              <i class="fas fa-download me-1"></i>
              Export CSV
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingPosts" class="loading-state">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading posts...</span>
          </div>
          <p class="mt-2">Loading posts data...</p>
        </div>

        <!-- Interactive Posts Table -->
        <div v-else-if="posts && posts.length > 0">
          <InteractiveTable
            :data="posts"
            :columns="postColumns"
            @row-click="openPostModal"
            @delete-post="deletePost"
          />
        </div>

        <!-- No Posts State -->
        <div v-else class="no-posts-state">
          <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
          <h4>No posts found</h4>
          <p class="text-muted">There are no posts to display at the moment.</p>
        </div>
      </div>
    </section>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeUserModal">
      <div class="user-modal" @click.stop>
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="closeUserModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="user-details">
            <div class="detail-row">
              <label>Username:</label>
              <span>{{ selectedUser.username }}</span>
            </div>
            <div class="detail-row">
              <label>Email:</label>
              <span>{{ selectedUser.email }}</span>
            </div>
            <div class="detail-row">
              <label>Role:</label>
              <span class="badge" :class="getRoleBadgeClass(selectedUser.role)">
                {{ selectedUser.role }}
              </span>
            </div>
            <div class="detail-row">
              <label>Status:</label>
              <span
                class="badge"
                :class="selectedUser.status === 'active' ? 'bg-success' : 'bg-warning'"
              >
                {{ selectedUser.status }}
              </span>
            </div>
            <div class="detail-row">
              <label>Email Verified:</label>
              <span class="badge" :class="selectedUser.emailVerified ? 'bg-success' : 'bg-danger'">
                {{ selectedUser.emailVerified ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="detail-row">
              <label>Provider:</label>
              <span>{{ selectedUser.provider }}</span>
            </div>
            <div class="detail-row">
              <label>Created:</label>
              <span>{{ formatDate(selectedUser.createdAt) }}</span>
            </div>
            <div class="detail-row" v-if="selectedUser.lastSignIn">
              <label>Last Sign In:</label>
              <span>{{ formatDate(selectedUser.lastSignIn) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="editUser(selectedUser)" class="btn btn-primary">
            <i class="fas fa-edit me-1"></i>Edit User
          </button>
          <button @click="deleteUser(selectedUser)" class="btn btn-danger">
            <i class="fas fa-trash me-1"></i>Delete User
          </button>
        </div>
      </div>
    </div>

    <!-- Post Details Modal -->
    <div v-if="selectedPost" class="modal-overlay" @click="closePostModal">
      <div class="post-modal" @click.stop>
        <div class="modal-header">
          <h3>Post Details</h3>
          <button @click="closePostModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="post-details">
            <div class="detail-row">
              <label>ID:</label>
              <span>{{ selectedPost.id }}</span>
            </div>
            <div class="detail-row">
              <label>Title:</label>
              <span>{{ selectedPost.title }}</span>
            </div>
            <div class="detail-row">
              <label>Content:</label>
              <span class="post-content">{{ selectedPost.content }}</span>
            </div>
            <div class="detail-row">
              <label>Author:</label>
              <span>{{ selectedPost.author }}</span>
            </div>
            <div class="detail-row">
              <label>Category:</label>
              <span>{{ selectedPost.category }}</span>
            </div>
            <div class="detail-row">
              <label>Status:</label>
              <span class="badge bg-success">{{ selectedPost.status }}</span>
            </div>
            <div class="detail-row" v-if="selectedPost.createdAt">
              <label>Created:</label>
              <span>{{ formatDate(selectedPost.createdAt) }}</span>
            </div>
            <div class="detail-row" v-if="selectedPost.updatedAt">
              <label>Updated:</label>
              <span>{{ formatDate(selectedPost.updatedAt) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closePostModal" class="btn btn-primary">
            <i class="fas fa-edit me-1"></i>Edit Post
          </button>
          <button @click="closePostModal" class="btn btn-danger">
            <i class="fas fa-trash me-1"></i>Delete Post
          </button>
        </div>
      </div>
    </div>

    <!-- System Settings -->
    <section class="system-settings">
      <div class="container">
        <h2>System Settings</h2>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="settings-card">
              <h3>General Settings</h3>
              <div class="mb-3">
                <label class="form-label">Site Name</label>
                <input v-model="settings.siteName" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Maintenance Mode</label>
                <div class="form-check form-switch">
                  <input
                    v-model="settings.maintenanceMode"
                    class="form-check-input"
                    type="checkbox"
                  />
                  <label class="form-check-label">Enable maintenance mode</label>
                </div>
              </div>
              <button @click="saveSettings" class="btn btn-primary">Save Settings</button>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="settings-card">
              <h3>Security Settings</h3>
              <div class="mb-3">
                <label class="form-label">Session Timeout (minutes)</label>
                <input v-model="settings.sessionTimeout" type="number" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Password Policy</label>
                <select v-model="settings.passwordPolicy" class="form-select">
                  <option value="basic">Basic</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
              <button @click="saveSecuritySettings" class="btn btn-primary">Save Security</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #f0fff4 0%, #e8f5e8 100%);
  min-height: 100vh;
}

.section-title {
  color: #2d5a3d;
  font-weight: 600;
}

.btn-success {
  background-color: #4caf50;
  border-color: #4caf50;
  color: white;
}

.btn-success:hover {
  background-color: #45a049;
  border-color: #45a049;
}

.btn-outline-primary {
  color: #2d5a3d;
  border-color: #2d5a3d;
}

.btn-outline-primary:hover {
  background-color: #2d5a3d;
  border-color: #2d5a3d;
  color: white;
}

.btn-danger {
  background-color: #f44336;
  border-color: #f44336;
}

.btn-danger:hover {
  background-color: #da190b;
  border-color: #da190b;
}

.action-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(76, 175, 80, 0.2);
}

.action-icon {
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 1rem;
}

.settings-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.modal-overlay {
  background: rgba(45, 90, 61, 0.8);
}

.user-modal,
.post-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.loading-state,
.no-users-state,
.no-posts-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}
</style>
