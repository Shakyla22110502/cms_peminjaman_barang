<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Daftar Ruangan</h2>
          <p class="text-gray-600 mt-1">Kelola data ruangan yang tersedia</p>
        </div>
        <router-link
          to="/rooms/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Ruangan
        </router-link>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-lg shadow border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Nama</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Lokasi</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Kapasitas</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Deskripsi</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="room in rooms" :key="room.id">
              <td class="px-6 py-4">{{ room.name }}</td>
              <td class="px-6 py-4">{{ room.location }}</td>
              <td class="px-6 py-4">{{ room.capacity }}</td>
              <td class="px-6 py-4">{{ room.description || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  :class="room.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ room.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <router-link
                  v-if="hasPermission('edit-room')"
                  :to="`/rooms/${room.id}/edit`"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </router-link>
                <button
                  v-if="hasPermission('delete-room')"
                  @click="deleteRoom(room.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="rooms.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">Belum ada ruangan</td>
            </tr>
          </tbody>
        </table>
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

const rooms = ref([])

const getRooms = async () => {
  const res = await axios.get('/rooms')
  rooms.value = res.data.data || res.data
}

const deleteRoom = async (id) => {
  if (confirm('Yakin hapus ruangan ini?')) {
    await axios.delete(`/rooms/${id}`)
    getRooms()
  }
}

onMounted(getRooms)
</script>
