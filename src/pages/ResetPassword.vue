<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">Reset Password</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Password Baru</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-sm text-center">{{ success }}</div>

        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Mengirim...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Password tidak cocok.'
    loading.value = false
    return
  }

  try {
    await axios.post('http://127.0.0.1:8000/api/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    success.value = 'Password berhasil direset. Silakan login.'
    setTimeout(() => router.push({ name: 'Login' }), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan.'
  } finally {
    loading.value = false
  }
}
</script>
