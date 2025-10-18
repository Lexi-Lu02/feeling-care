// Email Service for sending emails with attachments using SendGrid
// Note: For production, consider using a backend API to keep API keys secure

/**
 * Sends an email with optional attachments using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} from - Sender email address (must be verified in SendGrid)
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content of the email
 * @param {string} html - HTML content of the email
 * @param {Array<Object>} attachments - Array of attachment objects
 * @returns {Promise<Object>} - Result object with success status and message
 */
export const sendEmailWithAttachment = async (to, from, subject, text, html, attachments = []) => {
  try {
    // For client-side implementation, we'll use a simple fetch to a backend endpoint
    // This keeps the SendGrid API key secure on the server
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        from,
        subject,
        text,
        html,
        attachments,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Email sent successfully!')
      return { success: true, message: 'Email sent successfully!' }
    } else {
      console.error('Error sending email:', result.error)
      return { success: false, message: result.error || 'Failed to send email.' }
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

/**
 * Sends a simple email without attachments
 * @param {string} to - Recipient email address
 * @param {string} from - Sender email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content
 * @returns {Promise<Object>} - Result object with success status and message
 */
export const sendSimpleEmail = async (to, from, subject, text, html) => {
  return await sendEmailWithAttachment(to, from, subject, text, html, [])
}

/**
 * Converts a file to base64 for email attachment
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data:type;base64, prefix
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gets file MIME type based on file extension
 * @param {string} filename - The filename
 * @returns {string} - MIME type
 */
export const getMimeType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase()
  const mimeTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
  }
  return mimeTypes[extension] || 'application/octet-stream'
}
