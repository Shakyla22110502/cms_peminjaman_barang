<template>
  <div class="min-h-screen p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle class="text-2xl font-bold">Manajemen Role</CardTitle>
              <CardDescription>
                Kelola role dan hak akses pengguna
              </CardDescription>
            </div>
            <Button
              v-if="hasPermission('create-roles')"
              @click="openModal(null)"
            >
              <Plus class="w-4 h-4 mr-2" /> Tambah Role
            </Button>
          </div>
        </CardHeader>
      </Card>

      <!-- Table -->
      <Card>
        <!-- Filter -->
        <CardHeader>
          <Input 
            v-model="search" 
            type="text" 
            placeholder="Cari nama role..." 
            class="w-full sm:w-80"
          />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead v-if="hasPermission('edit-roles')" class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="(role, index) in filteredRoles"
                :key="role.id"
              >
                <TableCell>{{ index + 1 }}</TableCell>
                <TableCell class="font-medium">{{ role.name }}</TableCell>
                <TableCell>
                  <div class="flex flex-wrap gap-2">
                    <Badge 
                      v-for="perm in role.permissions" 
                      :key="perm.id"
                    >
                      {{ perm.name }}
                    </Badge>
                    <span v-if="role.permissions.length === 0" class="text-gray-400 text-sm">
                      Tidak ada permissions
                    </span>
                  </div>
                </TableCell>
                <TableCell v-if="hasPermission('edit-roles')" class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button size="sm" variant="outline" @click="openModal(role)">
                      Edit
                    </Button>
                    <Button
                      v-if="hasPermission('delete-roles')"
                      size="sm"
                      variant="destructive"
                      @click="deleteRole(role.id)"
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredRoles.length === 0">
                <TableCell colspan="4" class="text-center py-10 text-gray-500">
                  Tidak ada role ditemukan
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Modal -->
      <Dialog v-model:open="showModal">
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {{ editingRole ? 'Edit Role' : 'Tambah Role' }}
            </DialogTitle>
            <DialogDescription>
              {{ editingRole ? 'Ubah data role yang dipilih' : 'Tambah role baru beserta permissions' }}
            </DialogDescription>
          </DialogHeader>

          <form @submit.prevent="saveRole" class="space-y-6">
            <div class="space-y-2">
              <Label>Nama Role</Label>
              <Input 
                v-model="form.name" 
                required 
                placeholder="Masukkan nama role"
              />
            </div>

            <div class="space-y-2">
              <Label>Permissions</Label>
              <div v-if="allPermissions.length === 0" class="text-center py-4 text-gray-500">
                Loading permissions...
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-md p-4">
                <div
                  v-for="permission in allPermissions"
                  :key="permission.id"
                  class="flex items-center space-x-2"
                >
                  <Checkbox
                    :id="'perm-' + permission.id"
                    v-model:checked="form.permissions"
                    :value="permission.name"
                  />
                  <label :for="'perm-' + permission.id" class="text-sm cursor-pointer">
                    {{ permission.name }}
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter class="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                @click="closeModal"
              >
                Batal
              </Button>
              <Button type="submit">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'

// shadcn-vue imports
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Plus } from 'lucide-vue-next'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const roles = ref([])
const allPermissions = ref([])
const showModal = ref(false)
const editingRole = ref(null)
const form = ref({ name: '', permissions: [] })
const search = ref('')

const filteredRoles = computed(() => {
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const fetchRoles = async () => {
  try {
    const res = await axios.get('/roles')
    roles.value = res.data
  } catch (err) {
    console.error('Error fetching roles:', err)
    alert('Gagal memuat data roles.')
  }
}

const fetchPermissions = async () => {
  try {
    const res = await axios.get('/permissions')
    allPermissions.value = res.data
  } catch (err) {
    console.error('Error fetching permissions:', err)
    allPermissions.value = []
  }
}

const openModal = (role) => {
  showModal.value = true
  editingRole.value = role
  if (role) {
    form.value = {
      name: role.name,
      permissions: role.permissions.map(p => p.name)
    }
  } else {
    form.value = { name: '', permissions: [] }
  }
}

const closeModal = () => {
  showModal.value = false
  editingRole.value = null
}

const saveRole = async () => {
  try {
    const payload = {
      name: form.value.name,
      permissions: form.value.permissions
    }

    if (editingRole.value) {
      await axios.put(`/roles/${editingRole.value.id}`, payload)
    } else {
      await axios.post('/roles', payload)
    }

    closeModal()
    fetchRoles()
    alert('Role berhasil disimpan!')
  } catch (err) {
    console.error('Error saving role:', err)
    alert('Gagal menyimpan role.')
  }
}

const deleteRole = async (id) => {
  if (confirm('Yakin ingin menghapus role ini?')) {
    try {
      await axios.delete(`/roles/${id}`)
      fetchRoles()
      alert('Role berhasil dihapus!')
    } catch (err) {
      console.error('Error deleting role:', err)
      alert('Gagal menghapus role.')
    }
  }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>
