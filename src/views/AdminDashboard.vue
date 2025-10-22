<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../services/firebaseService'
import {
  getCurrentUser,
  isAdmin,
  getAllUsers,
  updateUserRole,
  cleanupUserData,
} from '../services/authService'
import {
  createPost,
  updatePost,
  deletePost as deletePostFromFirestore,
  initializePostsListener,
  cleanupPostsListener,
  allPosts,
} from '../services/firestoreBlogService'
import { imageUploadService } from '../services/imageUploadService'
import { sendSimpleEmail } from '../services/emailService'
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
      // Scroll to User Management section
      const userManagementSection = document.querySelector('.user-management')
      if (userManagementSection) {
        userManagementSection.scrollIntoView({ behavior: 'smooth' })
      }
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
    icon: '📧',
    title: 'Bulk Email',
    description: 'Send emails to selected user roles',
    buttonText: 'Send Emails',
    handler: () => {
      // Scroll to Bulk Email section
      const bulkEmailSection = document.querySelector('.bulk-email-section')
      if (bulkEmailSection) {
        bulkEmailSection.scrollIntoView({ behavior: 'smooth' })
      }
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
])

// User Management Data
const users = ref([])
const isLoadingUsers = ref(false)
const selectedUser = ref(null)

// Real-time listener unsubscribe functions
let usersUnsubscribe = null

// Posts Management Data - use allPosts from firestoreBlogService
const isLoadingPosts = ref(false)
const selectedPost = ref(null)

// User table columns configuration - aligned with database structure
const userColumns = ref([
  { key: 'email', label: 'Email', sortable: true, searchable: true },
  { key: 'displayName', label: 'Display Name', sortable: true, searchable: true },
  { key: 'role', label: 'Role', sortable: true, searchable: true },
  { key: 'postCount', label: 'Posts', sortable: true, searchable: false },
  { key: 'disabled', label: 'Status', sortable: true, searchable: true },
  { key: 'createdAt', label: 'Created', sortable: true, searchable: true, type: 'date' },
  { key: 'actions', label: 'Actions', sortable: false, searchable: false, type: 'actions' },
])

// Posts table columns configuration - enhanced for better management
const postColumns = ref([
  { key: 'title', label: 'Title', sortable: true, searchable: true },
  { key: 'author', label: 'Author', sortable: true, searchable: true },
  { key: 'status', label: 'Status', sortable: true, searchable: true },
  { key: 'featured', label: 'Featured', sortable: true, searchable: false },
  { key: 'tags', label: 'Tags', sortable: false, searchable: true },
  { key: 'publishedAt', label: 'Published', sortable: true, searchable: true, type: 'date' },
  { key: 'actions', label: 'Actions', sortable: false, searchable: false, type: 'actions' },
])

// System Settings
const settings = ref({
  siteName: 'Feeling Care',
  maintenanceMode: false,
  sessionTimeout: 30,
  passwordPolicy: 'medium',
})

// Bulk Email Data
const bulkEmailForm = ref({
  subject: '',
  message: '',
  selectedRole: '',
  emailType: 'maintenance', // maintenance, announcement, system
  fromEmail: 'admin@feelingcare.com',
})

const isSendingBulkEmail = ref(false)
const bulkEmailStatus = ref('')
const availableRoles = ref([
  { value: 'all', label: 'All Users', description: 'Send to all registered users' },
  {
    value: 'myself',
    label: 'For Myself',
    description: 'Send to users who selected "For Myself"',
  },
  {
    value: 'someone-else',
    label: 'For Someone Else',
    description: 'Send to users who selected "For Someone Else"',
  },
])
const emailTemplates = ref({
  maintenance: {
    subject: 'Website Maintenance Notice',
    message:
      'We will be performing scheduled maintenance on our website. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
  },
  announcement: {
    subject: 'Important Announcement',
    message:
      'We have an important announcement to share with our community. Please read the following information carefully.',
  },
  system: {
    subject: 'System Update',
    message:
      'We have updated our system with new features and improvements. Please log in to explore the new functionality.',
  },
})

