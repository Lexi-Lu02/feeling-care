// Handles fetching and managing real Firebase user data securely
// Uses Cloudflare Function `/list-users` as backend endpoint

class UserManagementService {
  constructor() {
    this.users = []
    this.isLoading = false
    this.cacheTimestamp = null
    this.cacheDuration = 5 * 60 * 1000 // cache for 5 minutes
  }

  // Determine if cache is still valid
  isCacheValid() {
    if (!this.cacheTimestamp) return false
    const now = Date.now()
    return now - this.cacheTimestamp < this.cacheDuration
  }

  // Get role from email pattern (admin vs user)
  getUserRole(email) {
    if (!email) return 'user'
    if (email.includes('admin') || email.includes('feelingcare.com')) return 'admin'
    return 'user'
  }

  // Determine user account status
  getUserStatus(user) {
    if (!user) return 'inactive'
    if (user.disabled) return 'inactive'
    return user.emailVerified ? 'active' : 'pending'
  }

  // Format raw Firebase user for UI display
  formatUserData(user) {
    return {
      id: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'Unknown',
      email: user.email || 'No email',
      role: this.getUserRole(user.email),
      status: this.getUserStatus(user),
      createdAt: user.creationTime ? new Date(user.creationTime) : new Date(),
      lastSignIn: user.lastSignInTime ? new Date(user.lastSignInTime) : null,
      emailVerified: user.emailVerified || false,
      provider: user.providerData?.[0]?.providerId || 'email',
    }
  }

  //  Fetch all users from Cloudflare Function (with caching)
  async fetchAllUsers() {
    if (this.isCacheValid()) {
      console.log('✅ Using cached user data.')
      return this.users
    }

    this.isLoading = true
    try {
      const response = await fetch('/list-users')
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`)

      const data = await response.json()
      const formattedUsers = (data.users || []).map((u) => this.formatUserData(u))

      this.users = formattedUsers
      this.cacheTimestamp = Date.now()

      console.log(`✅ Loaded ${formattedUsers.length} users from Firebase`)
      return formattedUsers
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      return []
    } finally {
      this.isLoading = false
    }
  }

  //  Get users (used by AdminDashboard)
  async getUsers(forceRefresh = false) {
    if (!forceRefresh && this.users.length && this.isCacheValid()) {
      return this.users
    }
    return await this.fetchAllUsers()
  }

  //  Update user role (UI-only simulation, backend needed for persistence)
  async updateUserRole(userId, newRole) {
    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return { success: false, message: 'User not found' }

    this.users[userIndex].role = newRole
    return { success: true, message: 'User role updated locally (no backend persistence yet)' }
  }

  //  Toggle active/inactive status
  async toggleUserStatus(userId) {
    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return { success: false, message: 'User not found' }

    const currentStatus = this.users[userIndex].status
    this.users[userIndex].status = currentStatus === 'active' ? 'inactive' : 'active'

    return {
      success: true,
      message: `User ${this.users[userIndex].status === 'active' ? 'activated' : 'deactivated'} successfully`,
    }
  }

  //  Delete user (UI-only simulation)
  async deleteUser(userId) {
    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return { success: false, message: 'User not found' }

    this.users.splice(userIndex, 1)
    return { success: true, message: 'User removed from list (not deleted on backend)' }
  }
}

export const userManagementService = new UserManagementService()
