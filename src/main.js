import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/custom.css'
import './assets/homepage.css'
import './assets/getinvolved.css'
import './assets/aboutus.css'
import { initializeSecurity } from './middleware/security'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGrA5KWGjdQwaA8CdCYzbmDYmwMjYSY00',
  authDomain: 'assignment3-lanxin-lu-33912645.firebaseapp.com',
  projectId: 'assignment3-lanxin-lu-33912645',
  storageBucket: 'assignment3-lanxin-lu-33912645.appspot.com',
  messagingSenderId: '561423951295',
  appId: '1:561423951295:web:732d1448c23c7eff3b6d0a',
}

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

// Initialize security measures
initializeSecurity()

app.use(router)
app.mount('#app')
