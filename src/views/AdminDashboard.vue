<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, isAdmin } from '../services/authService'
import { userManagementService } from '../services/userManagementService'
import InteractiveTable from '../components/InteractiveTable.vue'

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
              class="btn btn-outline-primary"
              :disabled="isLoadingUsers"
            >
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isLoadingUsers }"></i>
              {{ isLoadingUsers ? 'Loading...' : 'Refresh Users' }}
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
          <InteractiveTable :data="users" :columns="userColumns" @row-click="openUserModal" />
        </div>

        <!-- No Users State -->
        <div v-else class="no-users-state">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h4>No users found</h4>
          <p class="text-muted">There are no users to display at the moment.</p>
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
