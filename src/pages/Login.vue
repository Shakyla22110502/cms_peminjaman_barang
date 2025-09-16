<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Login</CardTitle>
        <CardDescription class="text-center">
          Masukkan email dan password untuk masuk
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="username"
              required
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </Button>
            <p
              @click="router.push({ name: 'ForgotPassword' })"
              class="text-sm text-blue-600 cursor-pointer hover:underline mt-1 text-right"
            >
              Forgot Password?
            </p>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="text-red-500 text-sm text-center bg-red-100 py-2 rounded-md"
          >
            {{ error }}
          </div>

          <!-- Submit -->
          <Button type="submit" class="w-full" :disabled="isLoading">
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
            <template v-else>Login</template>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/UserStore"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
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
      password: password.value,
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
