<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8">
    <Card class="w-full max-w-xl">
      <CardHeader>
        <CardTitle class="text-xl font-bold">
          {{ roomId ? 'Edit Ruangan' : 'Tambah Ruangan' }}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="saveRoom" class="space-y-5">
          <!-- Nama Ruangan -->
          <div class="space-y-1">
            <Label for="name">Nama Ruangan</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Ruang Rapat 1"
            />
          </div>

          <!-- Lokasi -->
          <div class="space-y-1">
            <Label for="location">Lokasi</Label>
            <Input
              id="location"
              v-model="form.location"
              type="text"
              placeholder="Contoh: Lantai 2"
            />
          </div>

          <!-- Kapasitas -->
          <div class="space-y-1">
            <Label for="capacity">Kapasitas</Label>
            <Input
              id="capacity"
              v-model.number="form.capacity"
              type="number"
              min="0"
              placeholder="Contoh: 20"
            />
          </div>

          <!-- Deskripsi -->
          <div class="space-y-1">
            <Label for="description">Deskripsi</Label>
            <Textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Deskripsi tambahan (opsional)"
            />
          </div>

          <!-- Aktif -->
          <div class="flex items-center space-x-2">
            <Checkbox id="is_active" v-model:checked="form.is_active" />
            <Label for="is_active">Aktif</Label>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end gap-2 pt-4">
            <router-link to="/rooms">
              <Button variant="outline">Batal</Button>
            </router-link>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../services/api'

// shadcn-vue components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  location: '',
  capacity: '',
  description: '',
  is_active: true,
})

const roomId = route.params.id

onMounted(async () => {
  if (roomId) {
    const res = await axios.get(`/rooms/${roomId}`)
    form.value = {
      ...res.data.data,
      is_active: !!res.data.data.is_active,
    }
  }
})

const saveRoom = async () => {
  if (!form.value.name) return
  if (roomId) {
    await axios.put(`/rooms/${roomId}`, form.value)
  } else {
    await axios.post('/rooms', form.value)
  }
  router.push('/rooms')
}
</script>
