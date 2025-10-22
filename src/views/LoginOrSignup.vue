<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { auth } from '@/services/firebaseService'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Initialize Firestore
const db = getFirestore()

const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const username = ref('')
const selectedRole = ref('')
const errors = ref({})
const isLoading = ref(false)
const firebaseUser = ref(null)
const firebaseError = ref('')

// Validation schemas
const signupSchema = z.object({
  username: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must include uppercase, lowercase, and a number',
    ),
  role: z.string().min(1, 'Please select a role'),
})
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Reset form when switching login/signup
watch(isLogin, () => clearForm())

function clearForm() {
  email.value = ''
  password.value = ''
  username.value = ''
  selectedRole.value = ''
  errors.value = {}
  firebaseError.value = ''
}

// --- Form Submit ---
async function handleSubmit() {
  errors.value = {}
  firebaseError.value = ''
  isLoading.value = true
  try {
    if (isLogin.value) {
      const result = loginSchema.safeParse({ email: email.value, password: password.value })
      if (!result.success) {
        result.error.issues.forEach((e) => (errors.value[e.path[0]] = e.message))
        return
      }
      await signInWithFirebaseEmail()
    } else {
      const result = signupSchema.safeParse({
        username: username.value,
        email: email.value,
        password: password.value,
        role: selectedRole.value,
      })
      if (!result.success) {
        result.error.issues.forEach((e) => (errors.value[e.path[0]] = e.message))
        return
      }
      await signUpWithFirebase()
    }
  } catch (error) {
    console.error(error)
    firebaseError.value = 'Unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

// --- Firebase Actions ---
async function signInWithFirebaseEmail() {
  try {
    const res = await signInWithEmailAndPassword(auth, email.value, password.value)
    firebaseUser.value = res.user

    // Get custom claims to check admin status
    const idTokenResult = await res.user.getIdTokenResult()
    const claims = idTokenResult.claims

    if (claims.admin === true || claims.role === 'admin') {
      await router.push('/admin')
    } else {
      await router.push('/')
    }
  } catch (err) {
    firebaseError.value =
      err.code === 'auth/wrong-password'
        ? 'Incorrect password.'
        : err.code === 'auth/user-not-found'
          ? 'Account not found.'
          : err.message
  }
}

async function signUpWithFirebase() {
  try {
    const res = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = res.user

    // Set display name in Firebase Auth immediately
    if (username.value) {
      await updateProfile(user, { displayName: username.value })
    }

    // Check if this is an admin email
    const isAdminEmail = user.email?.toLowerCase() === 'admin@feelingcare.com'

    // Create the user document in Firestore immediately with all the correct data
    // The Firebase Function will respect this data and not overwrite it
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: username.value || '',
        role: isAdminEmail ? 'admin' : selectedRole.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    await firebaseSignOut(auth) // logout immediately
    firebaseUser.value = null
    clearForm()
    isLogin.value = true
    await router.push('/auth')
  } catch (err) {
    firebaseError.value =
      err.code === 'auth/email-already-in-use' ? 'Email already registered.' : err.message
  }
}

// Google Login
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)
    const user = res.user

    // Create Firestore user document for Google users
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ) // Use merge to avoid overwriting existing data

    console.log('Google user synced with Firestore')
    firebaseUser.value = user
    await router.push('/')
  } catch (err) {
    firebaseError.value = err.message
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => (firebaseUser.value = user))
})
</script>

<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-lg-5 col-md-7 col-sm-9">
          <div class="auth-container">
            <!-- Header Section -->
            <div class="auth-header">
              <div class="auth-icon">
                <img
                  src="/images/icon/mental-health.png"
                  alt="Mental health support icon"
                  class="auth-icon-image"
                />
              </div>
              <h1 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Join Our Community' }}</h1>
              <p class="auth-subtitle">
                {{
                  isLogin
                    ? 'Sign in to continue your wellness journey'
                    : 'Start your mental health journey with us'
                }}
              </p>
            </div>

            <!-- Form Section -->
            <div class="auth-form-container">
              <form @submit.prevent="handleSubmit" class="auth-form">
                <div v-if="!isLogin" class="form-group">
                  <label for="username" class="form-label">Display Name</label>
                  <div class="input-wrapper">
                    <i class="fas fa-user input-icon" aria-hidden="true"></i>
                    <input
                      id="username"
                      v-model="username"
                      class="form-control"
                      :class="{ 'is-invalid': errors.username }"
                      placeholder="Enter your display name"
                      aria-describedby="usernameError"
                      aria-invalid="errors.username ? 'true' : 'false'"
                    />
                  </div>
                  <div id="usernameError" class="invalid-feedback" role="alert">
                    {{ errors.username }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">Email Address</label>
                  <div class="input-wrapper">
                    <i class="fas fa-envelope input-icon" aria-hidden="true"></i>
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Enter your email"
                      aria-describedby="emailError"
                      aria-invalid="errors.email ? 'true' : 'false'"
                    />
                  </div>
                  <div id="emailError" class="invalid-feedback" role="alert">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-wrapper">
                    <i class="fas fa-lock input-icon" aria-hidden="true"></i>
                    <input
                      id="password"
                      v-model="password"
                      type="password"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Enter your password"
                      aria-describedby="passwordError"
                      aria-invalid="errors.password ? 'true' : 'false'"
                    />
                  </div>
                  <div id="passwordError" class="invalid-feedback" role="alert">
                    {{ errors.password }}
                  </div>
                </div>

                <div v-if="!isLogin" class="form-group">
                  <label for="role" class="form-label">I am seeking help for:</label>
                  <select
                    id="role"
                    v-model="selectedRole"
                    class="form-select"
                    :class="{ 'is-invalid': errors.role }"
                    aria-describedby="roleError"
                    aria-invalid="errors.role ? 'true' : 'false'"
                  >
                    <option value="">Select an option</option>
                    <option value="myself">Myself</option>
                    <option value="someone-else">Someone else</option>
                  </select>
                  <div id="roleError" class="invalid-feedback" role="alert">
                    {{ errors.role }}
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary btn-submit"
                    :disabled="isLoading"
                    aria-label="Submit the form"
                  >
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {{ isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-clear"
                    @click="clearForm"
                    aria-label="Clear all form fields"
                  >
                    <i class="fas fa-eraser me-2" aria-hidden="true"></i>Clear
                  </button>
                </div>
              </form>

              <!-- Error Message -->
              <div v-if="firebaseError" class="alert alert-error" role="alert">
                <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
                {{ firebaseError }}
              </div>

              <!-- Divider -->
              <div class="divider" role="separator" aria-label="Alternative sign-in options">
                <span>or</span>
              </div>

              <!-- Google Sign In -->
              <div class="google-signin">
                <button
                  @click="signInWithGoogle"
                  class="btn btn-google"
                  aria-label="Continue with Google"
                >
                  <img src="/images/third party/google.png" alt="Google logo" class="google-icon" />
                  Continue with Google
                </button>
              </div>

              <!-- Switch Mode -->
              <div class="auth-switch">
                <p>
                  {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
                  <a href="#" @click.prevent="isLogin = !isLogin" class="switch-link">
                    {{ isLogin ? 'Sign up here' : 'Sign in here' }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/auth.css';
</style>
