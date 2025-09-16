<template>
  <div class="p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
           <div>
            <CardTitle class="text-2xl font-bold">Manajemen Permission</CardTitle>
            <CardDescription>
              Kelola permission untuk hak akses pengguna
            </CardDescription>
           </div>
          <Button
            v-if="hasPermission('create-permissions')"
            @click="showForm"
          >
            <Plus class="w-4 h-4 mr-2" />
            Tambah Permission
          </Button>
          </div>
        </CardHeader>
      </Card>

      <!-- Form Tambah/Edit -->
      <Card v-if="formVisible" class="max-w-xl">
        <CardHeader>
          <CardTitle>{{ editing ? "Edit" : "Tambah" }} Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Nama Permission</Label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="Contoh: create-user"
                required
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                @click="cancelForm"
              >
                Batal
              </Button>
              <Button type="submit" :disabled="loading">
                {{ loading ? "Menyimpan..." : "Simpan" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Filter -->
      <Card>
        <CardContent>
          <Label for="search">Cari Permission</Label>
          <Input
            id="search"
            v-model="search"
            type="text"
            placeholder="Masukkan nama permission"
          />
        </CardContent>
      </Card>

      <!-- Table -->
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Permission</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(item, index) in filteredPermissions"
                :key="item.id"
              >
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell>{{ item.name }}</TableCell>
                <TableCell class="text-right space-x-2">
                  <Button
                    v-if="hasPermission('edit-permissions')"
                    size="sm"
                    variant="outline"
                    @click="editPermission(item)"
                  >
                    Edit
                  </Button>
                  <Button
                    v-if="hasPermission('delete-permissions')"
                    size="sm"
                    variant="destructive"
                    @click="deletePermission(item.id)"
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow v-if="filteredPermissions.length === 0 && !loading">
                <TableCell colspan="3" class="text-center">
                  Tidak ada permission ditemukan
                </TableCell>
              </TableRow>
              <TableRow v-if="loading">
                <TableCell colspan="3" class="text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "@/services/api"
import { useUserStore } from "../stores/UserStore"

// shadcn-vue
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Plus } from "lucide-vue-next"

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const permissions = ref([])
const formVisible = ref(false)
const editing = ref(false)
const loading = ref(false)
const search = ref("")
const form = ref({ id: null, name: "" })

const fetchPermissions = async () => {
  loading.value = true
  try {
    const res = await axios.get("/permissions")
    permissions.value = res.data.data || res.data || []
  } catch (error) {
    console.error(error)
    alert("Gagal memuat data permission.")
  } finally {
    loading.value = false
  }
}

const showForm = () => {
  editing.value = false
  form.value = { id: null, name: "" }
  formVisible.value = true
}

const cancelForm = () => {
  formVisible.value = false
  form.value = { id: null, name: "" }
}

const submitForm = async () => {
  loading.value = true
  try {
    if (editing.value) {
      await axios.put(`/permissions/${form.value.id}`, {
        name: form.value.name,
      })
      alert("Permission berhasil diperbarui.")
    } else {
      await axios.post("/permissions", { name: form.value.name })
      alert("Permission berhasil ditambahkan.")
    }
    fetchPermissions()
    cancelForm()
  } catch (error) {
    console.error(error)
    alert("Gagal menyimpan data.")
  } finally {
    loading.value = false
  }
}

const editPermission = (item) => {
  editing.value = true
  form.value = { ...item }
  formVisible.value = true
}

const deletePermission = async (id) => {
  if (confirm("Yakin ingin menghapus permission ini?")) {
    loading.value = true
    try {
      await axios.delete(`/permissions/${id}`)
      alert("Permission berhasil dihapus.")
      fetchPermissions()
    } catch (error) {
      console.error(error)
      alert("Gagal menghapus permission.")
    } finally {
      loading.value = false
    }
  }
}

// Filter
const filteredPermissions = computed(() => {
  return permissions.value.filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  fetchPermissions()
})
</script>
