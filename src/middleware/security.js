/**
 * Sanitize route parameters to prevent injection attacks
 * @param {Object} params - Route parameters
 * @returns {Object} - Sanitized parameters
 */
export function sanitizeRouteParams(params) {
  const sanitized = {}

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/[<>]/g, '')
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Validate route parameters
 * @param {Object} params - Route parameters
 * @returns {boolean} - Whether parameters are valid
 */
export function validateRouteParams(params) {
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Check for SQL injection patterns
      const sqlPatterns = [
        /('|(\\')|(;)|(\-\-)|(\s*(\/\*|\*\/)))/i,
        /(union|select|insert|update|delete|drop|create|alter)/i,
      ]

      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          console.warn(`Potential SQL injection detected in route param ${key}:`, value)
          return false
        }
      }

      // Check for XSS patterns
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
      ]

      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          console.warn(`Potential XSS detected in route param ${key}:`, value)
          return false
        }
      }
    }
  }

  return true
}

/**
 * Security guard for route navigation
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Next function
 */
export function securityGuard(to, from, next) {
  try {
    const isProduction = import.meta.env.MODE === 'production'

    // In development, only log security events without blocking
    if (!isProduction) {
      // Use setTimeout to avoid DOM-related errors during component updates
      setTimeout(() => {
        console.log('Route navigation:', to.path, to.params, to.query)
      }, 0)
    }

    // Sanitize route parameters
    if (to.params) {
      const sanitizedParams = sanitizeRouteParams(to.params)

      // Validate sanitized parameters (strict in production, warning in development)
      if (!validateRouteParams(sanitizedParams)) {
        if (isProduction) {
          console.error('Invalid route parameters detected')
          next('/') // Redirect to home on security violation
          return
        } else {
          console.warn('Invalid route parameters detected in development:', to.params)
        }
      }

      // Update route with sanitized parameters
      to.params = sanitizedParams
    }

    // Validate query parameters
    if (to.query) {
      if (!validateRouteParams(to.query)) {
        if (isProduction) {
          console.error('Invalid query parameters detected')
          next('/') // Redirect to home on security violation
          return
        } else {
          console.warn('Invalid query parameters detected in development:', to.query)
        }
      }
    }

    // Check for admin routes
    if (to.path.startsWith('/admin')) {
      console.log('Admin route access attempt:', to.path)
    }

    next()
  } catch (error) {
    console.error('Security guard error:', error)
    // In development, continue navigation even on errors
    if (import.meta.env.MODE === 'production') {
      next('/') // Redirect to home on error
    } else {
      console.warn('Security guard error in development, continuing navigation')
      next()
    }
  }
}

/**
 * Content Security Policy violation handler
 */
export function setupCSPViolationHandler() {
  if (typeof window !== 'undefined') {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error('CSP Violation:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber,
        columnNumber: e.columnNumber,
      })
    })
  }
}

/**
 * Initialize security measures
 */
export function initializeSecurity() {
  setupCSPViolationHandler()

  // Only apply restrictive measures in production
  const isProduction = import.meta.env.MODE === 'production'

  if (isProduction) {
    // Disable right-click context menu in production
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
        return false
      }
    })
  } else {
    // log security events
    console.log('Security middleware initialized in development mode')
  }
}
