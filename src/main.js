import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/custom.css'
import './assets/getinvolved.css'
import { initializeSecurity } from './middleware/security'

const app = createApp(App)

// Initialize security measures (environment-aware)
initializeSecurity()

app.use(router)
app.mount('#app')
