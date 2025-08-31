// User roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Default users for demonstration
const defaultUsers = [
  {
    username: 'admin',
    email: 'admin@feelingcare.com',
    password: 'Admin123',
    role: ROLES.ADMIN,
  },
  {
    username: 'user',
    email: 'user@feelingcare.com',
    password: 'User123',
    role: ROLES.USER,
  },
]

// Get current user from localStorage
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getCurrentUser()
  return user && user.isAuthenticated
}

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser()
  return user && user.role === role
}

// Check if user is admin
export const isAdmin = () => {
  return hasRole(ROLES.ADMIN)
}

// Check if user is regular user
export const isUser = () => {
  return hasRole(ROLES.USER)
}

// Login function
export const login = async (email, password) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check against default users (in real app, this would be an API call)
  const user = defaultUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
      isAuthenticated: true,
    }

    localStorage.setItem('user', JSON.stringify(userData))
    return { success: true, user: userData }
  } else {
    throw new Error('Invalid email or password')
  }
}

// Signup function
export const signup = async (username, email, password, role) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  const existingUser = defaultUsers.find((u) => u.email === email || u.username === username)

  if (existingUser) {
    throw new Error('User already exists with this email or username')
  }

  // Create new user (in real app, this would be saved to database)
  const newUser = {
    username,
    email,
    password,
    role: role || ROLES.USER,
  }

  defaultUsers.push(newUser)

  const userData = {
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    isAuthenticated: true,
  }

  localStorage.setItem('user', JSON.stringify(userData))
  return { success: true, user: userData }
}

// Logout function
export const logout = () => {
  localStorage.removeItem('user')
  return { success: true }
}

// Get user permissions based on role
export const getUserPermissions = () => {
  const user = getCurrentUser()

  if (!user) return []

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

  return permissions[user.role] || []
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
