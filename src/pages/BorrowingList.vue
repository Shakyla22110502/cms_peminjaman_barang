<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle class="text-2xl font-bold">Manajemen Peminjaman</CardTitle>
            <CardDescription>Kelola data peminjaman barang dengan mudah</CardDescription>
          </div>
          <Button v-if="hasPermission('create-borrowing')" asChild>
            <router-link to="/borrowings/create" class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Tambah Peminjaman
            </router-link>
          </Button>
        </CardHeader>
      </Card>

      <!-- Filter -->
      <Card>
        <CardContent class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="space-y-2">
            <Label>Cari Peminjam/Barang</Label>
            <Input v-model="search" placeholder="Cari nama peminjam atau barang" />
          </div>

          <!-- Status Peminjaman -->
          <div class="space-y-2">
            <Label>Status Peminjaman</Label>
            <Select v-model="statusFilter">
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="borrowed">Dipinjam</SelectItem>
                <SelectItem value="returned">Dikembalikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Status Persetujuan -->
          <div class="space-y-2">
            <Label>Status Persetujuan</Label>
            <Select v-model="approvalFilter">
              <SelectTrigger>
                <SelectValue placeholder="Semua Persetujuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Persetujuan</SelectItem>
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
        <CardHeader>
          <CardTitle class="text-xl font-semibold">Daftar Peminjaman</CardTitle>
        </CardHeader>

        <CardContent>
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-8">
            <span class="text-muted-foreground">Memuat data...</span>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <Button @click="fetchBorrowings">Coba Lagi</Button>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Barang</TableHead>
                  <TableHead>Tgl Pinjam</TableHead>
                  <TableHead>Tgl Kembali</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Persetujuan</TableHead>
                  <TableHead class="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="borrowing in filteredBorrowings"
                  :key="borrowing.id"
                >
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {{ borrowing.user?.name?.charAt(0)?.toUpperCase() || "U" }}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div class="font-medium">{{ borrowing.user?.name || "-" }}</div>
                        <div class="text-xs text-muted-foreground">ID: {{ borrowing.user?.id }}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div class="font-medium">{{ borrowing.item?.name || "-" }}</div>
                    <div class="text-xs text-muted-foreground">Kode: {{ borrowing.item?.code }}</div>
                  </TableCell>

                  <TableCell>{{ formatDate(borrowing.borrow_date) }}</TableCell>
                  <TableCell>{{ formatDate(borrowing.return_date) }}</TableCell>

                  <TableCell>
                    <Badge :variant="borrowing.is_returned ? 'success' : 'warning'">
                      {{ borrowing.is_returned ? "Dikembalikan" : "Dipinjam" }}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      :variant="{
                        pending: 'warning',
                        approved: 'success',
                        rejected: 'destructive'
                      }[borrowing.approval_status] || 'secondary'"
                    >
                      {{ borrowing.approval_status || "-" }}
                    </Badge>
                  </TableCell>

                  <TableCell class="text-right space-x-2">
                    <Button
                      v-if="hasPermission('edit-borrowing')"
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <router-link :to="`/borrowings/${borrowing.id}/edit`">
                        Edit
                      </router-link>
                    </Button>

                    <Button
                      v-if="!borrowing.is_returned"
                      size="sm"
                      variant="outline"
                      @click="markReturned(borrowing.id)"
                    >
                      Kembalikan
                    </Button>

                    <Button
                      v-if="hasPermission('delete-borrowing')"
                      size="sm"
                      variant="destructive"
                      @click="remove(borrowing.id)"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Empty -->
          <div v-if="!loading && filteredBorrowings.length === 0" class="text-center py-16">
            <Inbox class="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p class="text-muted-foreground">Tidak ada peminjaman ditemukan.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "@/services/api"
import { useUserStore } from "@/stores/UserStore"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Inbox } from "lucide-vue-next"

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const borrowings = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref("")
const statusFilter = ref("all")
const approvalFilter = ref("all")

const fetchBorrowings = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get("/borrowings")
    borrowings.value = res.data.data
  } catch (err) {
    error.value = "Gagal memuat data peminjaman."
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredBorrowings = computed(() =>
  borrowings.value.filter((b) => {
    const keyword = search.value.toLowerCase()
    const matchKeyword =
      b.user?.name?.toLowerCase().includes(keyword) ||
      b.item?.name?.toLowerCase().includes(keyword)

    const matchStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "borrowed" && !b.is_returned) ||
      (statusFilter.value === "returned" && b.is_returned)

    const matchApproval =
      approvalFilter.value === "all" || b.approval_status === approvalFilter.value

    return matchKeyword && matchStatus && matchApproval
  })
)

const formatDate = (dateStr) => (dateStr ? dateStr.slice(0, 10) : "-")

const markReturned = async (id) => {
  if (!confirm("Tandai peminjaman sebagai sudah dikembalikan?")) return
  try {
    await axios.put(`/borrowings/${id}`, { is_returned: true })
    await fetchBorrowings()
    alert("Barang berhasil ditandai sebagai dikembalikan.")
  } catch (err) {
    console.error(err)
    alert("Gagal mengembalikan barang.")
  }
}

const remove = async (id) => {
  if (!confirm("Yakin ingin menghapus peminjaman ini?")) return
  try {
    await axios.delete(`/borrowings/${id}`)
    borrowings.value = borrowings.value.filter((b) => b.id !== id)
  } catch (err) {
    alert("Gagal menghapus peminjaman.")
    console.error(err)
  }
}

onMounted(fetchBorrowings)
</script>
