<template>
  <aside class="h-full p-4">
    <nav class="space-y-4">
      <RouterLink
        v-if="hasPermission('view dashboard')"
        to="/"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Dashboard
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage users')"
        to="/users"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Manajemen Users
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage items')"
        to="/items"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Manajemen Item
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage borrowing')"
        to="/borrowings"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Manajemen Peminjaman
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage roles')"
        to="/roles"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Manajemen Role
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage permissions')"
        to="/permissions"
        class="block px-4 py-2 rounded hover:bg-blue-700"
      >
        Manajemen Permission
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()

const hasPermission = (perm) => {
  return userStore.permissions.includes(perm)
}
</script>
