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
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3S9 6.343 9 8s1.343 3 3 3z M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"
            />
          </svg>
        </div>
      </div>

      <CardHeader class="pt-20">
        <CardTitle class="text-2xl text-center text-blue-100 font-bold">LOGIN</CardTitle>
        <CardDescription class="text-center text-blue-300/80">
          Masukkan email dan password untuk masuk
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email" class="text-blue-200">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              autocomplete="username"
              class="bg-blue-900/30 border-blue-600/50 text-blue-100 placeholder:text-blue-400/50 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password" class="text-blue-200">Password</Label>
            <div class="flex items-center space-x-2">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="••••••••"
                autocomplete="current-password"
                class="bg-blue-900/30 border-blue-600/50 text-blue-100 placeholder:text-blue-400/50 focus:ring-2 focus:ring-blue-400"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="showPassword = !showPassword"
                class="bg-blue-700/40 border-blue-600/50 text-blue-200 hover:bg-blue-600/60"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </Button>
            </div>
            <p
              @click="router.push({ name: 'ForgotPassword' })"
              class="text-sm text-blue-300 cursor-pointer hover:text-blue-200 hover:underline mt-1 text-center transition-colors duration-200"
            >
              Forgot Password?
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-300 text-sm text-center bg-red-500/20 py-2 rounded-md border border-red-500/30">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2 rounded-md transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
            :disabled="isLoading"
          >
            <template v-if="isLoading">
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
              Logging in...
            </template>
            <template v-else> 
              <span class="drop-shadow-sm">Login</span>
            </template>
          </Button>
        </form>
      </CardContent>
      
      <div class="px-6 pb-6 text-center">
        <p class="text-xs text-blue-400/60">
          © 2025 Admin Portal. All rights reserved.
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/UserStore"

// shadcn-vue components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const email = ref("")
const password = ref("")
const error = ref("")
const isLoading = ref(false)
const showPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ""
  isLoading.value = true

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
      email: email.value,
      password: password.value
    })

    const { token, user, permissions } = response.data
    userStore.setUser({ user, token, permissions })
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

    router.push({ name: "Dashboard" })
  } catch (err) {
    error.value = err.response?.data?.message || "Login gagal. Coba lagi."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Custom animations for the login form */
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