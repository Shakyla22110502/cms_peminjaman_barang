<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">Lupa Password</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div v-if="success" class="text-green-600 text-sm text-center">{{ success }}</div>
        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>

        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Mengirim link...' : 'Kirim Link Reset Password' }}
        </button>

        <p class="text-sm text-center mt-4">
          Sudah ingat password? 
          <span @click="router.push({ name: 'Login' })" class="text-blue-600 hover:underline cursor-pointer">
            Login di sini
          </span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const success = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/forgot-password', {
      email: email.value,
    })

    success.value = response.data.message || 'Link reset password telah dikirim ke email Anda.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat mengirim permintaan.'
  } finally {
    loading.value = false
  }
}
</script>
