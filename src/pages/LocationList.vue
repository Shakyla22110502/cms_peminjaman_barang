<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Daftar Lokasi</CardTitle>
            <CardDescription>Kelola data lokasi yang tersedia</CardDescription>
          </div>

          <Button
            v-if="hasPermission('create-location')"
            @click="router.push('/locations/create')"
            variant="default"
            class="inline-flex items-center gap-2"
          >
            <Plus class="w-4 h-4" /> Tambah Lokasi
          </Button>
        </div>
      </Card>

      <!-- Tabel -->
      <Card class="overflow-x-auto p-0">
        <table class="w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Nama
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Secret ID
              </th>
              <th v-if="hasPermission('edit-location')" class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in locations" :key="location.id" class="border-b">
              <td class="px-6 py-4">{{ location.name }}</td>
              <td class="px-6 py-4 flex items-center gap-2">
                <span class="break-all">{{ location.secret_id }}</span>
                <Button size="icon" variant="outline" @click="copyToClipboard(location.secret_id)" title="Salin Secret ID">
                  <Copy class="w-4 h-4" />
                </Button>
              </td>
              <td v-if="hasPermission('edit-location')" class="px-6 py-4 flex gap-2">
                <Button size="sm" variant="secondary" @click="router.push(`/locations/${location.id}/edit`)">
                  <Edit class="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" @click="deleteLocation(location.id)">
                  <Trash class="w-3 h-3 mr-1" /> Hapus
                </Button>
              </td>
            </tr>
            <tr v-if="locations.length === 0">
              <td colspan="3" class="text-center py-6 text-gray-500">Belum ada lokasi</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/api'
import { useUserStore } from '@/stores/UserStore'
import Swal from 'sweetalert2'

import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Copy, Edit, Trash } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const hasPermission = (perm) => userStore.permissions.includes(perm)
const locations = ref([])

const fetchLocations = async () => {
  try {
    const res = await axios.get('/locations')
    locations.value = res.data.data || res.data
  } catch (err) {
    console.error(err)
  }
}

const deleteLocation = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Lokasi?',
    text: 'Data ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Hapus',
  })
  if (result.isConfirmed) {
    try {
      await axios.delete(`/locations/${id}`)
      fetchLocations()
      Swal.fire('Terhapus!', 'Lokasi telah dihapus.', 'success')
    } catch (err) {
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error')
    }
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    Swal.fire({ icon: 'success', title: 'Disalin!', text: 'Secret ID berhasil disalin.' })
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyalin Secret ID.' })
  }
}

onMounted(fetchLocations)
</script>
