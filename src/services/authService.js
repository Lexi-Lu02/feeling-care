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

// Check if user has specific role (using Firebase custom claims)
export const hasRole = async (role) => {
  const user = getCurrentUser()
  if (!user) return false

  try {
    // Get custom claims from Firebase Auth
    const idTokenResult = await user.getIdTokenResult()
    const claims = idTokenResult.claims

    // Check role from custom claims
    if (role === ROLES.ADMIN) {
      return claims.admin === true || claims.role === 'admin'
    }

    return claims.role === role
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

// Get user role from Firestore
export const getUserRoleFromFirestore = async (uid) => {
  try {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore')
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, 'users', uid))

    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

// Check if user is admin
export const isAdmin = async () => {
  return await hasRole(ROLES.ADMIN)
}

// Check if user is regular user
export const isUser = async () => {
  return await hasRole(ROLES.USER)
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
export const getUserPermissions = async () => {
  const user = getCurrentUser()

  if (!user) return []

  try {
    // Get custom claims from Firebase Auth
    const idTokenResult = await user.getIdTokenResult()
    const claims = idTokenResult.claims
    const userRole = claims.role || ROLES.USER
    const isAdminUser = claims.admin === true || userRole === 'admin'

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
  } catch (error) {
    console.error('Error getting user permissions:', error)
    // Return default user permissions on error
    return ['view_resources', 'access_support', 'view_own_profile', 'update_own_profile']
  }
}

// Check if user has specific permission
export const hasPermission = async (permission) => {
  const permissions = await getUserPermissions()
  return permissions.includes(permission)
}

// Route guard for admin-only pages
export const requireAdmin = async (to, from, next) => {
  if (await isAdmin()) {
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

// Secure admin management functions using Firebase Functions
export const getAllUsers = async () => {
  try {
    const user = getCurrentUser()
    if (!user) return []

    // Get ID token for authentication
    const idToken = await user.getIdToken()

    const response = await fetch('https://listusers-rfheamm3sa-uc.a.run.app', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const users = await response.json()

    // Add canModifyRole flag
    return users.map((user) => ({
      ...user,
      id: user.uid,
      canModifyRole: !user.isAdminEmail,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const updateUserRole = async (userId, newRole) => {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, message: 'Not authenticated' }

    // Get ID token for authentication
    const idToken = await user.getIdToken()

    const response = await fetch('https://updateuserrole-rfheamm3sa-uc.a.run.app', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        newRole,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, message: result.error || 'Failed to update role' }
    }

    return result
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, message: 'Failed to update user role' }
  }
}

export const verifyAdminStatus = async () => {
  try {
    const user = getCurrentUser()
    if (!user) return { isAdmin: false, role: 'user' }

    // Get ID token for authentication
    const idToken = await user.getIdToken()

    const response = await fetch('https://verifyadmin-rfheamm3sa-uc.a.run.app', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return { isAdmin: false, role: 'user' }
    }

    return await response.json()
  } catch (error) {
    console.error('Error verifying admin status:', error)
    return { isAdmin: false, role: 'user' }
  }
}

// Admin-only: cleanup a user's Auth account (if exists) and Firestore data
export const cleanupUserData = async (userId) => {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, message: 'Not authenticated' }

    const idToken = await user.getIdToken()
    const response = await fetch('https://cleanupuserdata-rfheamm3sa-uc.a.run.app', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return { success: false, message: result.error || 'Failed to cleanup user data' }
    }
    return { success: true, ...result }
  } catch (error) {
    console.error('Error cleaning up user data:', error)
    return { success: false, message: 'Failed to cleanup user data' }
  }
}
