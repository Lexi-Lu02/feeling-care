<script setup>
import { ref } from 'vue'
import { z } from 'zod'

const isLogin = ref(true)

const email = ref('')
const password = ref('')
const username = ref('')

const errors = ref({})

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
})

function handleSubmit() {
  console.log('Form submitted!')
  console.log('isLogin:', isLogin.value)
  console.log('username:', username.value)
  console.log('email:', email.value)
  console.log('password:', password.value)

  try {
    const schema = isLogin.value ? loginSchema : signupSchema
    const formData = isLogin.value
      ? { email: email.value, password: password.value }
      : { username: username.value, email: email.value, password: password.value }

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
      alert(
        isLogin.value
          ? `✅ Welcome back ${email.value}`
          : `✅ Account created for ${username.value}`,
      )
      email.value = password.value = username.value = ''
    }
  } catch (error) {
    console.error('Validation error:', error)
    errors.value = { general: 'An error occurred during validation' }
  }
}

function clearForm() {
  email.value = password.value = username.value = ''
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

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">
          {{ isLogin ? 'Login' : 'Sign Up' }}
        </button>
        <button type="button" @click="clearForm" class="btn btn-secondary">Clear</button>
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
