<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-indigo-500">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-black">Login Admin</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-black">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-black">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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
