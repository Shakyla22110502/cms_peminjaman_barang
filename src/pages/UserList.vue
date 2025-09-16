<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <Card>
        <CardHeader class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle class="text-2xl font-bold">Manajemen User</CardTitle>
            <CardDescription>Kelola data pengguna sistem dengan mudah</CardDescription>
          </div>
          <RouterLink to="/users/create">
            <Button v-if="hasPermission('create-users')">
              <Plus class="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </RouterLink>
        </CardHeader>
      </Card>

      <!-- Filter Section -->
      <Card>
        <CardContent class="grid md:grid-cols-4 gap-6 p-6">
          <div class="space-y-2">
            <Label for="role">Peran</Label>
            <Select v-model="filters.role">
              <SelectTrigger id="role" class="w-full">
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="md:col-span-3 space-y-2">
            <Label for="search">Cari Nama / Email</Label>
            <Input
              id="search"
              v-model="filters.search"
              placeholder="Cari pengguna..."
              class="w-full sm:w-80"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Table Section -->
      <Card>
        <CardHeader>
          <CardTitle class="text-xl">Daftar User</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>NFC Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead class="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow
                  v-for="(user, index) in filteredUsers"
                  :key="user.id"
                >
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{{ user.name.charAt(0).toUpperCase() }}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div class="font-medium">{{ user.name }}</div>
                        <div class="text-xs text-gray-500">
                          Member since {{ formatDate(user.created_at) }}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{{ user.email }}</div>
                  </TableCell>
                  <TableCell>{{ user.phone || "N/A" }}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{{ user.code || "N/A" }}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{{ user.code_nfc || "N/A" }}</Badge>
                  </TableCell>
                  <TableCell>
                    <div class="flex flex-wrap gap-1">
                      <Badge
                        v-for="role in user.roles"
                        :key="role.id"
                        variant="outline"
                      >
                        {{ role.name }}
                      </Badge>
                      <Badge v-if="!user.roles || user.roles.length === 0" variant="secondary">
                        No Role
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell class="text-center">
                    <div class="flex justify-center gap-2">
                      <RouterLink :to="`/users/${user.id}/edit`">
                        <Button
                          v-if="hasPermission('edit-users')"
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                      </RouterLink>

                      <Button
                        v-if="hasPermission('delete-users')"
                        size="sm"
                        variant="destructive"
                        @click="deleteUser(user.id)"
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredUsers.length === 0" class="text-center py-10">
            <Users class="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 class="text-lg font-medium">Belum ada user</h3>
            <p class="text-gray-500">Tambahkan user pertama Anda.</p>
            <div class="mt-4">
              <RouterLink to="/users/create">
                <Button v-if="hasPermission('create-users')">
                  <Plus class="w-4 h-4 mr-2" />
                  Tambah User
                </Button>
              </RouterLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "../services/api"
import { useUserStore } from "../stores/UserStore"

// shadcn-vue components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// icons
import { Users, Plus } from "lucide-vue-next"

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const users = ref([])

const filters = ref({
  role: "all",
  search: "",
})

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const role = filters.value.role
    const search = filters.value.search.toLowerCase()

    const hasRole = (name) =>
      user.roles && user.roles.some((r) => r.name.toLowerCase().includes(name))

    const matchRole =
      role === "all" ||
      (role === "superadmin" && hasRole("superadmin")) ||
      (role === "admin" && hasRole("admin") && !hasRole("superadmin")) ||
      (role === "user" &&
        (!user.roles ||
          user.roles.length === 0 ||
          user.roles.every(
            (r) =>
              !r.name.toLowerCase().includes("admin") &&
              !r.name.toLowerCase().includes("superadmin"),
          )))

    const matchSearch =
      !search ||
      (user.name && user.name.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search))

    return matchRole && matchSearch
  })
})

const getUsers = async () => {
  try {
    const res = await axios.get("/users")
    users.value = res.data.data
  } catch (error) {
    console.error("Error loading users:", error)
  }
}

const deleteUser = async (id) => {
  if (confirm("Yakin ingin menghapus user ini?")) {
    try {
      await axios.delete(`/users/${id}`)
      getUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
onMounted(() => {
  getUsers()
})
</script>
