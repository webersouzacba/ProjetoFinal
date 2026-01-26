import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Normaliza estado de sessão no boot (evita UI incoerente ao abrir app)
const auth = useAuthStore()
auth.validateLocalToken()

app.mount('#app')
