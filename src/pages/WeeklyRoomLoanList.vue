<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <Card class="mb-6">
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle class="text-2xl font-bold">Manajemen Peminjaman Mingguan</CardTitle>
              <CardDescription>Kelola jadwal peminjaman mingguan</CardDescription>
            </div>
            <router-link
              v-if="hasPermission('create-weekly-room-loans')"
              to="/weekly-room-loans/create"
            >
              <Button>
                <Plus class="w-4 h-4 mr-2" />
                Tambah Peminjaman Mingguan
              </Button>
            </router-link>
          </div>
        </CardHeader>
      </Card>

      <!-- Filter -->
      <Card class="mb-6">
        <CardContent class="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div class="w-full sm:w-1/3">
            <Label for="name">Cari Nama Peminjam</Label>
            <Input
              id="name"
              v-model="filters.name"
              placeholder="Nama Peminjam"
            />
          </div>
          <div class="w-full sm:w-1/3">
            <Label for="status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Table -->
      <Card>
        <CardContent>
          <div v-if="loading" class="p-6 text-gray-600">Memuat data...</div>
          <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>

          <div v-else>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead v-if="hasPermission('edit-weekly-room-loans')" class="text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="loan in filteredLoans"
                  :key="loan.id"
                >
                  <TableCell>{{ loan.room?.name || '-' }}</TableCell>
                  <TableCell>{{ loan.borrower_name }}</TableCell>
                  <TableCell>{{ loan.borrower_contact || '-' }}</TableCell>
                  <TableCell>{{ dayNames[loan.day_of_week] }}</TableCell>
                  <TableCell>{{ loan.start_time }} - {{ loan.end_time }}</TableCell>
                  <TableCell>
                    {{ loan.start_date }}<br />
                    <span class="text-gray-400">s/d</span><br />
                    {{ loan.end_date }}
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="loan.status === 'approved' ? 'success' : loan.status === 'pending' ? 'warning' : 'destructive'"
                    >
                      {{ statusLabel(loan.status) }}
                    </Badge>
                  </TableCell>
                  <TableCell v-if="hasPermission('edit-weekly-room-loans')" class="text-right">
                    <div class="flex justify-end space-x-2">
                      <router-link
                        :to="`/weekly-room-loans/${loan.id}/edit`"
                        v-if="hasPermission('edit-weekly-room-loans')"
                      >
                        <Button variant="outline" size="sm">Edit</Button>
                      </router-link>
                      <Button
                        v-if="hasPermission('delete-weekly-room-loans')"
                        variant="destructive"
                        size="sm"
                        @click="remove(loan.id)"
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div v-if="!loading && filteredLoans.length === 0" class="text-center py-12">
            <FolderX class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada hasil ditemukan</h3>
            <p class="mt-1 text-sm text-gray-500">Coba ubah filter atau tambahkan data baru.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderX } from 'lucide-vue-next'

const loans = ref([])
const loading = ref(true)
const error = ref(null)

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const filters = ref({
  name: '',
  status: ''
})

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const filteredLoans = computed(() => {
  return loans.value.filter((loan) => {
    const matchName = loan.borrower_name.toLowerCase().includes(filters.value.name.toLowerCase())
    const matchStatus = filters.value.status ? loan.status === filters.value.status : true
    return matchName && matchStatus
  })
})

const fetchLoans = async () => {
  loading.value = true
  try {
    const res = await axios.get('/weekly-room-loans')
    loans.value = res.data.data
  } catch (err) {
    error.value = 'Gagal memuat data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const statusLabel = (status) => {
  if (status === 'approved') return 'Disetujui'
  if (status === 'pending') return 'Menunggu'
  if (status === 'rejected') return 'Ditolak'
  return status
}

const remove = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await axios.delete(`/weekly-room-loans/${id}`)
    loans.value = loans.value.filter((l) => l.id !== id)
  } catch (err) {
    alert('Gagal menghapus data.')
    console.error(err)
  }
}

onMounted(fetchLoans)
</script>
