<template>
  <div class="p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">
      {{ isEdit ? 'Edit Peminjaman' : 'Tambah Peminjaman' }}
    </h2>

    <form @submit.prevent="submit">
      <!-- Peminjam -->
      <div class="mb-4">
        <label class="block mb-1">Peminjam</label>
        <select v-model="form.users_id" class="w-full p-2 border rounded" required>
          <option disabled value="">Pilih Peminjam</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} ({{ user.code }})
          </option>
        </select>
      </div>

      <!-- Barang -->
      <div class="mb-4">
        <label class="block mb-1">Barang</label>
        <select v-model="form.item_id" class="w-full p-2 border rounded" required>
          <option disabled value="">Pilih Barang</option>
          <option v-for="item in items" :key="item.id" :value="item.id">
            {{ item.name }} - {{ item.serial_code }}
          </option>
        </select>
      </div>

      <!-- Tanggal Pinjam -->
      <div class="mb-4">
        <label class="block mb-1">Tanggal Pinjam</label>
        <input
          type="date"
          v-model="form.borrow_date"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <!-- Tanggal Kembali -->
      <div class="mb-4">
        <label class="block mb-1">Tanggal Kembali</label>
        <input
          type="date"
          v-model="form.return_date"
          class="w-full p-2 border rounded"
        />
      </div>

      <!-- Tombol Aksi -->
      <div class="flex gap-2">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan
        </button>
        <button type="button" @click="router.push('/borrowings')" class="px-4 py-2 border rounded">
          Batal
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
  users_id: '',
  item_id: '',
  borrow_date: '',
  return_date: '',
})

const users = ref([])
const items = ref([])

const loadData = async () => {
  try {
    // Ambil semua user
    const userRes = await axios.get('/users')
    users.value = userRes.data.data

    // Ambil semua item
    const itemRes = await axios.get('/items')
    const allItems = itemRes.data.data

    // Filter item jika create
    items.value = isEdit.value ? allItems : allItems.filter(item => item.is_available)

    // Jika edit, ambil data borrowing
    if (isEdit.value) {
      const res = await axios.get(`/borrowings/${route.params.id}`)
      const borrowing = res.data.data

      form.value = {
        users_id: borrowing.user?.id ?? '',
        item_id: borrowing.item?.id ?? '',
        borrow_date: borrowing.borrow_date?.slice(0, 10) || '',
        return_date: borrowing.return_date?.slice(0, 10) || '',
      }
    }
  } catch (err) {
    console.error('Gagal memuat data:', err)
  }
}

const submit = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`/borrowings/${route.params.id}`, form.value)
    } else {
      await axios.post('/borrowings', form.value)
    }
    router.push('/borrowings')
  } catch (err) {
    alert('Gagal menyimpan data.')
    console.error(err)
  }
}

onMounted(loadData)
</script>
