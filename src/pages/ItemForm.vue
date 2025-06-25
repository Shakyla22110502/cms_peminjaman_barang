<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Tambah' }} Item</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block">Nama</label>
        <input v-model="form.name" type="text" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4">
        <label class="block">Kode Serial</label>
        <input v-model="form.serial_code" type="text" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4">
        <label class="block">Status Ketersediaan</label>
        <select v-model="form.is_available" class="w-full border p-2 rounded">
          <option :value="true">Tersedia</option>
          <option :value="false">Dipinjam</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block">Aktif</label>
        <select v-model="form.is_active" class="w-full border p-2 rounded">
          <option :value="true">Ya</option>
          <option :value="false">Tidak</option>
        </select>
      </div>

       <!-- Submit + Cancel -->
      <div class="flex gap-2">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ isEdit ? 'Update' : 'Simpan' }}
        </button>
        <button
          type="button"
          @click="router.back()"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../services/api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  serial_code: '',
  is_available: true,
  is_active: true
})

const getItem = async () => {
  const { data } = await axios.get(`/items/${route.params.id}`)
  form.value = data.data
}

const handleSubmit = async () => {
  const url = isEdit.value ? `/items/${route.params.id}` : '/items'
  const method = isEdit.value ? 'put' : 'post'
  await axios({ method, url, data: form.value })
  router.push('/items')
}

onMounted(() => {
  if (isEdit.value) getItem()
})
</script>
