<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Lupa Password</CardTitle>
        <CardDescription class="text-center">
          Masukkan email Anda untuk menerima link reset password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <!-- Success/Error -->
          <Alert v-if="success" variant="success">
            {{ success }}
          </Alert>
          <Alert v-if="error" variant="destructive">
            {{ error }}
          </Alert>

          <!-- Submit -->
          <Button type="submit" class="w-full" :disabled="loading">
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
            <template v-else>Kirim Link Reset Password</template>
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex justify-center">
        <p class="text-sm text-gray-500">
          Sudah ingat password?
          <span
            @click="router.push({ name: 'Login' })"
            class="text-blue-600 hover:underline cursor-pointer ml-1"
          >
            Login di sini
          </span>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

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

const email = ref("")
const success = ref("")
const error = ref("")
const loading = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  error.value = ""
  success.value = ""
  loading.value = true

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/forgot-password",
      { email: email.value }
    )
    success.value =
      response.data.message ||
      "Link reset password telah dikirim ke email Anda."
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Terjadi kesalahan saat mengirim permintaan."
  } finally {
    loading.value = false
  }
}
</script>
