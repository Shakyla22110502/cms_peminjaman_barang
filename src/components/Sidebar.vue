<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col"
    >
      <!-- Logo Section -->
      <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-800 flex flex-col items-center">
        <img
          src="../assets/inventaris.png"
          alt="Logo"
          class="w-16 h-16 object-contain mb-2"
        />
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Inventaris App
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">v1.0</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <Button
          v-if="hasPermission('view-dashboard')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/" class="flex items-center gap-2">
            <Home class="w-5 h-5" />
            <span>Dashboard</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage users')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/users" class="flex items-center gap-2">
            <Users class="w-5 h-5" />
            <span>Manajemen Users</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage items')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/items" class="flex items-center gap-2">
            <Package class="w-5 h-5" />
            <span>Manajemen Item</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage borrowing')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/borrowings" class="flex items-center gap-2">
            <ClipboardList class="w-5 h-5" />
            <span>Peminjaman Barang</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage roles')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/roles" class="flex items-center gap-2">
            <Shield class="w-5 h-5" />
            <span>Manajemen Role</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage permissions')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/permissions" class="flex items-center gap-2">
            <Key class="w-5 h-5" />
            <span>Manajemen Permission</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage rooms')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/rooms" class="flex items-center gap-2">
            <Building2 class="w-5 h-5" />
            <span>Manajemen Ruangan</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage room-loans')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/room-loans" class="flex items-center gap-2">
            <CalendarCheck2 class="w-5 h-5" />
            <span>Peminjaman Ruangan</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage weekly-room-loans')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/weekly-room-loans" class="flex items-center gap-2">
            <Calendar class="w-5 h-5" />
            <span>Peminjaman Ruangan Mingguan</span>
          </RouterLink>
        </Button>

        <Button
          v-if="hasPermission('manage locations')"
          variant="ghost"
          asChild
          class="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          <RouterLink to="/locations" class="flex items-center gap-2">
            <MapPin class="w-5 h-5" />
            <span>Manajemen Location</span>
          </RouterLink>
        </Button>
      </nav>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
        © 2025 Inventaris App. All rights reserved.
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/UserStore"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Package,
  ClipboardList,
  Shield,
  Key,
  Building2,
  CalendarCheck2,
  Calendar,
  MapPin,
} from "lucide-vue-next"

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)
</script>
