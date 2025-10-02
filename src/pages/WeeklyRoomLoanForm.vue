<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-bold"> 
            {{ isEdit ? 'Edit Peminjaman Mingguan' : 'Tambah Peminjaman Mingguan' }}
          </CardTitle>
          <CardDescription>
            Isi detail peminjaman sesuai jadwal mingguan
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Ruangan -->
            <div>
              <Label for="room">Ruangan</Label>
              <Select v-model="form.room_id" required>
                <SelectTrigger id="room">
                  <SelectValue placeholder="Pilih Ruangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Pilih Ruangan</SelectItem>
                  <SelectItem
                    v-for="room in rooms"
                    :key="room.id"
                    :value="room.id"
                  >
                    {{ room.name }} ({{ room.location }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Nama Peminjam -->
            <div>
              <Label for="name">Nama Peminjam</Label>
              <Input
                id="name"
                v-model="form.borrower_name"
                required
                placeholder="Nama lengkap"
              />
            </div>

            <!-- Kontak Peminjam -->
            <div>
              <Label for="contact">Kontak</Label>
              <Input
                id="contact"
                v-model="form.borrower_contact"
                required
                placeholder="Nomor HP atau WA"
              />
            </div>

            <!-- Email -->
            <div>
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.emails"
                required
                placeholder="Email"
              />
            </div>

            <!-- Tujuan -->
            <div>
              <Label for="purpose">Tujuan</Label>
              <Textarea
                id="purpose"
                v-model="form.purpose"
                placeholder="Contoh: Rapat Mingguan"
              />
            </div>

            <!-- Hari -->
            <div>
              <Label for="day">Hari</Label>
              <Select v-model="form.day_of_week" required>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Pilih Hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Pilih Hari</SelectItem>
                  <SelectItem
                    v-for="(day, index) in dayNames"
                    :key="index"
                    :value="index"
                  >
                    {{ day }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Waktu -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label for="start_time">Waktu Mulai</Label>
                <Input
                  type="time"
                  id="start_time"
                  v-model="form.start_time"
                  required
                />
              </div>
              <div>
                <Label for="end_time">Waktu Selesai</Label>
                <Input
                  type="time"
                  id="end_time"
                  v-model="form.end_time"
                  required
                />
              </div>
            </div>

            <!-- Periode -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label for="start_date">Tanggal Mulai</Label>
                <Input
                  type="date"
                  id="start_date"
                  v-model="form.start_date"
                  required
                />
              </div>
              <div>
                <Label for="end_date">Tanggal Akhir</Label>
                <Input
                  type="date"
                  id="end_date"
                  v-model="form.end_date"
                  required
                />
              </div>
            </div>

            <!-- Tombol -->
            <div class="flex justify-end space-x-4 mt-6">
              <router-link to="/weekly-room-loans">
                <Button type="button" variant="outline">Batal</Button>
              </router-link>
              <Button type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../services/api'
import { useRoute, useRouter } from 'vue-router'

// shadcn-vue components
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'

const router = useRouter()
const route = useRoute()

const rooms = ref([])
const isEdit = ref(false)
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const form = ref({
  room_id: '',
  borrower_name: '',
  borrower_contact: '',
  purpose: '',
  emails: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  start_date: '',
  end_date: '',
})

const getRooms = async () => {
  const res = await axios.get('/rooms')
  rooms.value = res.data.data || res.data
}

const getLoan = async (id) => {
  const res = await axios.get(`/weekly-room-loans/${id}`)
  form.value = { ...res.data }
}

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      emails: form.value.emails ? [form.value.emails] : [],
    }

    if (isEdit.value) {
      await axios.put(`/weekly-room-loans/${route.params.id}`, payload)
      alert('Peminjaman berhasil diperbarui!')
    } else {
      await axios.post('/weekly-room-loans', payload)
      alert('Peminjaman berhasil ditambahkan!')
    }

    router.push('/weekly-room-loans')
  } catch (error) {
    alert('Gagal menyimpan data.')
    console.error(error)
  }
}

onMounted(() => {
  getRooms()
  if (route.params.id) {
    isEdit.value = true
    getLoan(route.params.id)
  }
})
</script>
