<template>
  <div class="about-us-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <h1 class="hero-title">About Feeling Care</h1>
            <p class="hero-description">
              We are dedicated to providing comprehensive mental health support, resources, and
              community connections for individuals and families navigating mental health
              challenges.
            </p>
          </div>
          <div class="col-12 col-lg-4">
            <div class="hero-icon">
              <img src="/images/icon/group.png" alt="Group" class="hero-group-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision and Goals Section -->
    <section class="vision-goals-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h2 class="section-title">Our Vision & Goals</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="vision-card">
              <div class="card-icon">
                <img src="/images/icon/vision.png" alt="Vision" class="card-icon-image" />
              </div>
              <h3>Our Vision</h3>
              <p>
                To create a world where mental health is openly discussed, understood, and
                supported, where no one feels alone in their journey toward wellness and recovery.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="goals-card">
              <div class="card-icon">
                <img src="/images/icon/goal.png" alt="Goals" class="card-icon-image" />
              </div>
              <h3>Our Goals</h3>
              <ul>
                <li>Reduce mental health stigma through education and awareness</li>
                <li>Provide accessible mental health resources and support</li>
                <li>Build a supportive community for individuals and families</li>
                <li>Connect people with professional mental health services</li>
                <li>Promote mental wellness and preventive care</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News and Media Section -->
    <section class="news-media-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h2 class="section-title">News & Media</h2>
            <p class="section-subtitle">
              Stay updated with the latest news, events, and media coverage
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <div class="news-card">
              <div class="news-image">
                <img src="/images/blog/102.jpg" alt="Mental Health Awareness" class="img-fluid" />
              </div>
              <div class="news-content">
                <div class="news-date">March 15, 2024</div>
                <h4>Mental Health Awareness Month Launch</h4>
                <p>
                  Join us as we kick off Mental Health Awareness Month with special events,
                  resources, and community activities throughout the month.
                </p>
                <a href="#" class="news-link">Read More</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="news-card">
              <div class="news-image">
                <img src="/images/blog/108.jpg" alt="Community Support" class="img-fluid" />
              </div>
              <div class="news-content">
                <div class="news-date">February 28, 2024</div>
                <h4>New Community Support Groups</h4>
                <p>
                  We're excited to announce the launch of new peer support groups for anxiety,
                  depression, and family support.
                </p>
                <a href="#" class="news-link">Read More</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="news-card">
              <div class="news-image">
                <img src="/images/blog/112.jpg" alt="Professional Training" class="img-fluid" />
              </div>
              <div class="news-content">
                <div class="news-date">February 10, 2024</div>
                <h4>Professional Training Program</h4>
                <p>
                  Our new training program for mental health professionals is now accepting
                  applications for the spring cohort.
                </p>
                <a href="#" class="news-link">Read More</a>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-12 text-center">
            <button class="btn btn-primary btn-lg">View All News</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Us Section -->
    <section class="contact-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h2 class="section-title">Contact Us</h2>
            <p class="section-subtitle">
              Get in touch with us for support, questions, or to learn more about our services
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8">
            <div class="email-composer">
              <div class="email-header">
                <h3><i class="fas fa-envelope me-2"></i>Compose Email</h3>
                <div class="email-actions">
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="saveDraft">
                    <i class="fas fa-save me-1"></i>Save Draft
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="clearForm">
                    <i class="fas fa-eraser me-1"></i>Clear
                  </button>
                </div>
              </div>

              <form @submit.prevent="submitEmailForm">
                <!-- To and From Fields Row -->
                <div class="email-fields-row">
                  <div class="email-field">
                    <label for="to" class="email-label">To *</label>
                    <input
                      type="email"
                      id="to"
                      v-model="emailForm.to"
                      class="form-control email-input"
                      required
                      placeholder="recipient@example.com"
                      multiple
                    />
                  </div>

                  <div class="email-field">
                    <label for="from" class="email-label">From *</label>
                    <input
                      type="email"
                      id="from"
                      v-model="emailForm.from"
                      class="form-control email-input"
                      required
                      placeholder="your-email@example.com"
                    />
                  </div>
                </div>

                <!-- CC and BCC Fields Row -->
                <div class="email-fields-row">
                  <div class="email-field">
                    <label for="cc" class="email-label">CC</label>
                    <input
                      type="email"
                      id="cc"
                      v-model="emailForm.cc"
                      class="form-control email-input"
                      placeholder="cc@example.com (optional)"
                      multiple
                    />
                  </div>

                  <div class="email-field">
                    <label for="bcc" class="email-label">BCC</label>
                    <input
                      type="email"
                      id="bcc"
                      v-model="emailForm.bcc"
                      class="form-control email-input"
                      placeholder="bcc@example.com (optional)"
                      multiple
                    />
                  </div>
                </div>

                <!-- Subject Field -->
                <div class="email-field">
                  <label for="subject" class="email-label">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    v-model="emailForm.subject"
                    class="form-control email-input"
                    required
                    maxlength="200"
                    placeholder="Enter email subject..."
                  />
                </div>
                <!-- Message Field -->
                <div class="email-field">
                  <label class="email-label">Message *</label>
                  <textarea
                    id="message"
                    v-model="emailForm.message"
                    class="form-control message-textarea"
                    rows="12"
                    required
                    maxlength="5000"
                    placeholder="Compose your message here..."
                  ></textarea>
                  <div class="message-toolbar">
                    <div class="toolbar-left">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="insertSignature"
                      >
                        <i class="fas fa-signature me-1"></i>Signature
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="clearMessage"
                      >
                        <i class="fas fa-eraser me-1"></i>Clear
                      </button>
                      <div class="format-toggle">
                        <label class="switch">
                          <input type="checkbox" v-model="emailForm.isHtml" />
                          <span class="slider round"></span>
                        </label>
                        <span class="format-label">{{
                          emailForm.isHtml ? 'HTML' : 'Plain Text'
                        }}</span>
                      </div>
                    </div>
                    <div class="toolbar-right">
                      <span class="character-count"
                        >{{ emailForm.message.length }}/5000 characters</span
                      >
                    </div>
                  </div>
                </div>
                <!-- File Attachments -->
                <div class="email-field">
                  <label class="email-label">Attachments</label>
                  <div class="file-upload-area">
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      @change="handleFileChange"
                      class="file-input"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    />
                    <label for="fileInput" class="file-upload-label">
                      <i class="fas fa-cloud-upload-alt me-2"></i>
                      Choose Files or Drag & Drop
                    </label>
                    <small class="file-help-text">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP, RAR (Max 30MB per
                      file)
                    </small>
                  </div>

                  <!-- Selected Files List -->
                  <div v-if="selectedFiles.length > 0" class="selected-files">
                    <h6>Selected Files:</h6>
                    <div class="file-list">
                      <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                        <div class="file-info">
                          <i class="fas fa-file me-2"></i>
                          <span class="file-name">{{ file.name }}</span>
                          <span class="file-size">({{ formatFileSize(file.size) }})</span>
                        </div>
                        <button
                          type="button"
                          @click="removeFile(index)"
                          class="btn btn-sm btn-outline-danger"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Privacy Consent -->
                <div class="email-field">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      id="privacy"
                      v-model="emailForm.privacyConsent"
                      class="form-check-input"
                      required
                    />
                    <label for="privacy" class="form-check-label">
                      I agree to the
                      <a href="#" @click.prevent="showPrivacyModal = true" class="privacy-link">
                        Privacy Policy
                      </a>
                      and consent to sending this email *
                    </label>
                  </div>
                </div>

                <!-- Send Button -->
                <div class="email-actions-bottom">
                  <button
                    type="submit"
                    class="btn btn-primary btn-send"
                    :disabled="!isFormValid || isSubmitting"
                  >
                    <span
                      v-if="isSubmitting"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    <i v-else class="fas fa-paper-plane me-2"></i>
                    {{ isSubmitting ? 'Sending...' : 'Send Email' }}
                  </button>
                </div>

                <!-- Status Message -->
                <div
                  v-if="submitStatus"
                  class="status-message mt-3"
                  :class="{ success: submitStatus.success, error: !submitStatus.success }"
                >
                  <i
                    :class="
                      submitStatus.success ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'
                    "
                    class="me-2"
                  ></i>
                  {{ submitStatus.message }}
                </div>
              </form>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="contact-info">
              <div class="contact-item">
                <div class="contact-icon">
                  <img
                    src="/images/icon/placeholder.png"
                    alt="Address"
                    class="contact-icon-image"
                  />
                </div>
                <div class="contact-details">
                  <h5>Address</h5>
                  <p>
                    123 Wellness Street<br />
                    Mental Health District<br />
                    City, State 12345
                  </p>
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                  <img src="/images/icon/telephone.png" alt="Phone" class="contact-icon-image" />
                </div>
                <div class="contact-details">
                  <h5>Phone</h5>
                  <p>
                    Main: (555) 123-4567<br />
                    Support: (555) 123-4568<br />
                    Emergency: (555) 911-HELP
                  </p>
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                  <img src="/images/icon/email.png" alt="Email" class="contact-icon-image" />
                </div>
                <div class="contact-details">
                  <h5>Email</h5>
                  <p>
                    General: info@feelingcare.org<br />
                    Support: support@feelingcare.org<br />
                    Media: media@feelingcare.org
                  </p>
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-icon">
                  <img src="/images/icon/schedule.png" alt="Hours" class="contact-icon-image" />
                </div>
                <div class="contact-details">
                  <h5>Hours</h5>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="privacy-modal-overlay" @click="showPrivacyModal = false">
      <div class="privacy-modal" @click.stop>
        <div class="privacy-modal-header">
          <h3>Privacy Policy</h3>
          <button class="close-btn" @click="showPrivacyModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="privacy-modal-content">
          <div class="privacy-section">
            <h4>1. Introduction</h4>
            <p>
              Feeling Care ("we," "our," or "us") is committed to protecting your privacy and
              personal information. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our email service and website.
            </p>
          </div>

          <div class="privacy-section">
            <h4>2. Information We Collect</h4>
            <h5>2.1 Information You Provide Directly</h5>
            <ul>
              <li>
                <strong>Email Addresses:</strong> Recipient, sender, CC, and BCC email addresses
              </li>
              <li><strong>Message Content:</strong> Subject lines and message body content</li>
              <li>
                <strong>Personal Information:</strong> Names, phone numbers, and other contact
                details
              </li>
              <li>
                <strong>File Attachments:</strong> Documents and files you choose to attach to
                emails
              </li>
            </ul>

            <h5>2.2 Information We Collect Automatically</h5>
            <ul>
              <li><strong>Usage Data:</strong> How you interact with our email service</li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, and device
                identifiers
              </li>
              <li><strong>Log Data:</strong> IP addresses, access times, and pages visited</li>
            </ul>
          </div>

          <div class="privacy-section">
            <h4>3. How We Use Your Information</h4>
            <p>We use the information we collect to:</p>
            <ul>
              <li>
                <strong>Provide Email Services:</strong> Send, receive, and manage your emails
              </li>
              <li>
                <strong>Improve Our Service:</strong> Analyze usage patterns and enhance
                functionality
              </li>
              <li>
                <strong>Communicate with You:</strong> Respond to inquiries and provide support
              </li>
              <li>
                <strong>Ensure Security:</strong> Protect against fraud, abuse, and unauthorized
                access
              </li>
            </ul>
          </div>

          <div class="privacy-section">
            <h4>4. Information Sharing and Disclosure</h4>
            <h5>4.1 We Do Not Sell Your Information</h5>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>

            <h5>4.2 Limited Sharing</h5>
            <p>We may share your information only in the following circumstances:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Trusted third parties who assist in operating
                our service
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </div>

          <div class="privacy-section">
            <h4>5. Data Security</h4>
            <ul>
              <li>
                <strong>Encryption:</strong> All data transmission is encrypted using
                industry-standard protocols
              </li>
              <li>
                <strong>Access Controls:</strong> Strict access controls limit who can view your
                information
              </li>
              <li>
                <strong>Secure Storage:</strong> Your data is stored in secure, monitored facilities
              </li>
            </ul>
          </div>

          <div class="privacy-section">
            <h4>6. Your Rights and Choices</h4>
            <ul>
              <li>
                <strong>View Your Data:</strong> Request access to the personal information we hold
                about you
              </li>
              <li>
                <strong>Update Information:</strong> Correct or update your personal information
              </li>
              <li><strong>Delete Data:</strong> Request deletion of your personal information</li>
            </ul>
          </div>

          <div class="privacy-section">
            <h4>7. Contact Information</h4>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div class="contact-info">
              <p><strong>Feeling Care Privacy Team</strong></p>
              <p>Email: <a href="mailto:privacy@feelingcare.org">privacy@feelingcare.org</a></p>
            </div>
          </div>

          <div class="privacy-footer">
            <p>
              <em>
                By using our email service, you acknowledge that you have read and understood this
                Privacy Policy and agree to the collection, use, and disclosure of your information
                as described herein.
              </em>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { sanitizeInput, rateLimiter } from '../utils/security.js'
