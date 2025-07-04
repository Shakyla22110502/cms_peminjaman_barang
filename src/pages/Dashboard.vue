<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-gray-600 mt-1">Ringkasan aktivitas dan data sistem</p>
        </div>

        <!-- Statistik Card Gabungan -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Statistik Sistem</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="flex items-center space-x-4">
              <div class="bg-blue-100 text-blue-600 p-3 rounded-lg">
                📦
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Item</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalItems }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-green-100 text-green-600 p-3 rounded-lg">
                ✅
              </div>
              <div>
                <p class="text-sm text-gray-500">Item Tersedia</p>
                <p class="text-2xl font-bold text-gray-800">{{ availableItems }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                🛡️
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Role</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalRoles }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                🔑
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Permission</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalPermissions }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                🏦
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Room</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalRooms }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                🏦
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Ruangan Dipinjam</p>
                <p class="text-2xl font-bold text-gray-800">{{ totalRoomsLoan }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bisa tambahkan bagian log aktivitas atau daftar item populer di bawah sini -->
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../services/api'


const totalItems = ref(0)
const availableItems = ref(0)
const totalRoles = ref(0)
const totalPermissions = ref(0)
const totalRooms = ref(0)
const totalRoomsLoan = ref(0)

const loadDashboardData = async () => {
  try {
    const [itemsRes, rolesRes, permissionsRes,roomsRes,roomsloanRes] = await Promise.all([
      axios.get('/items'),
      axios.get('/roles'),
      axios.get('/permissions'),
      axios.get('/rooms'),
      axios.get('/room-loans')
    ])
    totalItems.value = itemsRes.data.data.length
    availableItems.value = itemsRes.data.data.filter(i => i.is_available).length
    totalRoles.value = rolesRes.data.length
    totalPermissions.value = permissionsRes.data.length
    totalRooms.value = roomsRes.data.length
    totalRoomsLoan.value = roomsloanRes.data.length
  } catch (error) {
    console.error('Gagal memuat data dashboard:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
