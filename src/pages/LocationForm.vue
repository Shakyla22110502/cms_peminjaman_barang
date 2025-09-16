<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card class="w-full max-w-xl shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>
          {{ locationId ? 'Edit Lokasi' : 'Tambah Lokasi' }}
        </CardTitle>
        <CardDescription>
          {{ locationId ? 'Ubah detail lokasi.' : 'Masukkan detail lokasi baru.' }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="saveLocation" class="space-y-5">
          <div>
            <Label for="name">Nama Lokasi</Label>
            <Input
              id="name"
              type="text"
              placeholder="Contoh: Lantai 2"
              v-model="form.name"
              required
            />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <Button variant="outline" @click="router.push('/locations')" type="button">
              Batal
            </Button>
            <Button type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/api'

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const router = useRouter()
const route = useRoute()

const locationId = route.params.id
const form = ref({ name: '' })

const getLocation = async () => {
  try {
    const res = await axios.get(`/locations/${locationId}`)
    form.value.name = res.data.data.name || ''
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data lokasi.')
  }
}

onMounted(() => {
  if (locationId) getLocation()
})

const saveLocation = async () => {
  try {
    if (locationId) {
      await axios.put(`/locations/${locationId}`, { name: form.value.name })
    } else {
      await axios.post('/locations', { name: form.value.name })
    }
    router.push('/locations')
  } catch (error) {
    console.error(error)
    alert('Gagal menyimpan lokasi.')
  }
}
</script>
