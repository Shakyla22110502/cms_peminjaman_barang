<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader class="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <CardTitle class="text-2xl font-bold">Manajemen Peminjaman Ruangan</CardTitle>
            <CardDescription>Kelola data peminjaman ruangan</CardDescription>
          </div>
          <router-link v-if="hasPermission('create-room-loans')" to="/room-loans/create">
            <Button>
              <Plus class="w-4 h-4 mr-2" />
              Tambah Peminjaman Ruangan
            </Button>
          </router-link>
        </CardHeader>
      </Card>

      <!-- Filter -->
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Cari data berdasarkan kriteria</CardDescription>
        </CardHeader>
        <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label for="name">Cari Nama Peminjam</Label>
            <Input id="name" v-model="filters.name" placeholder="Nama Peminjam" />
          </div>
          <div>
            <Label for="status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Tabel -->
      <Card>
        <CardContent>
          <div v-if="loading" class="p-6 text-gray-600">Memuat data...</div>
          <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Ruangan</TableHead>
                <TableHead>Peminjam</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead v-if="hasPermission('edit-room-loans')" class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="loan in filteredLoans" :key="loan.id">
                <TableCell>{{ loan.room?.name || '-' }}</TableCell>
                <TableCell>{{ loan.borrower_name }}</TableCell>
                <TableCell>{{ loan.borrower_contact || '-' }}</TableCell>
                <TableCell>{{ loan.emails }}</TableCell>
                <TableCell>
                  {{ formatDateTime(loan.start_time) }}<br />
                  <span class="text-gray-400">s/d</span><br />
                  {{ formatDateTime(loan.end_time) }}
                </TableCell>
                <TableCell>
                  <Badge
                    :variant="loan.status === 'approved' ? 'success'
                      : loan.status === 'pending' ? 'warning'
                      : loan.status === 'rejected' ? 'destructive'
                      : 'secondary'"
                  >
                    {{ statusLabel(loan.status) }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end space-x-2">
                    <router-link
                      v-if="hasPermission('edit-room-loans')"
                      :to="`/room-loans/${loan.id}/edit`"
                    >
                      <Button size="sm" variant="outline">
                        <Edit class="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </router-link>
                    <Button
                      v-if="loan.status !== 'cancelled'"
                      size="sm"
                      variant="secondary"
                      @click="markCancelled(loan.id)"
                    >
                      <X class="w-4 h-4 mr-1" /> Batalkan
                    </Button>
                    <Button
                      v-if="hasPermission('delete-room-loans')"
                      size="sm"
                      variant="destructive"
                      @click="remove(loan.id)"
                    >
                      <Trash class="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Empty State -->
          <div v-if="!loading && filteredLoans.length === 0" class="text-center py-12">
            <Inbox class="mx-auto h-12 w-12 text-gray-400" />
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

// shadcn-vue imports
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// lucide icons
import { Plus, Edit, Trash, X, Inbox } from 'lucide-vue-next'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const loans = ref([])
const loading = ref(true)
const error = ref(null)

const filters = ref({
  name: '',
  status: '',
})

const filteredLoans = computed(() => {
  return loans.value.filter((loan) => {
    const matchName = loan.borrower_name.toLowerCase().includes(filters.value.name.toLowerCase())
    const matchStatus = filters.value.status ? loan.status === filters.value.status : true
    return matchName && matchStatus
  })
})

const fetchLoans = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/room-loans')
    loans.value = res.data
  } catch (err) {
    error.value = 'Gagal memuat data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dt) => {
  if (!dt) return '-'
  return dt.replace('T', ' ').slice(0, 16)
}

const statusLabel = (status) => {
  if (status === 'approved') return 'Disetujui'
  if (status === 'pending') return 'Menunggu'
  if (status === 'rejected') return 'Ditolak'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

const markCancelled = async (id) => {
  if (!confirm('Batalkan peminjaman ruangan ini?')) return
  try {
    const res = await axios.get(`/room-loans/${id}`)
    const loan = res.data
    await axios.put(`/room-loans/${id}`, { ...loan, status: 'cancelled' })
    await fetchLoans()
    alert('Peminjaman berhasil dibatalkan!')
  } catch (err) {
    alert('Gagal membatalkan peminjaman.')
    console.error(err)
  }
}

const remove = async (id) => {
  if (!confirm('Yakin ingin menghapus peminjaman ruangan ini?')) return
  try {
    await axios.delete(`/room-loans/${id}`)
    loans.value = loans.value.filter((l) => l.id !== id)
  } catch (err) {
    alert('Gagal menghapus peminjaman.')
    console.error(err)
  }
}

onMounted(fetchLoans)
</script>
