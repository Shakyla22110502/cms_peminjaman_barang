<template>
  <Card class="max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle class="text-xl font-bold">
        {{ isEdit ? "Edit Peminjaman Ruangan" : "Tambah Peminjaman Ruangan" }}
      </CardTitle>
      <CardDescription>
        Lengkapi form di bawah untuk {{ isEdit ? "mengubah" : "menambahkan" }} data
        peminjaman ruangan.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="submit" class="space-y-4">
        <!-- Ruangan -->
        <div class="space-y-2">
          <Label>Ruangan</Label>
          <Select v-model="form.room_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Ruangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Daftar Ruangan</SelectLabel>
                <SelectItem
                  v-for="room in rooms"
                  :key="room.id"
                  :value="room.id"
                >
                  {{ room.name }} ({{ room.location }})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Nama Peminjam -->
        <div class="space-y-2">
          <Label>Nama Peminjam</Label>
          <Input v-model="form.borrower_name" required placeholder="Masukkan nama" />
        </div>

        <!-- Kontak Peminjam -->
        <div class="space-y-2">
          <Label>Kontak Peminjam</Label>
          <Input v-model="form.borrower_contact" placeholder="Nomor HP / Telepon" />
        </div>

        <!-- Tujuan -->
        <div class="space-y-2">
          <Label>Tujuan</Label>
          <Textarea v-model="form.purpose" placeholder="Tuliskan tujuan peminjaman" />
        </div>

        <!-- Waktu Mulai -->
        <div class="space-y-2">
          <Label>Waktu Mulai</Label>
          <Input type="datetime-local" v-model="form.start_time" required />
        </div>

        <!-- Waktu Selesai -->
        <div class="space-y-2">
          <Label>Waktu Selesai</Label>
          <Input type="datetime-local" v-model="form.end_time" required />
        </div>

        <!-- Email Notifikasi -->
        <div class="space-y-2">
          <Label>Email Notifikasi (opsional)</Label>
          <Input
            v-model="form.emails"
            placeholder="Pisahkan dengan koma jika lebih dari satu"
          />
        </div>

        <!-- Status (hanya edit) -->
        <div class="space-y-2" v-if="isEdit">
          <Label>Status</Label>
          <Select v-model="form.status">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Tombol -->
        <div class="flex gap-2">
          <Button type="submit">Simpan</Button>
          <Button
            type="button"
            variant="secondary"
            @click="router.push('/room-loans')"
          >
            Batal
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "../services/api"

// shadcn-vue components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  room_id: "",
  borrower_name: "",
  borrower_contact: "",
  purpose: "",
  start_time: "",
  end_time: "",
  emails: "",
  status: "pending",
})

const rooms = ref([])

const loadData = async () => {
  try {
    // Ambil semua ruangan
    const roomRes = await axios.get("/rooms")
    rooms.value = roomRes.data.data

    // Jika edit, ambil data
    if (isEdit.value) {
      const res = await axios.get(`/room-loans/${route.params.id}`)
      const loan = res.data
      form.value = {
        room_id: loan.room_id ?? "",
        borrower_name: loan.borrower_name ?? "",
        borrower_contact: loan.borrower_contact ?? "",
        purpose: loan.purpose ?? "",
        start_time: loan.start_time ? loan.start_time.slice(0, 16) : "",
        end_time: loan.end_time ? loan.end_time.slice(0, 16) : "",
        emails: Array.isArray(loan.emails)
          ? loan.emails.join(", ")
          : loan.emails ?? "",
        status: loan.status ?? "pending",
      }
    }
  } catch (err) {
    console.error("Gagal memuat data:", err)
  }
}

const submit = async () => {
  try {
    let payload = { ...form.value }
    if (typeof payload.emails === "string" && payload.emails.trim() !== "") {
      payload.emails = payload.emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "")
    } else {
      payload.emails = []
    }

    if (isEdit.value) {
      await axios.put(`/room-loans/${route.params.id}`, payload)
    } else {
      await axios.post("/room-loans", payload)
    }

    router.push("/room-loans")
  } catch (err) {
    alert("Gagal menyimpan data.")
    console.error(err)
  }
}

onMounted(loadData)
</script>
