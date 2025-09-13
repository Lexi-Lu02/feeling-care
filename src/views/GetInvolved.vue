<template>
  <div class="get-involved-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h1 class="hero-title">Get Involved</h1>
            <p class="hero-description">
              Join us in making a difference in mental health awareness and support. There are many
              ways you can contribute to our mission and help create a more compassionate community.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Donate Today Section -->
      <div class="section-container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="section-content">
              <div class="section-icon">
                <i class="fas fa-heart"></i>
              </div>
              <h2 class="section-title">Donate Today</h2>
              <p class="section-description">
                Your financial support helps us provide free mental health resources, maintain our
                platform, and reach more people in need. Every donation, no matter the size, makes a
                real difference in someone's life.
              </p>
              <ul class="benefits-list">
                <li><i class="fas fa-check-circle"></i> Support free mental health resources</li>
                <li><i class="fas fa-check-circle"></i> Help maintain our online platform</li>
                <li><i class="fas fa-check-circle"></i> Fund community outreach programs</li>
                <li><i class="fas fa-check-circle"></i> Enable research and development</li>
              </ul>
              <div class="section-buttons">
                <button class="btn btn-primary btn-lg" @click="learnMoreAboutDonations">
                  <i class="fas fa-info-circle me-2"></i>Learn More
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="section-image">
              <div class="donation-card">
                <div class="donation-header">
                  <h3>Quick Donation</h3>
                  <p>Choose an amount or enter custom</p>
                </div>
                <div class="donation-amounts">
                  <button class="amount-btn" @click="selectAmount(25)">$25</button>
                  <button class="amount-btn" @click="selectAmount(50)">$50</button>
                  <button class="amount-btn" @click="selectAmount(100)">$100</button>
                  <button class="amount-btn" @click="selectAmount(250)">$250</button>
                </div>
                <div class="custom-amount">
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter amount"
                      v-model="customAmount"
                    />
                  </div>
                </div>
                <button class="btn btn-primary w-100 mt-3" @click="processDonation">
                  <i class="fas fa-heart me-2"></i>Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Your Stories Section -->
      <div class="section-container alt-bg">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-2">
            <div class="section-content">
              <div class="section-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <h2 class="section-title">Share Your Stories</h2>
              <p class="section-description">
                Your personal journey with mental health can inspire and help others. By sharing
                your story, you contribute to breaking down stigma and creating a supportive
                community where everyone feels heard.
              </p>
              <ul class="benefits-list">
                <li><i class="fas fa-check-circle"></i> Help others feel less alone</li>
                <li><i class="fas fa-check-circle"></i> Break down mental health stigma</li>
                <li><i class="fas fa-check-circle"></i> Inspire hope and recovery</li>
                <li><i class="fas fa-check-circle"></i> Build a supportive community</li>
              </ul>
              <div class="section-buttons">
                <button class="btn btn-primary btn-lg me-3" @click="shareStory">
                  <i class="fas fa-pen me-2"></i>Share Your Story
                </button>
                <button class="btn btn-outline-primary btn-lg" @click="readStories">
                  <i class="fas fa-eye me-2"></i>Read Stories
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="story-form-card">
              <h3>Share Your Experience</h3>
              <form @submit.prevent="submitStory">
                <!-- CSRF Token -->
                <input type="hidden" name="csrf_token" :value="csrfToken" />

                <!-- Story Type Selection -->
                <div class="mb-3">
                  <label class="form-label">How would you like to share your story?</label>
                  <div class="story-type-buttons">
                    <button
                      type="button"
                      class="btn story-type-btn"
                      :class="{ active: storyForm.type === 'text' }"
                      @click="setStoryType('text')"
                    >
                      <i class="fas fa-keyboard me-2"></i>Write
                    </button>
                    <button
                      type="button"
                      class="btn story-type-btn"
                      :class="{ active: storyForm.type === 'audio' }"
                      @click="setStoryType('audio')"
                    >
                      <i class="fas fa-microphone me-2"></i>Audio
                    </button>
                    <button
                      type="button"
                      class="btn story-type-btn"
                      :class="{ active: storyForm.type === 'video' }"
                      @click="setStoryType('video')"
                    >
                      <i class="fas fa-video me-2"></i>Video
                    </button>
                  </div>
                </div>

                <!-- Story Title (for all types) -->
                <div class="mb-3">
                  <label for="storyTitle" class="form-label">Story Title</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.title }"
                    id="storyTitle"
                    v-model="storyForm.title"
                    placeholder="Give your story a meaningful title"
                    maxlength="200"
                    required
                  />
                  <div v-if="formErrors.title" class="invalid-feedback">
                    {{ formErrors.title }}
                  </div>
                </div>

                <!-- Text Story Content -->
                <div v-if="storyForm.type === 'text'" class="mb-3">
                  <label for="storyContent" class="form-label">Your Story</label>
                  <textarea
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.content }"
                    id="storyContent"
                    rows="6"
                    v-model="storyForm.content"
                    placeholder="Share your mental health journey, challenges, triumphs, or insights..."
                    maxlength="10000"
                    required
                  ></textarea>
                  <div v-if="formErrors.content" class="invalid-feedback">
                    {{ formErrors.content }}
                  </div>
                </div>

                <!-- File Upload Section -->
                <div v-if="storyForm.type === 'audio' || storyForm.type === 'video'" class="mb-3">
                  <label class="form-label">
                    {{ storyForm.type === 'audio' ? 'Audio File' : 'Video File' }}
                  </label>
                  <div
                    class="file-upload-area"
                    :class="{ dragover: isDragOver, 'has-file': selectedFile }"
                    @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave"
                    @drop.prevent="handleDrop"
                  >
                    <div v-if="!selectedFile" class="upload-placeholder">
                      <i
                        :class="storyForm.type === 'audio' ? 'fas fa-microphone' : 'fas fa-video'"
                        class="upload-icon"
                      ></i>
                      <p class="upload-text">
                        Drag and drop your {{ storyForm.type }} file here, or
                        <span class="upload-link" @click="triggerFileInput">click to browse</span>
                      </p>
                      <p class="upload-info">
                        {{
                          storyForm.type === 'audio'
                            ? 'Supported formats: MP3, WAV, M4A (Max 50MB)'
                            : 'Supported formats: MP4, MOV, AVI (Max 100MB)'
                        }}
                      </p>
                    </div>
                    <div v-else class="file-info">
                      <i
                        :class="
                          storyForm.type === 'audio' ? 'fas fa-file-audio' : 'fas fa-file-video'
                        "
                        class="file-icon"
                      ></i>
                      <div class="file-details">
                        <p class="file-name">{{ selectedFile.name }}</p>
                        <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                      </div>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="removeFile"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    :accept="storyForm.type === 'audio' ? 'audio/*' : 'video/*'"
                    @change="handleFileSelect"
                    style="display: none"
                  />
                </div>

                <!-- Audio/Video Description -->
                <div v-if="storyForm.type === 'audio' || storyForm.type === 'video'" class="mb-3">
                  <label for="mediaDescription" class="form-label">Description (Optional)</label>
                  <textarea
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.description }"
                    id="mediaDescription"
                    rows="3"
                    v-model="storyForm.description"
                    placeholder="Provide a brief description of your story or what you'd like to share..."
                    maxlength="10000"
                  ></textarea>
                  <div v-if="formErrors.description" class="invalid-feedback">
                    {{ formErrors.description }}
                  </div>
                </div>

                <!-- Cover Image Upload -->
                <div class="mb-3">
                  <label class="form-label">Cover Image (Optional)</label>
                  <div
                    class="cover-image-upload-area"
                    :class="{ dragover: isImageDragOver, 'has-image': coverImage }"
                    @dragover.prevent="handleImageDragOver"
                    @dragleave.prevent="handleImageDragLeave"
                    @drop.prevent="handleImageDrop"
                  >
                    <div v-if="!coverImage" class="image-upload-placeholder">
                      <i class="fas fa-image upload-icon"></i>
                      <p class="upload-text">
                        Drag and drop a cover image here, or
                        <span class="upload-link" @click="triggerImageInput">click to browse</span>
                      </p>
                      <p class="upload-info">Supported formats: JPG, PNG, GIF (Max 10MB)</p>
                    </div>
                    <div v-else class="cover-image-preview">
                      <img :src="coverImagePreview" alt="Cover preview" class="preview-image" />
                      <div class="image-overlay">
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger"
                          @click="removeCoverImage"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageSelect"
                    style="display: none"
                  />
                </div>

                <!-- Privacy Options -->
                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="anonymousCheck"
                    v-model="storyForm.anonymous"
                  />
                  <label class="form-check-label" for="anonymousCheck"> Share anonymously </label>
                </div>

                <!-- Terms and Conditions -->
                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="termsCheck"
                    v-model="storyForm.termsAccepted"
                    required
                  />
                  <label class="form-check-label" for="termsCheck">
                    I agree to the
                    <a href="#" @click.prevent="showTerms">terms and conditions</a> for sharing
                    stories
                  </label>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="!isFormValid">
                  <i class="fas fa-share me-2"></i>Submit Story
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Your Professional Knowledge Section -->
      <div class="section-container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="section-content">
              <div class="section-icon">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <h2 class="section-title">Share Your Professional Knowledge</h2>
              <p class="section-description">
                Are you a mental health professional, researcher, or expert? Share your knowledge to
                help educate our community and provide evidence-based information that can make a
                real difference.
              </p>
              <ul class="benefits-list">
                <li><i class="fas fa-check-circle"></i> Educate and inform the community</li>
                <li><i class="fas fa-check-circle"></i> Share evidence-based practices</li>
                <li><i class="fas fa-check-circle"></i> Build professional connections</li>
                <li><i class="fas fa-check-circle"></i> Contribute to mental health awareness</li>
              </ul>
              <div class="section-buttons">
                <button class="btn btn-primary btn-lg me-3" @click="contributeExpertise">
                  <i class="fas fa-chalkboard-teacher me-2"></i>Share Knowledge
                </button>
                <button class="btn btn-outline-primary btn-lg" @click="getSupport">
                  <i class="fas fa-hands-helping me-2"></i>Get Support
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="expertise-options">
              <h3>How You Can Contribute</h3>
              <div class="expertise-card" @click="selectExpertise('article')">
                <div class="expertise-icon">
                  <i class="fas fa-newspaper"></i>
                </div>
                <h4>Write Articles</h4>
                <p>Share your expertise through informative articles and guides</p>
              </div>
              <div class="expertise-card" @click="selectExpertise('webinar')">
                <div class="expertise-icon">
                  <i class="fas fa-video"></i>
                </div>
                <h4>Host Webinars</h4>
                <p>Lead educational sessions and Q&A discussions</p>
              </div>
              <div class="expertise-card" @click="selectExpertise('consultation')">
                <div class="expertise-icon">
                  <i class="fas fa-comments"></i>
                </div>
                <h4>Provide Consultation</h4>
                <p>Offer professional guidance and recommendations</p>
              </div>
              <div class="expertise-card" @click="selectExpertise('research')">
                <div class="expertise-icon">
                  <i class="fas fa-microscope"></i>
                </div>
                <h4>Share Research</h4>
                <p>Contribute latest findings and evidence-based practices</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Join Us Section -->
      <div class="section-container alt-bg">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-2">
            <div class="section-content">
              <div class="section-icon">
                <i class="fas fa-users"></i>
              </div>
              <h2 class="section-title">Join Us</h2>
              <p class="section-description">
                Become an active member of our community. Join our volunteer program, participate in
                events, or become a community moderator. Together, we can create a more supportive
                and understanding world.
              </p>
              <ul class="benefits-list">
                <li><i class="fas fa-check-circle"></i> Join a supportive community</li>
                <li><i class="fas fa-check-circle"></i> Participate in meaningful events</li>
                <li><i class="fas fa-check-circle"></i> Develop new skills and connections</li>
                <li><i class="fas fa-check-circle"></i> Make a direct impact in mental health</li>
              </ul>
              <div class="section-buttons">
                <button class="btn btn-primary btn-lg me-3" @click="joinCommunity">
                  <i class="fas fa-user-plus me-2"></i>Join Community
                </button>
                <button class="btn btn-outline-primary btn-lg" @click="aboutUs">
                  <i class="fas fa-info-circle me-2"></i>About Us
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="join-options">
              <div class="join-card">
                <div class="join-icon">
                  <i class="fas fa-hands-helping"></i>
                </div>
                <h4>Volunteer</h4>
                <p>Help moderate discussions, organize events, or support community members</p>
                <button class="btn btn-outline-primary" @click="volunteerApplication">
                  Apply to Volunteer
                </button>
              </div>
              <div class="join-card">
                <div class="join-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <h4>Event Participant</h4>
                <p>Join our workshops, support groups, and awareness campaigns</p>
                <button class="btn btn-outline-primary" @click="viewUpcomingEvents">
                  View Events
                </button>
              </div>
              <div class="join-card">
                <div class="join-icon">
                  <i class="fas fa-bullhorn"></i>
                </div>
                <h4>Advocate</h4>
                <p>Help spread awareness and advocate for mental health in your community</p>
                <button class="btn btn-outline-primary" @click="becomeAdvocate">
                  Become Advocate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Messages -->
    <div
      v-if="showSuccessMessage"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      <i class="fas fa-check-circle me-2"></i>
      {{ successMessage }}
      <button type="button" class="btn-close" @click="showSuccessMessage = false"></button>
    </div>
  </div>
