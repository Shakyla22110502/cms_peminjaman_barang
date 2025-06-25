<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Tambah' }} User</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Nama -->
      <div class="mb-4">
        <label class="block">Nama</label>
        <input v-model="form.name" type="text" class="w-full border p-2 rounded" />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block">Email</label>
        <input v-model="form.email" type="email" class="w-full border p-2 rounded" />
      </div>

      <!-- Password (hanya saat create) -->
      <div class="mb-4" v-if="!isEdit">
        <label class="block">Password</label>
        <input v-model="form.password" type="password" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4" v-if="!isEdit">
        <label class="block">Konfirmasi Password</label>
        <input
          v-model="form.password_confirmation"
          type="password"
          class="w-full border p-2 rounded"
        />
      </div>

      <!-- Code -->
      <div class="mb-4">
        <label class="block">Code</label>
        <input v-model="form.code" type="text" class="w-full border p-2 rounded" />
      </div>

      <!-- Role -->
      <div class="mb-4">
        <label class="block">Role</label>
        <select v-model="form.roles" class="w-full border p-2 rounded">
          <option value="">Pilih Role</option>
          <option v-for="role in allRoles" :key="role" :value="role">{{ role }}</option>
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
  email: '',
  password: '',
  password_confirmation: '',
  code: '',
  roles: '', // string sementara, akan diubah jadi array saat submit
})

const allRoles = ref([])

const getRoles = async () => {
  try {
    const res = await axios.get('/roles/only-names')
    allRoles.value = res.data
  } catch (error) {
    console.error('Gagal mengambil roles:', error)
  }
}

const getUser = async () => {
  try {
    const res = await axios.get(`/users/${route.params.id}`)
    const user = res.data.data
    form.value.name = user.name
    form.value.email = user.email
    form.value.code = user.code
    form.value.roles = user.roles.length > 0 ? user.roles[0].name : ''
  } catch (e) {
    console.error('Gagal mengambil data user:', e)
  }
}

const handleSubmit = async () => {
  const url = isEdit.value ? `/users/${route.params.id}` : '/users'
  const method = isEdit.value ? 'put' : 'post'

  const payload = { ...form.value }

  // Convert role string to array
  payload.roles = payload.roles ? [payload.roles] : []

  // Hapus password jika kosong saat edit
  if (isEdit.value && !payload.password) {
    delete payload.password
    delete payload.password_confirmation
  }

  try {
    await axios({
      method,
      url,
      data: payload,
    })
    router.push('/users')
  } catch (e) {
    console.error('Gagal menyimpan user:', e)
  }
}

onMounted(() => {
  getRoles()
  if (isEdit.value) {
    getUser()
  }
})
</script>
