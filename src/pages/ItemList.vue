<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Item</h1>
            <p class="text-gray-600 mt-1">Kelola data item yang dapat dipinjam</p>
          </div>
          <router-link 
            v-if="hasPermission('create-items')"
            to="/items/create" 
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Tambah Item
          </router-link>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-50 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Item</p>
              <p class="text-2xl font-bold text-gray-900">{{ items.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-50 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tersedia</p>
              <p class="text-2xl font-bold text-green-600">{{ availableItems }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-50 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Dipinjam</p>
              <p class="text-2xl font-bold text-yellow-600">{{ borrowedItems }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-50 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tidak Aktif</p>
              <p class="text-2xl font-bold text-red-600">{{ inactiveItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Item</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Nama Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Kode Serial</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Kondisi</th>
                <th v-if="hasPermission('edit-items')" class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ item.serial_code }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': item.is_available,
                      'bg-yellow-100 text-yellow-800': !item.is_available
                    }"
                  >
                    <svg 
                      class="w-3 h-3 mr-1"
                      :class="{
                        'text-green-400': item.is_available,
                        'text-yellow-400': !item.is_available
                      }"
                      fill="currentColor" 
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {{ item.is_available ? 'Tersedia' : 'Dipinjam' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': item.is_active,
                      'bg-red-100 text-red-800': !item.is_active
                    }"
                  >
                    {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-3">
                    <router-link 
                      v-if="hasPermission('edit-items')"
                      :to="`/items/edit/${item.id}`" 
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </router-link>
                    <button 
                      v-if="hasPermission('delete-items')"
                      @click="deleteItem(item.id)" 
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div v-if="items.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada item</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan item pertama Anda.</p>
          <div class="mt-6">
            <router-link 
              to="/items/create" 
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Tambah Item
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)



const items = ref([])

// Computed properties for statistics
const availableItems = computed(() => items.value.filter(item => item.is_available).length)
const borrowedItems = computed(() => items.value.filter(item => !item.is_available).length)
const inactiveItems = computed(() => items.value.filter(item => !item.is_active).length)

const getItems = async () => {
  try {
    const res = await axios.get('/items')
    items.value = res.data.data
  } catch (error) {
    console.error('Error loading items:', error)
  }
}

const deleteItem = async (id) => {
  if (confirm('Yakin ingin menghapus item ini?')) {
    try {
      await axios.delete(`/items/${id}`)
      getItems() // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Gagal menghapus item. Silakan coba lagi.')
    }
  }
}

onMounted(() => {
  getItems()
})
</script>