import {
  sendEmailWithAttachment,
  fileToBase64,
  isValidEmail,
  getMimeType,
} from '../services/emailService'

export default {
  name: 'AboutUs',
  setup() {
    const emailForm = ref({
      to: '',
      from: '',
      cc: '',
      bcc: '',
      subject: '',
      message: '',
      isHtml: true,
      privacyConsent: false,
    })

    const selectedFiles = ref([])
    const isSubmitting = ref(false)
    const submitStatus = ref(null)
    const showPrivacyModal = ref(false)

    return {
      emailForm,
      selectedFiles,
      isSubmitting,
      submitStatus,
      showPrivacyModal,
    }
  },
  computed: {
    isFormValid() {
      return (
        this.emailForm.to.trim() &&
        this.emailForm.from.trim() &&
        this.emailForm.subject.trim() &&
        this.emailForm.message.trim() &&
        this.emailForm.privacyConsent
      )
    },
  },
  methods: {
    // Handle file selection
    handleFileChange(event) {
      const files = Array.from(event.target.files)
      this.selectedFiles = [...this.selectedFiles, ...files]
    },

    // Remove file from selection
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },

    // Format file size
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // Insert signature
    insertSignature() {
      const signature = `\n\nBest regards,\n${this.emailForm.from.split('@')[0]}`
      this.emailForm.message += signature
    },

    // Clear message
    clearMessage() {
      this.emailForm.message = ''
    },

    // Clear entire form
    clearForm() {
      this.emailForm = {
        to: '',
        from: '',
        cc: '',
        bcc: '',
        subject: '',
        message: '',
        isHtml: true,
        privacyConsent: false,
      }
      this.selectedFiles = []
      this.submitStatus = null
    },

    // Save draft (placeholder functionality)
    saveDraft() {
      // In a real application, this would save to localStorage or backend
      localStorage.setItem('emailDraft', JSON.stringify(this.emailForm))
      this.submitStatus = { success: true, message: 'Draft saved successfully!' }
      setTimeout(() => {
        this.submitStatus = null
      }, 3000)
    },

    // Validate email list
    validateEmailList(emailString) {
      if (!emailString.trim()) return true
      const emails = emailString.split(',').map((email) => email.trim())
      return emails.every((email) => isValidEmail(email))
    },

    async submitEmailForm() {
      // Rate limiting check
      const userIdentifier = 'email-form-' + this.emailForm.from
      if (!rateLimiter.isAllowed(userIdentifier)) {
        this.submitStatus = {
          success: false,
          message: 'Too many requests. Please wait before submitting again.',
        }
        return
      }

      // Validation
      if (!isValidEmail(this.emailForm.to)) {
        this.submitStatus = {
          success: false,
          message: 'Please enter a valid recipient email address.',
        }
        return
      }

      if (!isValidEmail(this.emailForm.from)) {
        this.submitStatus = {
          success: false,
          message: 'Please enter a valid sender email address.',
        }
        return
      }

      // Validate CC emails
      if (this.emailForm.cc && !this.validateEmailList(this.emailForm.cc)) {
        this.submitStatus = { success: false, message: 'Please enter valid CC email addresses.' }
        return
      }

      // Validate BCC emails
      if (this.emailForm.bcc && !this.validateEmailList(this.emailForm.bcc)) {
        this.submitStatus = { success: false, message: 'Please enter valid BCC email addresses.' }
        return
      }

      this.isSubmitting = true
      this.submitStatus = null

      try {
        // Sanitize form data
        const sanitizedData = {
          to: sanitizeInput(this.emailForm.to),
          from: sanitizeInput(this.emailForm.from),
          cc: sanitizeInput(this.emailForm.cc),
          bcc: sanitizeInput(this.emailForm.bcc),
          subject: sanitizeInput(this.emailForm.subject),
          message: sanitizeInput(this.emailForm.message),
          isHtml: this.emailForm.isHtml,
          privacyConsent: this.emailForm.privacyConsent,
        }

        // Process attachments
        const attachments = []
        for (const file of this.selectedFiles) {
          const base64Content = await fileToBase64(file)
          attachments.push({
            filename: file.name,
            content: base64Content,
            type: getMimeType(file.name),
            disposition: 'attachment',
          })
        }

        // Create email content
        const emailSubject = sanitizedData.subject

        const emailText = sanitizedData.message

        const emailHtml = sanitizedData.isHtml
          ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">${sanitizedData.message.replace(/\n/g, '<br>')}</div>`
          : sanitizedData.message

        // Send email
        const result = await sendEmailWithAttachment(
          sanitizedData.to,
          sanitizedData.from,
          emailSubject,
          emailText,
          emailHtml,
          attachments,
        )

        this.submitStatus = result

        // Clear form if successful
        if (result.success) {
          this.clearForm()
        }
      } catch (error) {
        console.error('Error submitting contact form:', error)
        this.submitStatus = {
          success: false,
          message: 'An unexpected error occurred. Please try again.',
        }
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>
