<template>
  <div class="bg-white shadow p-8 flex justify-between items-center">
    <div class="text-xl font-bold text-gray-800">
      CMS Peminjaman Barang & Peminjaman Ruangan
    </div>

    <div class="flex items-center gap-4">
      <!-- Nama user -->
      <div v-if="user" class="text-gray-600">Halo, {{ user.name }}</div>

      <button
        @click="logout"
        class="text-red-600 hover:underline flex items-center gap-2"
        :disabled="isLoading"
      >
        <template v-if="!isLoading">
          Logout
        </template>
        <template v-else>
          <svg class="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Logging out...
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { computed, ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const isLoading = ref(false)

const logout = async () => {
  isLoading.value = true
  try {
    // Simulasi delay (misal API logout nanti)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    userStore.clearUser()
    router.push({ name: 'Login' })
  } catch (e) {
    console.error('Gagal logout:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
