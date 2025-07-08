<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-500">
    <div class="relative bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-md text-white transition duration-500">

      <!-- Optional Admin Icon -->
      <div class="flex justify-center mb-3">
        <svg class="w-12 h-12 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3S9 6.343 9 8s1.343 3 3 3z M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>
        </svg>
      </div>

      <h2 class="text-3xl font-bold mb-6 text-center text-white tracking-wide">Login Admin</h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-white mb-1">Email</label>
          <div class="flex items-center px-3 py-2 bg-white/10 rounded-md border border-white/30 focus-within:ring-2 focus-within:ring-pink-300">
            <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0h8m-8 0v6m8-6v6"/>
            </svg>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="flex-1 bg-transparent outline-none placeholder-white text-white"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-medium text-white mb-1">Password</label>
          <div class="flex items-center px-3 py-2 bg-white/10 rounded-md border border-white/30 focus-within:ring-2 focus-within:ring-pink-300">
            <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3S9 6.343 9 8s1.343 3 3 3z M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>
            </svg>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="••••••••"
              class="flex-1 bg-transparent outline-none placeholder-white text-white"
            />
            <button type="button" class="ml-2 text-sm hover:underline" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-pink-300 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90 transition flex justify-center items-center text-white font-medium"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Logging in...
          </template>
          <template v-else>
            Login
          </template>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value,
    })

    const { token, user, permissions } = response.data
    userStore.setUser({ user, token, permissions })
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>