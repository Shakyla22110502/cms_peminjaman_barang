<template>
  <div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-2xl mx-auto px-4">
    <Card>
      <CardHeader>
        <CardTitle class="text-xl font-bold">{{ isEdit ? "Edit" : "Tambah" }} Item</CardTitle>
        <CardDescription>
          {{ isEdit ? "Ubah data item yang sudah ada" : "Isi data item baru di bawah ini" }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nama Item -->
          <div class="space-y-2">
            <Label for="name">Nama Item</Label>
            <Input id="name" v-model="form.name" placeholder="Masukkan nama item" />
          </div>

          <!-- Serial Code -->
          <div class="space-y-2">
            <Label for="serial_code">Kode Serial</Label>
            <div class="flex gap-2">
              <Input id="serial_code" v-model="form.serial_code" readonly class="flex-1" />
              <Button type="button" variant="secondary" @click="generateSerialCode">
                Generate
              </Button>
            </div>
          </div>

          <!-- Status Ketersediaan -->
          <div class="space-y-2">
            <Label for="is_available">Status Ketersediaan</Label>
            <Select v-model="form.is_available">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih status ketersediaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Tersedia</SelectItem>
                <SelectItem value="false">Dipinjam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Aktif -->
          <div class="space-y-2">
            <Label for="is_active">Status Aktif</Label>
            <Select v-model="form.is_active">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih status aktif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Persetujuan -->
          <div class="space-y-2">
            <Label for="is_approval">Perlu Persetujuan Admin</Label>
            <Select v-model="form.is_approval">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih status persetujuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ya, perlu persetujuan</SelectItem>
                <SelectItem value="false">Tidak perlu persetujuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>

      <CardFooter class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="router.back()">Batal</Button>
        <Button type="submit" @click="handleSubmit">
          {{ isEdit ? "Update" : "Simpan" }}
        </Button>
      </CardFooter>
    </Card>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "../services/api"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: "",
  serial_code: "",
  is_available: "true",
  is_active: "true",
  is_approval: "false",
})

const generateSerialCode = () => {
  const prefix = "IOT-"
  const randomNumber = Math.floor(1000 + Math.random() * 9000)
  const timestamp = new Date().getTime().toString().slice(-4)
  form.value.serial_code = `${prefix}${randomNumber}${timestamp}`
}

const getItem = async () => {
  try {
    const { data } = await axios.get(`/items/${route.params.id}`)
    form.value = {
      ...data.data,
      is_available: String(data.data.is_available),
      is_active: String(data.data.is_active),
      is_approval: String(data.data.is_approval),
    }
  } catch (error) {
    console.error(error)
    alert("Gagal memuat data item")
  }
}

const handleSubmit = async () => {
  const payload = {
    ...form.value,
    is_available: form.value.is_available === "true",
    is_active: form.value.is_active === "true",
    is_approval: form.value.is_approval === "true",
  }

  try {
    const url = isEdit.value ? `/items/${route.params.id}` : "/items"
    const method = isEdit.value ? "put" : "post"
    await axios({ method, url, data: payload })
    alert(`Item berhasil ${isEdit.value ? "diperbarui" : "ditambahkan"}!`)
    router.push("/items")
  } catch (error) {
    console.error(error)
    alert("Gagal menyimpan item")
  }
}

onMounted(() => {
  if (isEdit.value) {
    getItem()
  } else {
    generateSerialCode()
  }
})
</script>
