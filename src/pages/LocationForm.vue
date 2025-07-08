<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8">
    <div class="bg-white rounded-xl shadow-md w-full max-w-xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-900">
        {{ locationId ? 'Edit Lokasi' : 'Tambah Lokasi' }}
      </h2>
      <form @submit.prevent="saveLocation" class="space-y-5">
        <div>
          <label class="block font-medium mb-1 text-gray-700">Nama Lokasi</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            required
            placeholder="Contoh: Lantai 2"
          />
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <router-link
            to="/locations"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/api'

const router = useRouter()
const route = useRoute()

const locationId = route.params.id
const form = ref({
  name: ''
})

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
  if (locationId) {
    getLocation()
  }
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
