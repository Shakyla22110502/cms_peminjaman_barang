<template> 
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2 text-lg">Ringkasan aktivitas dan data sistem</p>
      </div>

      <!-- Statistik Card Gabungan -->
      <Card class="border-0 rounded-2xl shadow">
        <CardHeader>
          <CardTitle class="text-xl font-semibold flex items-center gap-2">
            <Home class="w-5 h-5 text-gray-600" />
            Statistik Sistem
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <!-- Total Item Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-blue-100 text-blue-600 p-2 rounded-md mb-2">
                <Package class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Total Item</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ totalItems }}</p>
            </Card>

            <!-- Item Tersedia Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-green-100 text-green-600 p-2 rounded-md mb-2">
                <Check class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Item Tersedia</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ availableItems }}</p>
            </Card>

            <!-- Total Role Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-yellow-100 text-yellow-600 p-2 rounded-md mb-2">
                <Shield class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Total Role</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ totalRoles }}</p>
            </Card>

            <!-- Total Permission Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-purple-100 text-purple-600 p-2 rounded-md mb-2">
                <Key class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Total Permission</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ totalPermissions }}</p>
            </Card>

            <!-- Total Room Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-cyan-100 text-cyan-600 p-2 rounded-md mb-2">
                <Building2 class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Total Room</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ totalRooms }}</p>
            </Card>

            <!-- Total Ruangan Dipinjam Card -->
            <Card class="flex flex-col items-center justify-center p-4 shadow hover:shadow-md transition">
              <div class="bg-pink-100 text-pink-600 p-2 rounded-md mb-2">
                <CalendarCheck2 class="w-5 h-5" />
              </div>
              <p class="text-sm text-gray-500 font-medium text-center">Total Ruangan Dipinjam</p>
              <p class="text-2xl font-bold text-gray-900 text-center">{{ totalRoomsLoan }}</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "../services/api"

// shadcn-vue components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Package, Check, Shield, Key, Building2, CalendarCheck2, Home } from "lucide-vue-next"

const totalItems = ref(0)
const availableItems = ref(0)
const totalRoles = ref(0)
const totalPermissions = ref(0)
const totalRooms = ref(0)
const totalRoomsLoan = ref(0)

const loadDashboardData = async () => {
  try {
    const [itemsRes, rolesRes, permissionsRes, roomsRes, roomsloanRes] =
      await Promise.all([
        axios.get("/items"),
        axios.get("/roles"),
        axios.get("/permissions"),
        axios.get("/rooms"),
        axios.get("/room-loans"),
      ])

    totalItems.value = itemsRes.data.data.length
    availableItems.value = itemsRes.data.data.filter((i) => i.is_available).length
    totalRoles.value = rolesRes.data.length
    totalPermissions.value = permissionsRes.data.length
    totalRooms.value = roomsRes.data.data.length
    totalRoomsLoan.value = roomsloanRes.data.length
  } catch (error) {
    console.error("Gagal memuat data dashboard:", error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