// User management methods
const loadUsers = async () => {
  isLoadingUsers.value = true
  try {
    const userData = await getAllUsers()
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
const refreshPosts = () => {
  // Force refresh by reinitializing the listener
  initializePostsListener()
}

// Delete post functionality
const deletePost = async (post) => {
  if (confirm(`Are you sure you want to delete post: "${post.title}"?`)) {
    try {
      // Delete associated image from Firebase Storage if it exists
      if (post.imagePath) {
        const imageDeleteResult = await imageUploadService.deleteImage(post.imagePath)
        if (!imageDeleteResult.success) {
          console.warn('Failed to delete image from storage:', imageDeleteResult.error)
          // Continue with post deletion even if image deletion fails
        }
      }

      const result = await deletePostFromFirestore(post.id)
      if (result.success) {
        alert('Post deleted successfully')
        // Real-time listener will automatically update the posts list
      } else {
        alert('Failed to delete post: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }
}

// Publish post functionality
const publishPost = async (post) => {
  try {
    const result = await updatePost(post.id, {
      ...post,
      status: 'published',
      publishedAt: new Date(),
    })
    if (result.success) {
      alert(
        'Post published successfully! It will now be visible on the Information & Resources page.',
      )
      // Real-time listener will automatically update the posts list
    } else {
      alert('Failed to publish post: ' + result.error)
    }
  } catch (error) {
    console.error('Error publishing post:', error)
    alert('Failed to publish post')
  }
}

// Post management modal state
const showPostModal = ref(false)
const isEditingPost = ref(false)
const currentPost = ref({
  title: '',
  author: '',
  authorId: '',
  excerpt: '',
  content: '',
  tags: [],
  image: '',
  status: 'draft',
  featured: false,
})

// Open post modal for editing
const openPostModal = (post) => {
  if (post) {
    currentPost.value = { ...post }
    isEditingPost.value = true
  } else {
    currentPost.value = {
      title: '',
      author: '',
      authorId: getCurrentUser()?.uid || '',
      excerpt: '',
      content: '',
      tags: [],
      image: '',
      status: 'draft',
      featured: false,
    }
    isEditingPost.value = false
  }
  showPostModal.value = true
}

// Close post modal
const closePostModal = () => {
  showPostModal.value = false
  currentPost.value = {
    title: '',
    author: '',
    authorId: '',
    excerpt: '',
    content: '',
    tags: [],
    image: '',
    status: 'draft',
    featured: false,
  }
}

// Save post (create or update)
const savePost = async () => {
  try {
    if (!currentPost.value.title || !currentPost.value.excerpt) {
      alert('Please fill in required fields (title and excerpt)')
      return
    }

    let result
    if (isEditingPost.value) {
      result = await updatePost(currentPost.value.id, currentPost.value)
    } else {
      result = await createPost(currentPost.value)
    }

    if (result.success) {
      alert(isEditingPost.value ? 'Post updated successfully' : 'Post created successfully')
      closePostModal()
      // Real-time listener will automatically update the posts list
    } else {
      alert('Failed to save post: ' + result.error)
    }
  } catch (error) {
    console.error('Error saving post:', error)
    alert('Failed to save post')
  }
}

// Add tag to current post
const addTag = () => {
  const tagInput = document.getElementById('tagInput')
  if (tagInput && tagInput.value.trim()) {
    if (!currentPost.value.tags.includes(tagInput.value.trim())) {
      currentPost.value.tags.push(tagInput.value.trim())
    }
    tagInput.value = ''
  }
}

// Remove tag from current post
const removeTag = (tagToRemove) => {
  currentPost.value.tags = currentPost.value.tags.filter((tag) => tag !== tagToRemove)
}

// Edit user role functionality (prompts for new role)
const editUserRole = async (user) => {
  // Check if role can be modified - admin emails cannot be changed
  if (!user.canModifyRole) {
    alert('Admin roles cannot be changed for admin email addresses')
    return
  }

  const newRole = prompt(
    `Enter new role for ${user.email || user.displayName}:`,
    user.role || 'user',
  )
  if (newRole && newRole !== user.role) {
    try {
      const result = await updateUserRole(user.uid, newRole)
      if (result.success) {
        alert(result.message)
        await loadUsers() // Refresh the users list
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Error updating user role. Please try again.')
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
  exportToCSV(allPosts.value, 'posts.csv')
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

// Bulk Email Methods
const loadEmailTemplate = () => {
  const template = emailTemplates.value[bulkEmailForm.value.emailType]
  if (template) {
    bulkEmailForm.value.subject = template.subject
    bulkEmailForm.value.message = template.message
  }
}

const getUsersByRoles = (selectedRole) => {
  switch (selectedRole) {
    case 'all':
      return users.value
    case 'myself':
      return users.value.filter((user) => user.role === 'myself')
    case 'someone-else':
      return users.value.filter((user) => user.role === 'someone-else')
    default:
      return []
  }
}

const sendBulkEmail = async () => {
  if (!bulkEmailForm.value.subject || !bulkEmailForm.value.message) {
    alert('Please fill in both subject and message')
    return
  }

  if (!bulkEmailForm.value.selectedRole) {
    alert('Please select a target audience')
    return
  }

  const targetUsers = getUsersByRoles(bulkEmailForm.value.selectedRole)

  if (targetUsers.length === 0) {
    alert('No users found with the selected roles')
    return
  }

  if (!confirm(`Are you sure you want to send this email to ${targetUsers.length} users?`)) {
    return
  }

  isSendingBulkEmail.value = true
  bulkEmailStatus.value = 'Sending emails...'

  let successCount = 0
  let errorCount = 0

  try {
    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 5
    for (let i = 0; i < targetUsers.length; i += batchSize) {
      const batch = targetUsers.slice(i, i + batchSize)

      const promises = batch.map(async (user) => {
        try {
          const result = await sendSimpleEmail(
            user.email,
            bulkEmailForm.value.fromEmail,
            bulkEmailForm.value.subject,
            bulkEmailForm.value.message,
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${bulkEmailForm.value.subject}</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                ${bulkEmailForm.value.message.replace(/\n/g, '<br>')}
              </div>
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                FeelingCare Team
              </p>
            </div>`,
            bulkEmailForm.value.fromEmail,
          )

          if (result.success) {
            successCount++
          } else {
            errorCount++
            console.error(`Failed to send email to ${user.email}:`, result.message)
          }
        } catch (error) {
          errorCount++
          console.error(`Error sending email to ${user.email}:`, error)
        }
      })

      await Promise.all(promises)

      // Update status
      bulkEmailStatus.value = `Sent ${successCount + errorCount} of ${targetUsers.length} emails...`

      // Small delay between batches to be respectful to the email service
      if (i + batchSize < targetUsers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    bulkEmailStatus.value = `Bulk email completed! Sent: ${successCount}, Failed: ${errorCount}`

    if (successCount > 0) {
      alert(
        `Bulk email sent successfully!\nSent: ${successCount} emails\nFailed: ${errorCount} emails`,
      )
    } else {
      alert('Failed to send any emails. Please check the console for errors.')
    }
  } catch (error) {
    console.error('Bulk email error:', error)
    bulkEmailStatus.value = 'Error sending bulk emails'
    alert('An error occurred while sending bulk emails. Please try again.')
  } finally {
    isSendingBulkEmail.value = false
  }
}

const resetBulkEmailForm = () => {
  bulkEmailForm.value = {
    subject: '',
    message: '',
    selectedRole: '',
    emailType: 'maintenance',
    fromEmail: 'admin@feelingcare.com',
  }
  bulkEmailStatus.value = ''
}

onMounted(async () => {
  // Set up real-time listener for users collection
  usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map((doc) => {
      const userData = { id: doc.id, ...doc.data() }
      // Add canModifyRole property - admin emails cannot be modified
      const ADMIN_EMAILS = ['admin@feelingcare.com']
      userData.canModifyRole = !ADMIN_EMAILS.includes(userData.email?.toLowerCase())
      return userData
    })
  })

  // Initialize posts listener
  initializePostsListener()
})

// Clean up the listeners when component is unmounted
onUnmounted(() => {
  if (usersUnsubscribe) {
    usersUnsubscribe()
  }
  cleanupPostsListener()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Admin Header -->
    <section class="dashboard-header">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="dashboard-title">Admin Dashboard</h1>
            <p class="dashboard-subtitle">
              Welcome back, {{ currentUser?.displayName || currentUser?.email }}
            </p>
          </div>
          <div class="dashboard-stats">
            <div class="stat-item">
              <span class="stat-number">{{ users?.length || 0 }}</span>
              <span class="stat-label">Total Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ posts?.length || 0 }}</span>
              <span class="stat-label">Total Posts</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Actions -->
    <section class="admin-actions-section">
      <div class="container">
        <h2 class="section-title">Administrative Actions</h2>
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-4"
            v-for="(action, index) in adminActions"
            :key="index"
          >
            <div class="action-card">
              <div class="action-icon">{{ action.icon }}</div>
              <h3 class="action-title">{{ action.title }}</h3>
              <p class="action-description">{{ action.description }}</p>
              <button @click="action.handler" class="btn btn-primary action-btn">
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
            @delete-user="deleteUser"
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
          <div class="section-actions">
            <button @click="openPostModal()" class="btn btn-outline-primary me-2">
              <i class="fas fa-plus me-1"></i>
              Create Post
            </button>
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
              :disabled="!allPosts || allPosts.length === 0"
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
        <div v-else-if="allPosts && allPosts.length > 0">
          <InteractiveTable
            :data="allPosts"
            :columns="postColumns"
            @row-click="openPostModal"
            @delete-post="deletePost"
            @publish-post="publishPost"
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

    <!-- Bulk Email Section -->
    <section class="bulk-email-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-envelope me-2"></i>
            Bulk Email Service
          </h2>
          <p class="section-description">
            Send emails to users based on their roles for maintenance notices, announcements, and
            system updates.
          </p>
        </div>

        <div class="row">
          <div class="col-12 col-lg-8">
            <div class="bulk-email-card">
              <form @submit.prevent="sendBulkEmail">
                <!-- Email Type Selection -->
                <div class="mb-4">
                  <label class="form-label">Email Type</label>
                  <select
                    v-model="bulkEmailForm.emailType"
                    @change="loadEmailTemplate"
                    class="form-select"
                  >
                    <option value="maintenance">Website Maintenance</option>
                    <option value="announcement">Important Announcement</option>
                    <option value="system">System Update</option>
                    <option value="custom">Custom Message</option>
                  </select>
                </div>

                <!-- Target Audience -->
                <div class="mb-4">
                  <label for="targetAudience" class="form-label"
                    >I am sending this email for:</label
                  >
                  <select
                    id="targetAudience"
                    v-model="bulkEmailForm.selectedRole"
                    class="form-select"
                    required
                  >
                    <option value="">Select an option</option>
                    <option v-for="role in availableRoles" :key="role.value" :value="role.value">
                      {{ role.label }}
                    </option>
                  </select>
                  <div v-if="bulkEmailForm.selectedRole" class="mt-2">
                    <small class="text-muted">
                      {{
                        availableRoles.find((r) => r.value === bulkEmailForm.selectedRole)
                          ?.description
                      }}
                      ({{ getUsersByRoles(bulkEmailForm.selectedRole).length }} recipients)
                    </small>
                  </div>
                </div>

                <!-- Subject -->
                <div class="mb-4">
                  <label for="emailSubject" class="form-label">Subject</label>
                  <input
                    type="text"
                    class="form-control"
                    id="emailSubject"
                    v-model="bulkEmailForm.subject"
                    placeholder="Enter email subject"
                    required
                  />
                </div>

                <!-- Message -->
                <div class="mb-4">
                  <label for="emailMessage" class="form-label">Message</label>
                  <textarea
                    class="form-control"
                    id="emailMessage"
                    rows="6"
                    v-model="bulkEmailForm.message"
                    placeholder="Enter your message here..."
                    required
                  ></textarea>
                </div>

                <!-- From Email -->
                <div class="mb-4">
                  <label for="fromEmail" class="form-label">From Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="fromEmail"
                    v-model="bulkEmailForm.fromEmail"
                    required
                  />
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isSendingBulkEmail || !bulkEmailForm.selectedRole"
                  >
                    <i
                      class="fas fa-paper-plane me-1"
                      :class="{ 'fa-spin': isSendingBulkEmail }"
                    ></i>
                    {{ isSendingBulkEmail ? 'Sending...' : 'Send Bulk Email' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="resetBulkEmailForm"
                    :disabled="isSendingBulkEmail"
                  >
                    <i class="fas fa-undo me-1"></i>
                    Reset Form
                  </button>
                </div>

                <!-- Status Display -->
                <div v-if="bulkEmailStatus" class="mt-3">
                  <div
                    class="alert"
                    :class="bulkEmailStatus.includes('Error') ? 'alert-danger' : 'alert-info'"
                  >
                    <i class="fas fa-info-circle me-1"></i>
                    {{ bulkEmailStatus }}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="bulk-email-info">
              <h5>Email Templates</h5>
              <div class="template-list">
                <div class="template-item">
                  <h6>Maintenance Notice</h6>
                  <p>For scheduled maintenance and downtime notifications</p>
                </div>
                <div class="template-item">
                  <h6>Announcement</h6>
                  <p>For important news and community updates</p>
                </div>
                <div class="template-item">
                  <h6>System Update</h6>
                  <p>For new features and system improvements</p>
                </div>
              </div>

              <div class="mt-4">
                <h6>User Statistics</h6>
                <div class="user-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ users.length }}</span>
                    <span class="stat-label">All Users</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{
                      users.filter((user) => user.role === 'myself').length
                    }}</span>
                    <span class="stat-label">For Myself</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{
                      users.filter((user) => user.role === 'someone-else').length
                    }}</span>
                    <span class="stat-label">For Someone Else</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

    <!-- Post Management Modal -->
    <div v-if="showPostModal" class="modal-overlay" @click="closePostModal">
      <div class="modal-dialog modal-xl" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>
              {{ isEditingPost ? 'Edit Post' : 'Create New Post' }}
            </h5>
            <button type="button" class="btn-close" @click="closePostModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePost">
              <div class="row">
                <div class="col-md-8">
                  <!-- Title -->
                  <div class="mb-3">
                    <label for="postTitle" class="form-label">Title *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="postTitle"
                      v-model="currentPost.title"
                      required
                    />
                  </div>

                  <!-- Author -->
                  <div class="mb-3">
                    <label for="postAuthor" class="form-label">Author</label>
                    <input
                      type="text"
                      class="form-control"
                      id="postAuthor"
                      v-model="currentPost.author"
                    />
                  </div>

                  <!-- Excerpt -->
                  <div class="mb-3">
                    <label for="postExcerpt" class="form-label">Excerpt *</label>
                    <textarea
                      class="form-control"
                      id="postExcerpt"
                      rows="3"
                      v-model="currentPost.excerpt"
                      required
                    ></textarea>
                  </div>

                  <!-- Content -->
                  <div class="mb-3">
                    <label for="postContent" class="form-label">Content</label>
                    <textarea
                      class="form-control"
                      id="postContent"
                      rows="10"
                      v-model="currentPost.content"
                    ></textarea>
                  </div>
                </div>

                <div class="col-md-4">
                  <!-- Status -->
                  <div class="mb-3">
                    <label for="postStatus" class="form-label">Status</label>
                    <select class="form-select" id="postStatus" v-model="currentPost.status">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <!-- Featured -->
                  <div class="mb-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="postFeatured"
                        v-model="currentPost.featured"
                      />
                      <label class="form-check-label" for="postFeatured"> Featured Post </label>
                    </div>
                  </div>

                  <!-- Image -->
                  <div class="mb-3">
                    <label for="postImage" class="form-label">Image</label>
                    <input
                      type="text"
                      class="form-control"
                      id="postImage"
                      v-model="currentPost.image"
                      placeholder="image.jpg"
                    />
                  </div>

                  <!-- Tags -->
                  <div class="mb-3">
                    <label class="form-label">Tags</label>
                    <div class="input-group mb-2">
                      <input
                        type="text"
                        class="form-control"
                        id="tagInput"
                        placeholder="Add tag"
                        @keyup.enter="addTag"
                      />
                      <button class="btn btn-outline-secondary" type="button" @click="addTag">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div class="tags-container">
                      <span
                        v-for="tag in currentPost.tags"
                        :key="tag"
                        class="badge bg-primary me-1 mb-1"
                      >
                        {{ tag }}
                        <button
                          type="button"
                          class="btn-close btn-close-white ms-1"
                          @click="removeTag(tag)"
                        ></button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closePostModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="savePost">
              <i class="fas fa-save me-1"></i>
              {{ isEditingPost ? 'Update Post' : 'Create Post' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
