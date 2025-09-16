<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Daftar Ruangan</CardTitle>
            <CardDescription>Kelola data ruangan yang tersedia</CardDescription>
          </div>

          <Button
            v-if="hasPermission('create-rooms')"
            @click="router.push('/rooms/create')"
            variant="default"
            class="inline-flex items-center gap-2"
          >
            <Plus class="w-4 h-4" /> Tambah Ruangan
          </Button>
        </div>
      </Card>

      <!-- Filter -->
      <Card class="p-4 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div class="w-full sm:w-1/3">
          <Label for="search">Cari Nama Ruangan</Label>
          <Input id="search" v-model="search" placeholder="Nama Ruangan" />
        </div>
        <div class="w-full sm:w-48">
          <Label for="statusFilter">Status</Label>
          <Select id="statusFilter" v-model="statusFilter">
            <SelectTrigger>
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <!-- Tabel -->
      <Card class="overflow-x-auto p-0">
        <table class="w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Lokasi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Kapasitas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Deskripsi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in filteredRooms" :key="room.id" class="border-b">
              <td class="px-6 py-4">{{ room.name }}</td>
              <td class="px-6 py-4">{{ room.location }}</td>
              <td class="px-6 py-4">{{ room.capacity }}</td>
              <td class="px-6 py-4">{{ room.description || '-' }}</td>
              <td class="px-6 py-4">
                <Badge :variant="room.is_active ? 'success' : 'destructive'">
                  {{ room.is_active ? 'Aktif' : 'Nonaktif' }}
                </Badge>
              </td>
              <td class="px-6 py-4 flex gap-2">
                <Button
                  v-if="hasPermission('edit-rooms')"
                  size="sm"
                  variant="secondary"
                  @click="router.push(`/rooms/${room.id}/edit`)"
                  class="inline-flex items-center gap-1"
                >
                  <Edit class="w-3 h-3" /> Edit
                </Button>
                <Button
                  v-if="hasPermission('delete-rooms')"
                  size="sm"
                  variant="destructive"
                  @click="deleteRoom(room.id)"
                  class="inline-flex items-center gap-1"
                >
                  <Trash class="w-3 h-3" /> Hapus
                </Button>
              </td>
            </tr>
            <tr v-if="filteredRooms.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">Tidak ada ruangan ditemukan</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/api'
import { useUserStore } from '@/stores/UserStore'

import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const rooms = ref([])
const search = ref('')
const statusFilter = ref('semua')

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

const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const cocokNama = room.name.toLowerCase().includes(search.value.toLowerCase())
    const cocokStatus =
      statusFilter.value === 'semua' ||
      (statusFilter.value === 'aktif' && room.is_active) ||
      (statusFilter.value === 'nonaktif' && !room.is_active)
    return cocokNama && cocokStatus
  })
})

onMounted(getRooms)
</script>