</template>

<script>
import {
  sanitizeInput,
  validateFileUpload,
  validateStoryContent,
  validateStoryTitle,
  rateLimiter,
  generateCSRFToken,
} from '../utils/security.js'

export default {
  name: 'GetInvolved',
  data() {
    return {
      customAmount: '',
      storyForm: {
        type: 'text', // 'text', 'audio', 'video'
        title: '',
        content: '',
        description: '',
        anonymous: false,
        termsAccepted: false,
      },
      selectedFile: null,
      isDragOver: false,
      coverImage: null,
      coverImagePreview: null,
      isImageDragOver: false,
      showSuccessMessage: false,
      successMessage: '',
      csrfToken: '',
      formErrors: {},
    }
  },
  mounted() {
    // Generate CSRF token for form security
    this.csrfToken = generateCSRFToken()
  },
  computed: {
    isFormValid() {
      if (!this.storyForm.title || !this.storyForm.termsAccepted) {
        return false
      }

      if (this.storyForm.type === 'text') {
        return !!this.storyForm.content
      } else if (this.storyForm.type === 'audio' || this.storyForm.type === 'video') {
        return !!this.selectedFile
      }

      return false
    },
  },
  methods: {
    selectAmount(amount) {
      this.customAmount = amount
    },
    processDonation() {
      const amount = this.customAmount || 25
      this.showSuccess(
        `Thank you for your donation of $${amount}! Your support makes a difference.`,
      )
      this.customAmount = ''
    },
    shareStory() {
      // Scroll to story form or open modal
      this.$nextTick(() => {
        const storyForm = document.querySelector('.story-form-card')
        if (storyForm) {
          storyForm.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    readStories() {
      // Navigate to Information & Resources page
      this.$router.push('/resources')
    },
    setStoryType(type) {
      this.storyForm.type = type
      this.selectedFile = null
      this.storyForm.content = ''
      this.storyForm.description = ''
      // Keep cover image when switching story types
    },
    handleDragOver(e) {
      e.preventDefault()
      this.isDragOver = true
    },
    handleDragLeave(e) {
      e.preventDefault()
      this.isDragOver = false
    },
    handleDrop(e) {
      e.preventDefault()
      this.isDragOver = false

      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.validateAndSetFile(files[0])
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(e) {
      const file = e.target.files[0]
      if (file) {
        this.validateAndSetFile(file)
      }
    },
    validateAndSetFile(file) {
      const options =
        this.storyForm.type === 'audio'
          ? {
              maxSize: 50 * 1024 * 1024, // 50MB for audio
              allowedTypes: ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'],
              allowedExtensions: ['.mp3', '.wav', '.m4a', '.mpeg'],
            }
          : {
              maxSize: 100 * 1024 * 1024, // 100MB for video
              allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'],
              allowedExtensions: ['.mp4', '.mov', '.avi'],
            }

      const validation = validateFileUpload(file, options)

      if (!validation.isValid) {
        this.showSuccess(`File validation failed: ${validation.errors.join(', ')}`)
        return
      }

      this.selectedFile = file
    },
    removeFile() {
      this.selectedFile = null
      this.$refs.fileInput.value = ''
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    handleImageDragOver(e) {
      e.preventDefault()
      this.isImageDragOver = true
    },
    handleImageDragLeave(e) {
      e.preventDefault()
      this.isImageDragOver = false
    },
    handleImageDrop(e) {
      e.preventDefault()
      this.isImageDragOver = false

      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.validateAndSetImage(files[0])
      }
    },
    triggerImageInput() {
      this.$refs.imageInput.click()
    },
    handleImageSelect(e) {
      const file = e.target.files[0]
      if (file) {
        this.validateAndSetImage(file)
      }
    },
    validateAndSetImage(file) {
      const options = {
        maxSize: 10 * 1024 * 1024, // 10MB for images
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
      }

      const validation = validateFileUpload(file, options)

      if (!validation.isValid) {
        this.showSuccess(`Image validation failed: ${validation.errors.join(', ')}`)
        return
      }

      this.coverImage = file

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        this.coverImagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeCoverImage() {
      this.coverImage = null
      this.coverImagePreview = null
      this.$refs.imageInput.value = ''
    },
    submitStory() {
      // Rate limiting check
      const userIdentifier = 'story-submission-' + (this.$store?.state?.user?.id || 'anonymous')
      if (!rateLimiter.isAllowed(userIdentifier)) {
        this.showSuccess('Too many submissions. Please try again later.')
        return
      }

      // Clear previous errors
      this.formErrors = {}

      // Validate title
      const titleValidation = validateStoryTitle(this.storyForm.title)
      if (!titleValidation.isValid) {
        this.formErrors.title = titleValidation.errors.join(', ')
        this.showSuccess('Please fix the errors in the form.')
        return
      }

      // Validate content based on story type
      if (this.storyForm.type === 'text') {
        const contentValidation = validateStoryContent(this.storyForm.content)
        if (!contentValidation.isValid) {
          this.formErrors.content = contentValidation.errors.join(', ')
          this.showSuccess('Please fix the errors in the form.')
          return
        }
      }

      // Validate description if provided
      if (this.storyForm.description) {
        const descValidation = validateStoryContent(this.storyForm.description)
        if (!descValidation.isValid) {
          this.formErrors.description = descValidation.errors.join(', ')
          this.showSuccess('Please fix the errors in the form.')
          return
        }
      }

      // Sanitize inputs (for future server submission)
      const sanitizedData = {
        title: sanitizeInput(this.storyForm.title),
        content: this.storyForm.type === 'text' ? sanitizeInput(this.storyForm.content) : '',
        description: this.storyForm.description ? sanitizeInput(this.storyForm.description) : '',
        type: this.storyForm.type,
        anonymous: this.storyForm.anonymous,
        termsAccepted: this.storyForm.termsAccepted,
      }

      // Log sanitized data for debugging
      console.log('Sanitized form data:', sanitizedData)

      let message = 'Thank you for sharing your story! '

      if (this.storyForm.type === 'text') {
        message += 'Your written story will be reviewed and may be featured on our platform.'
      } else if (this.storyForm.type === 'audio') {
        message += 'Your audio story will be processed and may be featured on our platform.'
      } else if (this.storyForm.type === 'video') {
        message += 'Your video story will be processed and may be featured on our platform.'
      }

      if (this.coverImage) {
        message += ' Your cover image has also been uploaded.'
      }

      this.showSuccess(message)

      // Reset form
      this.storyForm = {
        type: 'text',
        title: '',
        content: '',
        description: '',
        anonymous: false,
        termsAccepted: false,
      }
      this.selectedFile = null
      this.coverImage = null
      this.coverImagePreview = null
      this.$refs.fileInput.value = ''
      this.$refs.imageInput.value = ''
      this.formErrors = {}
    },
    showTerms() {
      this.showSuccess('Terms and conditions will be displayed in a modal or new page.')
    },
    contributeExpertise() {
      this.showSuccess(
        'Thank you for your interest! We will contact you shortly about contributing your expertise.',
      )
    },
    getSupport() {
      this.$router.push('/support')
    },
    selectExpertise(type) {
      this.showSuccess(
        `Thank you for selecting ${type}! We will follow up with you about next steps.`,
      )
    },
    joinCommunity() {
      this.showSuccess(
        'Welcome to our community! Check your email for next steps and upcoming events.',
      )
    },
    aboutUs() {
      this.$router.push('/about')
    },
    volunteerApplication() {
      this.showSuccess(
        'Thank you for your interest in volunteering! We will contact you about volunteer opportunities.',
      )
    },
    viewUpcomingEvents() {
      this.showSuccess('Event details will be sent to your email!')
    },
    becomeAdvocate() {
      this.showSuccess(
        'Thank you for becoming an advocate! We will send you advocacy resources and opportunities.',
      )
    },
    learnMoreAboutDonations() {
      this.showSuccess('Donation information will be sent to your email!')
    },
    showSuccess(message) {
      this.successMessage = message
      this.showSuccessMessage = true
      setTimeout(() => {
        this.showSuccessMessage = false
      }, 5000)
    },
  },
}
</script>
