<script setup>
import { ref } from 'vue'
import { z } from 'zod'
import { login, signup, ROLES } from '../services/authService'

const isLogin = ref(true)

const email = ref('')
const password = ref('')
const username = ref('')
const selectedRole = ref('')

const errors = ref({})
const isLoading = ref(false)

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters'),
})

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
      'Please enter 8 - 20 characters. Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  role: z.string().min(1, 'Please select a role'),
})

async function handleSubmit() {
  console.log('Form submitted!')
  console.log('isLogin:', isLogin.value)
  console.log('username:', username.value)
  console.log('email:', email.value)
  console.log('password:', password.value)
  console.log('role:', selectedRole.value)

  try {
    const schema = isLogin.value ? loginSchema : signupSchema
    const formData = isLogin.value
      ? { email: email.value, password: password.value }
      : {
          username: username.value,
          email: email.value,
          password: password.value,
          role: selectedRole.value,
        }

    console.log('formData:', formData)
    const result = schema.safeParse(formData)
    console.log('validation result:', result)

    if (!result.success) {
      console.log('Validation failed!')
      console.log('result.error:', result.error)

      // Clear previous errors
      errors.value = {}

      // Group errors by field - Zod error structure is different
      if (result.error && result.error.issues) {
        result.error.issues.forEach((error) => {
          const field = error.path[0]
          errors.value[field] = error.message
          console.log(`Setting error for ${field}:`, error.message)
        })
      }

      console.log('Final errors object:', errors.value)
    } else {
      console.log('Validation successful!')
      errors.value = {}
      isLoading.value = true

      try {
        let authResult
        if (isLogin.value) {
          // Use the authentication service for login
          console.log('Attempting login with:', { email: email.value, password: password.value })
          authResult = await login(email.value, password.value)
          console.log('Login result:', authResult)
        } else {
          // Use the authentication service for signup
          console.log('Attempting signup with:', {
            username: username.value,
            email: email.value,
            role: selectedRole.value,
          })
          authResult = await signup(username.value, email.value, password.value, selectedRole.value)
          console.log('Signup result:', authResult)
        }

        if (authResult.success) {
          const userData = authResult.user
          console.log('User data after auth:', userData)

          // Emit login event or redirect based on role
          if (userData.role === ROLES.ADMIN) {
            alert(
              `✅ Welcome Administrator ${userData.username}! Redirecting to admin dashboard...`,
            )
            // Redirect to admin dashboard
            window.location.href = '/admin'
          } else {
            alert(`✅ Welcome back ${userData.username}!`)
            // Redirect to home page
            window.location.href = '/'
          }
        }
      } catch (authError) {
        console.error('Authentication error:', authError)
        errors.value = { general: authError.message }
      } finally {
        isLoading.value = false
      }

      email.value = password.value = username.value = selectedRole.value = ''
    }
  } catch (error) {
    console.error('Validation error:', error)
    errors.value = { general: 'An error occurred during validation' }
    isLoading.value = false
  }
}

function clearForm() {
  email.value = password.value = username.value = selectedRole.value = ''
  errors.value = {}
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
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

      <!-- Role Selection (only for signup) -->
      <div v-if="!isLogin" class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="selectedRole" class="form-select" :class="{ 'is-invalid': errors.role }">
          <option value="">Select a role</option>
          <option value="user">User</option>
          <option value="admin">Administrator</option>
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

    <!-- General error message -->
    <div v-if="errors.general" class="alert alert-danger mt-3">
      {{ errors.general }}
    </div>

    <p class="mt-3">
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{
          isLogin ? "Don't have an account? Sign up here." : 'Already have an account? Login here.'
        }}
      </a>
    </p>
  </div>
</template>
