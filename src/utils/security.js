/**
 * Sanitize user input for safe display
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;')
}

/**
 * Validate and sanitize file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export function validateFileUpload(file, options = {}) {
  const defaults = {
    maxSize: 10 * 1024 * 1024, // 10MB default
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  }

  const config = { ...defaults, ...options }
  const result = { isValid: true, errors: [] }

  // Check file size
  if (file.size > config.maxSize) {
    result.isValid = false
    result.errors.push(`File size exceeds ${Math.round(config.maxSize / (1024 * 1024))}MB limit`)
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    result.isValid = false
    result.errors.push('Invalid file type')
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase()
  if (!config.allowedExtensions.includes(extension)) {
    result.isValid = false
    result.errors.push('Invalid file extension')
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(file.name)) {
      result.isValid = false
      result.errors.push('Invalid file name')
      break
    }
  }

  return result
}

/**
 * Validate story content
 * @param {string} content - Story content to validate
 * @returns {Object} - Validation result
 */
export function validateStoryContent(content) {
  const result = { isValid: true, errors: [] }

  if (!content || typeof content !== 'string') {
    result.isValid = false
    result.errors.push('Content is required')
    return result
  }

  // Check minimum length
  if (content.trim().length < 10) {
    result.isValid = false
    result.errors.push('Content must be at least 10 characters long')
  }

  // Check maximum length
  if (content.length > 10000) {
    result.isValid = false
    result.errors.push('Content must be less than 10,000 characters')
  }

  // Check for potentially malicious content
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
  ]

  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      result.isValid = false
      result.errors.push('Content contains potentially harmful elements')
      break
    }
  }

  return result
}

/**
 * Validate story title
 * @param {string} title - Story title to validate
 * @returns {Object} - Validation result
 */
export function validateStoryTitle(title) {
  const result = { isValid: true, errors: [] }

  if (!title || typeof title !== 'string') {
    result.isValid = false
    result.errors.push('Title is required')
    return result
  }

  if (title.trim().length < 3) {
    result.isValid = false
    result.errors.push('Title must be at least 3 characters long')
  }

  if (title.length > 200) {
    result.isValid = false
    result.errors.push('Title must be less than 200 characters')
  }

  // Check for potentially malicious content
  const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i]

  for (const pattern of maliciousPatterns) {
    if (pattern.test(title)) {
      result.isValid = false
      result.errors.push('Title contains potentially harmful elements')
      break
    }
  }

  return result
}

/**
 * Rate limiting for form submissions
 */
class RateLimiter {
  constructor() {
    this.attempts = new Map()
    this.maxAttempts = 5
    this.windowMs = 15 * 60 * 1000 // 15 minutes
  }

  isAllowed(identifier) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []

    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter((time) => now - time < this.windowMs)

    if (validAttempts.length >= this.maxAttempts) {
      return false
    }

    // Add current attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)

    return true
  }

  reset(identifier) {
    this.attempts.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
export function generateCSRFToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
