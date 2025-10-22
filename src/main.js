import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import './assets/custom.css'
import './assets/accessibility.css'
import './assets/homepage.css'
import './assets/getinvolved.css'
import './assets/aboutus.css'
import { initializeSecurity } from './middleware/security'
import { initializeApp } from 'firebase/app'
import { initializeOfflineSync } from './services/syncService'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGrA5KWGjdQwaA8CdCYzbmDYmwMjYSYO0',
  authDomain: 'assignment3-lanxin-lu-33912645.firebaseapp.com',
  projectId: 'assignment3-lanxin-lu-33912645',
  storageBucket: 'assignment3-lanxin-lu-33912645.appspot.com',
  messagingSenderId: '561423951295',
  appId: '1:561423951295:web:732d1448c23c7eff3b6d0a',
  measurementId: 'G-MD1NWMKJH9',
}

// Debug: Log the current origin
console.log('Current origin:', window.location.origin)
console.log('Current hostname:', window.location.hostname)
console.log('Current port:', window.location.port)

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue error:', err, info)
  // Prevent error from crashing the app
}

// Initialize security measures
initializeSecurity()

app.use(router)
app.mount('#app')

// Initialize offline sync after app mounts
initializeOfflineSync()
