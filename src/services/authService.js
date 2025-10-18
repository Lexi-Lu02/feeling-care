import { firebaseAuthService } from './firebaseService'

// User roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Get current user from Firebase
export const getCurrentUser = () => {
  return firebaseAuthService.getCurrentUser()
}

// Check if user is authenticated using Firebase
export const isAuthenticated = () => {
  return firebaseAuthService.isAuthenticated()
}

// Check if user has specific role (based on email pattern for now)
export const hasRole = (role) => {
  const user = getCurrentUser()
  if (!user) return false

  // For now, determine role based on email pattern
  // In a real app, you'd use Firebase custom claims
  const email = user.email?.toLowerCase() || ''
  if (role === ROLES.ADMIN) {
    return email.includes('admin')
  }
  return true // All other users are regular users
}

// Check if user is admin
export const isAdmin = () => {
  return hasRole(ROLES.ADMIN)
}

// Check if user is regular user
export const isUser = () => {
  return hasRole(ROLES.USER)
}

// Note: Login and signup are now handled by Firebase directly
// These functions are kept for backward compatibility but redirect to Firebase methods

// Logout function using Firebase
export const logout = async () => {
  try {
    await firebaseAuthService.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// Get user permissions based on role
export const getUserPermissions = () => {
  const user = getCurrentUser()

  if (!user) return []

  // Determine role based on email pattern
  const email = user.email?.toLowerCase() || ''
  const isAdminUser = email.includes('admin')

  const permissions = {
    [ROLES.USER]: ['view_resources', 'access_support', 'view_own_profile', 'update_own_profile'],
    [ROLES.ADMIN]: [
      'view_resources',
      'access_support',
      'view_own_profile',
      'update_own_profile',
      'manage_users',
      'view_all_profiles',
      'manage_content',
      'view_analytics',
      'manage_system_settings',
    ],
  }

  return isAdminUser ? permissions[ROLES.ADMIN] : permissions[ROLES.USER]
}

// Check if user has specific permission
export const hasPermission = (permission) => {
  const permissions = getUserPermissions()
  return permissions.includes(permission)
}

// Route guard for admin-only pages
export const requireAdmin = (to, from, next) => {
  if (isAdmin()) {
    next()
  } else {
    next('/auth')
  }
}

// Route guard for authenticated users
export const requireAuth = (to, from, next) => {
  if (isAuthenticated()) {
    next()
  } else {
    next('/auth')
  }
}
