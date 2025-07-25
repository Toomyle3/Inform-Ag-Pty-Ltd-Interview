import { createApp } from 'vue'
import './style.css'
import { createConvexVue } from "@convex-vue/core";
import App from './App.vue'
import { clerkPlugin } from '@clerk/vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const convexVue = createConvexVue({
  convexUrl: import.meta.env.VITE_CONVEX_URL,
});

const app = createApp(App)
app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
app.use(convexVue)
app.use(router)

// Global logout method
app.config.globalProperties.$logout = async () => {
  try {
    const { client } = window.Clerk
    await client?.removeSessions()
    await router.push('/sign-in')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

app.mount('#app')