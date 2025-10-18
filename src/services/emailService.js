// Email Service for sending emails with attachments using SendGrid
// Uses a secure backend endpoint (/send-email) hosted on Cloudflare Functions

/**
 * Sends an email with optional attachments through the Cloudflare backend
 * @param {string} to - Recipient email address
 * @param {string} from - Sender email address (must be verified in SendGrid)
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content of the email
 * @param {string} html - HTML content of the email
 * @param {Array<Object>} attachments - Optional array of attachment objects
 * @returns {Promise<Object>} - Result object with success status and message
 */
export const sendEmailWithAttachment = async (to, from, subject, text, html, attachments = []) => {
  try {
    console.log('📧 Attempting to send email:', { to, from, subject })

    // Cloudflare functions are exposed at the root (not /api/)
    const response = await fetch('/send-email', {
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

    console.log('📡 Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errText = await response.text()
      console.error('❌ Server error response:', errText)
      throw new Error(`Email send failed: ${errText}`)
    }

    console.log('✅ Email sent successfully!')
    return { success: true, message: 'Email sent successfully!' }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return {
      success: false,
      message: error.message || 'Network error. Please try again later.',
    }
  }
}

/**
 * Sends a simple email without attachments
 */
export const sendSimpleEmail = async (to, from, subject, text, html) => {
  return await sendEmailWithAttachment(to, from, subject, text, html, [])
}

/**
 * Converts a file to Base64 for attachment upload
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // remove data:... prefix
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Validates an email address format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Returns MIME type based on file extension
 */
export const getMimeType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  const types = {
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
  return types[ext] || 'application/octet-stream'
}
