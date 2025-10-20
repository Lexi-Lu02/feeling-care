<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../services/firebaseService'
import {
  getCurrentUser,
  isAdmin,
  getAllUsers,
  updateUserRole,
  cleanupUserData,
} from '../services/authService'
import { userManagementService } from '../services/userManagementService'
import InteractiveTable from '../components/InteractiveTable.vue'

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Check if user is admin (async)
const checkAdminAccess = async () => {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) {
    window.location.href = '/auth'
  }
}

// Run admin check on component mount
checkAdminAccess()

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
    icon: '👑',
    title: 'Admin Management',
    description: 'Assign or remove admin roles from users',
    buttonText: 'Manage Admins',
    handler: openAdminManagement,
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

// Admin Management Data
const showAdminManagement = ref(false)
const adminUsers = ref([])
const isLoadingAdmins = ref(false)
const adminMessage = ref('')
const adminMessageType = ref('')

// Real-time listener unsubscribe functions
let usersUnsubscribe = null
let postsUnsubscribe = null

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

// Edit user role functionality (prompts for new role)
const editUserRole = async (user) => {
  // Check if role can be modified
  if (!user.canModifyRole) {
    alert('Admin roles cannot be changed for admin email addresses')
    return
  }

  const newRole = prompt(`Enter new role for ${user.email || user.username}:`, user.role || 'user')
  if (newRole && newRole !== user.role) {
    const result = await updateUserRole(user.id, newRole, user.email)
    if (result.success) {
      alert(result.message)
      await loadUsers() // Refresh the users list
    } else {
      alert(result.message)
    }
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

// Admin Management Functions
const loadAdminUsers = async () => {
  isLoadingAdmins.value = true
  try {
    const allUsers = await getAllUsers()
    adminUsers.value = allUsers
  } catch (error) {
    console.error('Error loading admin users:', error)
    showMessage('Failed to load users', 'error')
  } finally {
    isLoadingAdmins.value = false
  }
}

const toggleAdminRole = async (user) => {
  try {
    // Check if role can be modified
    if (!user.canModifyRole) {
      showMessage('Admin roles cannot be changed for admin email addresses', 'error')
      return
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const result = await updateUserRole(user.id, newRole, user.email)

    if (result.success) {
      showMessage(result.message, 'success')
      await loadAdminUsers() // Refresh the list
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    console.error('Error toggling admin role:', error)
    showMessage('Failed to update admin role', 'error')
  }
}

const showMessage = (message, type) => {
  adminMessage.value = message
  adminMessageType.value = type
  setTimeout(() => {
    adminMessage.value = ''
    adminMessageType.value = ''
  }, 3000)
}

const openAdminManagement = async () => {
  showAdminManagement.value = true
  await loadAdminUsers()
}

const editUser = (user) => {
  // Edit user functionality - could open a modal or navigate to edit page
  console.log('Edit user:', user)
  alert(`Edit user functionality for: ${user.username}`)
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete user: ${user.username}?`)) {
    try {
      // Call secure backend cleanup (deletes Auth user if exists + Firestore docs)
      const result = await cleanupUserData(user.id)
      alert(result.success ? 'User and data cleaned up successfully' : `Error: ${result.message}`)
      if (result.success) {
        await loadUsers()
        closeUserModal()
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
  // Set up real-time listener for users collection
  usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  })

  // Set up real-time listener for posts collection
  postsUnsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
    posts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  })
})

// Clean up the listeners when component is unmounted
onUnmounted(() => {
  if (usersUnsubscribe) {
    usersUnsubscribe()
  }
  if (postsUnsubscribe) {
    postsUnsubscribe()
  }
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

    <!-- Admin Management Modal -->
    <div v-if="showAdminManagement" class="modal-overlay" @click="showAdminManagement = false">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-crown me-2"></i>
              Admin Role Management
            </h5>
            <button type="button" class="btn-close" @click="showAdminManagement = false"></button>
          </div>
          <div class="modal-body">
            <!-- Message Display -->
            <div
              v-if="adminMessage"
              :class="`alert alert-${adminMessageType === 'success' ? 'success' : 'danger'}`"
            >
              {{ adminMessage }}
            </div>

            <!-- Loading State -->
            <div v-if="isLoadingAdmins" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading users...</p>
            </div>

            <!-- Users List -->
            <div v-else-if="adminUsers.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in adminUsers" :key="user.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2">
                          {{ (user.displayName || user.email || 'U').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="fw-bold">{{ user.displayName || 'No Name' }}</div>
                          <small class="text-muted">ID: {{ user.id }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span :class="`badge ${getRoleBadgeClass(user.role)}`">
                        {{ user.role || 'user' }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="user.canModifyRole"
                        @click="toggleAdminRole(user)"
                        :class="`btn btn-sm ${user.role === 'admin' ? 'btn-warning' : 'btn-success'}`"
                        :disabled="user.id === currentUser?.uid"
                      >
                        <i
                          :class="`fas ${user.role === 'admin' ? 'fa-user-minus' : 'fa-user-plus'} me-1`"
                        ></i>
                        {{ user.role === 'admin' ? 'Remove Admin' : 'Make Admin' }}
                      </button>
                      <span v-else class="badge bg-secondary">
                        <i class="fas fa-lock me-1"></i>
                        Immutable
                      </span>
                      <small v-if="user.id === currentUser?.uid" class="text-muted d-block">
                        (Cannot modify your own role)
                      </small>
                      <small v-else-if="!user.canModifyRole" class="text-muted d-block">
                        (Admin email - role cannot be changed)
                      </small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- No Users State -->
            <div v-else class="text-center py-4">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <p class="text-muted">No users found</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAdminManagement = false">
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="loadAdminUsers"
              :disabled="isLoadingAdmins"
            >
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoadingAdmins }"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
