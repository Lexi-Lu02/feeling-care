<script setup>
import { ref, onMounted } from 'vue'
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
} from 'firebase/auth'

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

// Validation Schemas
const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase, one lowercase, and one number'
    ),
  role: z.string().min(1, 'Please select a role'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters'),
})

// ---------- Helpers ----------
function clearForm() {
  email.value = ''
  password.value = ''
  username.value = ''
  selectedRole.value = ''
  errors.value = {}
  firebaseError.value = ''
}

// ---------- Form Submission ----------
async function handleSubmit() {
  try {
    if (isLogin.value) {
      const result = loginSchema.safeParse({ email: email.value, password: password.value })
      if (!result.success) {
        errors.value = {}
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
        errors.value = {}
        result.error.issues.forEach((e) => (errors.value[e.path[0]] = e.message))
        return
      }
      await signUpWithFirebase()
    }
  } catch (error) {
    console.error('Validation error:', error)
    errors.value = { general: 'An error occurred during validation' }
  } finally {
    isLoading.value = false
  }
}

// ---------- Firebase Auth ----------
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    firebaseUser.value = result.user
    firebaseError.value = ''

    if (result.user.email.toLowerCase().includes('admin')) {
      await router.push('/admin')
    } else {
      await router.push('/')
    }
  } catch (err) {
    console.log('Firebase Google Sign-in Error:', err.code)
    firebaseError.value = err.message
  }
}

async function signInWithFirebaseEmail() {
  if (!email.value || !password.value) {
    firebaseError.value = 'Please enter email and password'
    return
  }

  isLoading.value = true
  firebaseError.value = ''

  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    firebaseUser.value = result.user

    if (email.value.toLowerCase().includes('admin')) {
      await router.push('/admin')
    } else {
      await router.push('/')
    }
  } catch (err) {
    console.error('Firebase Sign-in Error:', err)
    if (err.code === 'auth/network-request-failed') {
      firebaseError.value = 'Network error: Check Firebase Console settings and authorized domains'
    } else if (err.code === 'auth/user-not-found') {
      firebaseError.value = 'No account found with this email. Please sign up first.'
    } else if (err.code === 'auth/wrong-password') {
      firebaseError.value = 'Incorrect password. Please try again.'
    } else if (err.code === 'auth/invalid-email') {
      firebaseError.value = 'Invalid email address format.'
    } else {
      firebaseError.value = `Sign-in failed: ${err.message}`
    }
  } finally {
    isLoading.value = false
  }
}

async function signUpWithFirebase() {
  if (!email.value || !password.value || !username.value || !selectedRole.value) {
    firebaseError.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  firebaseError.value = ''

  try {
    console.log('Attempting to create user with email:', email.value)
    const result = await createUserWithEmailAndPassword(auth, email.value, password.value)
    firebaseUser.value = result.user

    console.log('Firebase Sign-up Successful!', result.user)

    await firebaseSignOut(auth)
    firebaseUser.value = null
    clearForm()

    // Redirect user back to login page
    isLogin.value = true
    await router.push('/auth')
  } catch (err) {
    console.error('Firebase Sign-up Error:', err)
    if (err.code === 'auth/network-request-failed') {
      firebaseError.value = 'Network error: Check Firebase Console settings and authorized domains'
    } else if (err.code === 'auth/email-already-in-use') {
      firebaseError.value = 'This email is already registered. Try logging in instead.'
    } else if (err.code === 'auth/weak-password') {
      firebaseError.value = 'Password is too weak. Please use at least 6 characters.'
    } else if (err.code === 'auth/invalid-email') {
      firebaseError.value = 'Invalid email address format.'
    } else {
      firebaseError.value = `Sign-up failed: ${err.message}`
    }
  } finally {
    isLoading.value = false
  }
}

async function signOutFirebase() {
  try {
    await firebaseSignOut(auth)
    firebaseUser.value = null
    firebaseError.value = ''
  } catch (err) {
    firebaseError.value = err.message
  }
}

// ---------- Listen for Auth Changes ----------
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    firebaseUser.value = user
  })
})
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>

    <!-- Firebase User Message (Removed “Welcome” toast) -->

    <form @submit.prevent="handleSubmit" class="mt-3">
      <div v-if="!isLogin" class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
        />
        <div v-if="errors.username" class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
        />
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
        />
        <div v-if="errors.password" class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>

      <div v-if="!isLogin" class="mb-3">
        <label class="form-label">I am seeking help for:</label>
        <select v-model="selectedRole" class="form-select" :class="{ 'is-invalid': errors.role }">
          <option value="">Select an option</option>
          <option value="myself">Seek help for myself</option>
          <option value="someone-else">Seeking help for someone else</option>
        </select>
        <div v-if="errors.role" class="invalid-feedback">
          {{ errors.role }}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up' }}
        </button>
        <button type="button" @click="clearForm" class="btn btn-secondary" :disabled="isLoading">
          Clear
        </button>
      </div>
    </form>

    <!-- Error Messages -->
    <div v-if="errors.general" class="alert alert-danger mt-3">{{ errors.general }}</div>
    <div v-if="firebaseError" class="alert alert-danger mt-3">{{ firebaseError }}</div>

    <p class="mt-3">
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{ isLogin ? "Don't have an account? Sign up here." : 'Already have an account? Login here.' }}
      </a>
    </p>

    <div v-if="!firebaseUser" class="text-center mt-3">
      <button @click="signInWithGoogle" class="btn btn-primary google-signin-btn">
        <i class="fab fa-google me-2"></i>
        Login with Google
      </button>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.google-signin-btn {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border: none;
  color: white;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  font-family: Tahoma, sans-serif;
}

.google-signin-btn:hover {
  background: linear-gradient(135deg, #3367d6 0%, #2d8f47 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
  color: white;
}

.google-signin-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);
}

.google-signin-btn:focus {
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
  outline: none;
}

.google-signin-btn i {
  font-size: 1.1em;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
