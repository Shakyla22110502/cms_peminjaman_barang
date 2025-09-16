<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
    <div class="absolute top-0 left-0 w-full h-1/2 bg-blue-800/20 backdrop-blur-sm"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-xl"></div>
    <div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-xl"></div>
    
    <Card class="w-full max-w-md shadow-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/70 to-blue-900/70 backdrop-blur-xl relative z-10 transform transition-all duration-300 hover:scale-[1.02]">
      <div class="absolute -top-14 left-1/2 transform -translate-x-1/2">
        <div class="w-28 h-28 bg-blue-600/20 backdrop-blur-md rounded-full flex items-center justify-center border border-blue-400/30 shadow-lg">
          <svg
            class="w-12 h-12 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <CardHeader class="pt-20">
        <CardTitle class="text-2xl text-center text-blue-100 font-bold">LUPA PASSWORD</CardTitle>
        <CardDescription class="text-center text-blue-300/80">
          Masukkan email Anda untuk menerima link reset password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email" class="text-blue-200">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="bg-blue-900/30 border-blue-600/50 text-blue-100 placeholder:text-blue-400/50 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <!-- Success/Error Messages -->
          <Alert 
            v-if="success" 
            variant="success" 
            class="mt-2 bg-green-500/20 border-green-500/30 text-green-300"
          >
            {{ success }}
          </Alert>
          <Alert 
            v-if="error" 
            variant="destructive" 
            class="mt-2 bg-red-500/20 border-red-500/30 text-red-300"
          >
            {{ error }}
          </Alert>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2 rounded-md transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
            :disabled="loading"
          >
            <template v-if="loading">
              <svg
                class="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Mengirim...
            </template>
            <template v-else> 
              <span class="drop-shadow-sm">Kirim Link Reset Password</span>
            </template>
          </Button>
        </form>
      </CardContent>
      
      <CardFooter class="text-center flex justify-center pb-6">
        <p class="text-sm text-blue-400/80">
          Sudah ingat password? 
          <span 
            @click="router.push({ name: 'Login' })" 
            class="text-blue-300 hover:text-blue-200 hover:underline cursor-pointer ml-1 transition-colors duration-200"
          >
            Login di sini
          </span>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"

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

<style scoped>
/* Custom animations for the form */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-enter-active {
  animation: fadeIn 0.5s ease-out;
}

/* Custom scrollbar for the form */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 58, 138, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.7);
}
</style>