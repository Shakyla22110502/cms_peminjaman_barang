<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <Card>
        <!-- Header -->
        <CardHeader>
          <CardTitle class="text-xl font-bold">
            {{ isEdit ? "Edit Peminjaman" : "Tambah Peminjaman" }}
          </CardTitle>
          <CardDescription>
            {{ isEdit ? "Perbarui data peminjaman" : "Tambah data peminjaman baru" }}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-6">
            <Loader2 class="w-5 h-5 animate-spin text-gray-600" />
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submit" class="space-y-4">
            <!-- Peminjam -->
            <div class="space-y-2">
              <Label>Peminjam</Label>
              <template v-if="isEdit">
                <Input :value="selectedUserLabel" readonly />
              </template>
              <template v-else>
                <Select v-model="form.users_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Peminjam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }} ({{ user.code }})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </template>
            </div>

            <!-- Barang -->
            <div class="space-y-2">
              <Label>Barang</Label>
              <template v-if="isEdit">
                <Input :value="selectedItemLabel" readonly />
              </template>
              <template v-else>
                <Select v-model="form.item_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item in items"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }} - {{ item.serial_code }}
                      <span v-if="item.is_approval" class="text-amber-600">
                        (Perlu Persetujuan)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </template>
            </div>

            <!-- Info Persetujuan -->
            <div v-if="isEdit" class="space-y-2">
              <Label>Kebutuhan Persetujuan</Label>
              <Input
                :value="requiresApproval ? 'Ya, perlu persetujuan admin' : 'Tidak perlu persetujuan'"
                readonly
              />
            </div>

            <!-- Tanggal Pinjam -->
            <div class="space-y-2">
              <Label>Tanggal Pinjam</Label>
              <Input type="date" v-model="form.borrow_date" required />
            </div>

            <!-- Tanggal Kembali -->
            <div class="space-y-2">
              <Label>Tanggal Kembali</Label>
              <Input type="date" v-model="form.return_date" required />
            </div>

            <!-- Status Persetujuan -->
            <div v-if="isEdit && requiresApproval" class="space-y-2">
              <Label>Status Persetujuan</Label>
              <Select v-model="form.approval_status">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Tombol -->
            <div class="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                @click="router.push('/borrowings')"
              >
                Batal
              </Button>
              <Button type="submit" :disabled="saving">
                <Loader2 v-if="saving" class="w-4 h-4 animate-spin mr-2" />
                {{ saving ? "Menyimpan..." : "Simpan" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "../services/api"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-vue-next"

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  users_id: "",
  item_id: "",
  borrow_date: "",
  return_date: "",
  approval_status: "pending"
})

const users = ref([])
const items = ref([])
const requiresApproval = ref(false)

const selectedUserLabel = computed(() => {
  const user = users.value.find((u) => u.id === form.value.users_id)
  return user ? `${user.name} (${user.code})` : "User tidak ditemukan"
})

const selectedItemLabel = computed(() => {
  const item = items.value.find((i) => i.id === form.value.item_id)
  return item ? `${item.name} - ${item.serial_code}` : "Barang tidak ditemukan"
})

const loadData = async () => {
  loading.value = true
  try {
    const [userRes, itemRes] = await Promise.all([
      axios.get("/users"),
      axios.get("/items")
    ])

    users.value = userRes.data.data
    const allItems = itemRes.data.data
    items.value = isEdit.value ? allItems : allItems.filter((i) => i.is_available)

    if (isEdit.value) {
      const res = await axios.get(`/borrowings/${route.params.id}`)
      const b = res.data

      if (!users.value.find((u) => u.id === b.user?.id)) {
        users.value.push({
          id: b.user?.id,
          name: b.user?.name || "User tidak ditemukan",
          code: b.user?.code || ""
        })
      }

      if (!items.value.find((i) => i.id === b.item?.id)) {
        items.value.push({
          id: b.item?.id,
          name: b.item?.name || "Barang tidak ditemukan",
          serial_code: b.item?.serial_code || "",
          is_approval: b.item?.is_approval || false
        })
      }

      form.value = {
        users_id: Number(b.user?.id) || "",
        item_id: Number(b.item?.id) || "",
        borrow_date: b.borrow_date || "",
        return_date: b.return_date || "",
        approval_status: b.approval_status || "pending"
      }

      requiresApproval.value = b.item?.is_approval || false
    }
  } catch (err) {
    console.error("Gagal load data:", err)
    alert("Gagal memuat data.")
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!form.value.users_id || !form.value.item_id) {
    alert("Peminjam dan barang wajib dipilih.")
    return
  }

  if (form.value.return_date < form.value.borrow_date) {
    alert("Tanggal kembali tidak boleh lebih awal dari tanggal pinjam!")
    return
  }

  saving.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/borrowings/${route.params.id}`, form.value)
    } else {
      await axios.post("/borrowings", form.value)
    }
    alert("Data berhasil disimpan!")
    router.push("/borrowings")
  } catch (err) {
    console.error("Gagal simpan:", err)
    alert("Gagal menyimpan data.")
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
