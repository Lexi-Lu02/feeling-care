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
                <button class="btn btn-primary btn-lg me-3" @click="scrollToDonation">
                  <i class="fas fa-donate me-2"></i>Make a Donation
                </button>
                <button class="btn btn-outline-primary btn-lg" @click="learnMoreAboutDonations">
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
                <div class="mb-3">
                  <label for="storyTitle" class="form-label">Story Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="storyTitle"
                    v-model="storyForm.title"
                    placeholder="Give your story a meaningful title"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="storyContent" class="form-label">Your Story</label>
                  <textarea
                    class="form-control"
                    id="storyContent"
                    rows="6"
                    v-model="storyForm.content"
                    placeholder="Share your mental health journey, challenges, triumphs, or insights..."
                    required
                  ></textarea>
                </div>
                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="anonymousCheck"
                    v-model="storyForm.anonymous"
                  />
                  <label class="form-check-label" for="anonymousCheck"> Share anonymously </label>
                </div>
                <button type="submit" class="btn btn-primary w-100">
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
                <button class="btn btn-outline-primary btn-lg" @click="viewResources">
                  <i class="fas fa-book me-2"></i>View Resources
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
                <button class="btn btn-outline-primary btn-lg" @click="viewEvents">
                  <i class="fas fa-calendar me-2"></i>View Events
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="join-options">
              <h3>Ways to Join</h3>
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
export default {
  name: 'GetInvolved',
  data() {
    return {
      customAmount: '',
      storyForm: {
        title: '',
        content: '',
        anonymous: false,
      },
      showSuccessMessage: false,
      successMessage: '',
    }
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
      // Navigate to stories section or blog
      this.$router.push('/blog')
    },
    submitStory() {
      this.showSuccess(
        'Thank you for sharing your story! It will be reviewed and may be featured on our platform.',
      )
      this.storyForm = {
        title: '',
        content: '',
        anonymous: false,
      }
    },
    contributeExpertise() {
      this.showSuccess(
        'Thank you for your interest! We will contact you shortly about contributing your expertise.',
      )
    },
    viewResources() {
      this.$router.push('/information-and-resources')
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
    viewEvents() {
      this.showSuccess(
        'Event calendar will be available soon! Check back for upcoming workshops and support groups.',
      )
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
    scrollToDonation() {
      const donationCard = document.querySelector('.donation-card')
      if (donationCard) {
        donationCard.scrollIntoView({ behavior: 'smooth' })
      }
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
