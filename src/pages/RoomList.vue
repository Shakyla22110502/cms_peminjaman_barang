<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle class=" text-2xl font-bold">Daftar Ruangan</CardTitle>
              <CardDescription>Kelola data ruangan yang tersedia</CardDescription>
            </div>
            <Button
              v-if="hasPermission('create-rooms')"
              @click="router.push('/rooms/create')"
              class="inline-flex items-center gap-2"
            >
              <Plus class="w-4 h-4" /> Tambah Ruangan
            </Button>
          </div>
        </CardHeader>
      </Card>

      <!-- Filter -->
      <Card>
        <CardContent class="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div class="w-full sm:w-1/3 space-y-1">
            <Label for="search">Cari Nama Ruangan</Label>
            <Input id="search" v-model="search" placeholder="Nama Ruangan" />
          </div>
          <div class="w-full sm:w-48 space-y-1">
            <Label for="statusFilter">Status</Label>
            <Select v-model="statusFilter">
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
        </CardContent>
      </Card>

      <!-- Tabel -->
      <Card>
        <CardHeader>
          <CardTitle>Daftar Ruangan</CardTitle>
        </CardHeader>
        <CardContent class="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead v-if="hasPermission('edit-rooms')" class="text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(room, index) in filteredRooms" :key="room.id">
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell>
                  <div class="font-medium">{{ room.name }}</div>
                </TableCell>
                <TableCell>{{ room.location }}</TableCell>
                <TableCell>{{ room.capacity }}</TableCell>
                <TableCell>{{ room.description || '-' }}</TableCell>
                <TableCell>
                  <Badge :variant="room.is_active ? 'success' : 'destructive'">
                    {{ room.is_active ? 'Aktif' : 'Nonaktif' }}
                  </Badge>
                </TableCell>
                <TableCell v-if="hasPermission('edit-rooms')" class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button
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
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <div v-if="filteredRooms.length === 0" class="text-center py-12">
        <Inbox class="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 class="text-lg font-medium">Tidak ada ruangan ditemukan</h3>
        <p class="text-sm text-muted-foreground">
          Coba ubah filter atau tambahkan ruangan baru.
        </p>
        <div class="mt-4">
          <router-link v-if="hasPermission('create-rooms')" to="/rooms/create">
            <Button>
              <Plus class="w-4 h-4 mr-2" /> Tambah Ruangan
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/api'
import { useUserStore } from '@/stores/UserStore'

// shadcn-vue components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Plus, Edit, Trash, Inbox } from 'lucide-vue-next'

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
