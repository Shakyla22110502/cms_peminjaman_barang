<template>
  <header class="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <div class="p-2 bg-gray-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-semibold text-gray-800">CMS Peminjaman</h1>
        <p class="text-sm text-gray-500">Barang & Ruangan</p>
      </div>
    </div>

    <!-- Info user & logout -->
    <div class="flex items-center gap-3">
      <div v-if="user" class="flex items-center gap-2 text-gray-700">
        <div class="p-1 bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span class="text-sm font-medium">Halo, {{ user.name }}</span>
      </div>

      <Button
        :disabled="isLoading"
        @click="logout"
        class="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md px-4 py-2 flex items-center gap-2"
      >
        <template v-if="!isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </template>
        <template v-else>
          <svg class="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </template>
      </Button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/UserStore"
import { computed, ref } from "vue"
import { Button } from "@/components/ui/button"

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const isLoading = ref(false)

const logout = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    userStore.clearUser()
    router.push({ name: "Login" })
  } finally {
    isLoading.value = false
  }
}
</script>
