<template>
  <div class="about-us-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h1 class="hero-title">About Feeling Care</h1>
            <p class="hero-description">
              We are dedicated to providing comprehensive mental health support, resources, and
              community connections for individuals and families navigating mental health
              challenges.
            </p>
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
                <i class="fas fa-eye"></i>
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
                <i class="fas fa-bullseye"></i>
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
            <div class="contact-form">
              <form @submit.prevent="submitContactForm">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        v-model="contactForm.firstName"
                        class="form-control"
                        required
                        maxlength="50"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        v-model="contactForm.lastName"
                        class="form-control"
                        required
                        maxlength="50"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        v-model="contactForm.email"
                        class="form-control"
                        required
                        maxlength="100"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        v-model="contactForm.phone"
                        class="form-control"
                        maxlength="20"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="subject">Subject *</label>
                  <select id="subject" v-model="contactForm.subject" class="form-control" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Support Request</option>
                    <option value="volunteer">Volunteer Opportunity</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="media">Media Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="message">Message *</label>
                  <textarea
                    id="message"
                    v-model="contactForm.message"
                    class="form-control"
                    rows="5"
                    required
                    maxlength="1000"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                  <small class="form-text text-muted"
                    >{{ contactForm.message.length }}/1000 characters</small
                  >
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      id="privacy"
                      v-model="contactForm.privacyConsent"
                      class="form-check-input"
                      required
                    />
                    <label for="privacy" class="form-check-label">
                      I agree to the privacy policy and consent to being contacted *
                    </label>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary btn-lg" :disabled="!isFormValid">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="contact-info">
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="fas fa-map-marker-alt"></i>
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
                  <i class="fas fa-phone"></i>
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
                  <i class="fas fa-envelope"></i>
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
                  <i class="fas fa-clock"></i>
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
  </div>
</template>

<script>
import { sanitizeInput, rateLimiter } from '../utils/security.js'

export default {
  name: 'AboutUs',
  data() {
    return {
      contactForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        privacyConsent: false,
      },
    }
  },
  computed: {
    isFormValid() {
      return (
        this.contactForm.firstName.trim() &&
        this.contactForm.lastName.trim() &&
        this.contactForm.email.trim() &&
        this.contactForm.subject &&
        this.contactForm.message.trim() &&
        this.contactForm.privacyConsent
      )
    },
  },
  methods: {
    async submitContactForm() {
      // Rate limiting check
      const userIdentifier = 'contact-form-' + this.contactForm.email
      if (!rateLimiter.isAllowed(userIdentifier)) {
        alert('Too many requests. Please wait before submitting again.')
        return
      }

      try {
        // Sanitize form data
        const sanitizedData = {
          firstName: sanitizeInput(this.contactForm.firstName),
          lastName: sanitizeInput(this.contactForm.lastName),
          email: sanitizeInput(this.contactForm.email),
          phone: sanitizeInput(this.contactForm.phone),
          subject: sanitizeInput(this.contactForm.subject),
          message: sanitizeInput(this.contactForm.message),
          privacyConsent: this.contactForm.privacyConsent,
        }

        console.log('Contact form submitted:', sanitizedData)

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert('Thank you for your message! We will get back to you within 24 hours.')

        // Reset form
        this.contactForm = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          privacyConsent: false,
        }
      } catch (error) {
        console.error('Error submitting contact form:', error)
        alert('There was an error submitting your message. Please try again.')
      }
    },
  },
}
</script>
