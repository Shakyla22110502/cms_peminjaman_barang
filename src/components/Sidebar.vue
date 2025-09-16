<template>
  <aside class="h-full w-64 p-4 bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo Section -->
    <div class="mb-8 flex flex-col items-center">
      <img src="../assets/inventaris.png" alt="Logo" class="w-20 h-20 object-contain mb-2" />
      <h1 class="text-lg font-semibold text-gray-800">Inventaris App</h1>
      <p class="text-xs text-gray-500">v1.0</p>
    </div>

    <!-- Navigation Section -->
    <nav class="flex-1 space-y-1">
      <Button
        v-if="hasPermission('view-dashboard')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Home class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Dashboard</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage users')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/users" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Users class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Users</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage items')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/items" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Package class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Item</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage borrowing')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/borrowings" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <ClipboardList class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Peminjaman Barang</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage roles')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/roles" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Shield class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Role</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage permissions')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/permissions" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Key class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Permission</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage rooms')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/rooms" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Building2 class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Ruangan</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage room-loans')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/room-loans" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <CalendarCheck2 class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Peminjaman Ruangan</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage weekly-room-loans')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/weekly-room-loans" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <Calendar class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Peminjaman Ruangan Mingguan</span>
        </RouterLink>
      </Button>

      <Button
        v-if="hasPermission('manage location')"
        variant="ghost"
        asChild
        class="w-full justify-start"
      >
        <RouterLink to="/locations" class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-300">
          <MapPin class="w-5 h-5 text-gray-600" />
          <span class="text-gray-800 font-medium">Manajemen Location</span>
        </RouterLink>
      </Button>
    </nav>

    <!-- Footer -->
    <div class="mt-auto text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
      © 2025 Inventaris App. All rights reserved.
    </div>
  </aside>
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
