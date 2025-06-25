<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.token && !userStore.user) {
    userStore.fetchUser()
  }
})
</script>

