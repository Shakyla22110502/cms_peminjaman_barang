<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle class="text-2xl font-bold">Manajemen Item</CardTitle>
              <CardDescription>
                Kelola data item yang dapat dipinjam
              </CardDescription>
            </div>
            <router-link v-if="hasPermission('create-items')" to="/items/create">
              <Button>
                <Plus class="w-4 h-4 mr-2" /> Tambah Item
              </Button>
            </router-link>
          </div>
        </CardHeader>
      </Card>

      <!-- Filter -->
      <Card>
        <CardContent class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div>
            <Label>Status Ketersediaan</Label>
            <Select v-model="filters.availability">
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="borrowed">Dipinjam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status Aktif</Label>
            <Select v-model="filters.active">
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Perlu Persetujuan</Label>
            <Select v-model="filters.approval">
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="yes">Ya</SelectItem>
                <SelectItem value="no">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cari Nama / Kode Serial</Label>
            <Input v-model="filters.search" placeholder="Cari item..." />
          </div>
        </CardContent>
      </Card>

      <!-- Tabel -->
      <Card>
        <CardHeader>
          <CardTitle>Daftar Item</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead>Persetujuan</TableHead>
                <TableHead v-if="hasPermission('edit-items')" class="text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(item, index) in filteredItems"
                :key="item.id"
              >
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell>
                  <div class="font-medium">{{ item.name }}</div>
                  <div v-if="item.description" class="text-sm text-muted-foreground">
                    {{ item.description }}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{{ item.serial_code }}</Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="item.is_available ? 'success' : 'destructive'">
                    {{ item.is_available ? 'Tersedia' : 'Dipinjam' }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="item.is_active ? 'default' : 'outline'">
                    {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :variant="item.is_approval ? 'warning' : 'secondary'">
                    {{ item.is_approval ? 'Ya' : 'Tidak' }}
                  </Badge>
                </TableCell>
                <TableCell v-if="hasPermission('edit-items')" class="text-right">
                  <div class="flex justify-end gap-2">
                    <router-link :to="`/items/edit/${item.id}`">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </router-link>
                    <Button
                      v-if="hasPermission('delete-items')"
                      size="sm"
                      variant="destructive"
                      @click="deleteItem(item.id)"
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <Inbox class="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 class="text-lg font-medium">Tidak ada item ditemukan</h3>
        <p class="text-sm text-muted-foreground">
          Coba ubah filter atau tambahkan item baru.
        </p>
        <div class="mt-4">
          <router-link v-if="hasPermission('create-items')" to="/items/create">
            <Button>
              <Plus class="w-4 h-4 mr-2" /> Tambah Item
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "../services/api"
import { useUserStore } from "../stores/UserStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Plus, Inbox } from "lucide-vue-next"

const items = ref([])
const filters = ref({
  availability: "all",
  active: "all",
  approval: "all",
  search: ""
})

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const getItems = async () => {
  try {
    const res = await axios.get("/items")
    items.value = res.data.data
  } catch (error) {
    console.error("Gagal memuat data items:", error)
  }
}

const deleteItem = async (id) => {
  if (confirm("Yakin ingin menghapus item ini?")) {
    try {
      await axios.delete(`/items/${id}`)
      await getItems()
    } catch (err) {
      alert("Gagal menghapus item.")
    }
  }
}

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchAvailability =
      filters.value.availability === "all" ||
      (filters.value.availability === "available" && item.is_available) ||
      (filters.value.availability === "borrowed" && !item.is_available)

    const matchActive =
      filters.value.active === "all" ||
      (filters.value.active === "active" && item.is_active) ||
      (filters.value.active === "inactive" && !item.is_active)

    const matchApproval =
      filters.value.approval === "all" ||
      (filters.value.approval === "yes" && item.is_approval) ||
      (filters.value.approval === "no" && !item.is_approval)

    const search = filters.value.search.toLowerCase()
    const matchSearch =
      (item.name?.toLowerCase() ?? "").includes(search) ||
      (item.serial_code?.toLowerCase() ?? "").includes(search)

    return matchAvailability && matchActive && matchApproval && matchSearch
  })
})

onMounted(() => {
  getItems()
})
</script>
