<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Peminjaman</h1>
            <p class="text-gray-600 mt-1">Kelola data peminjaman barang</p>
          </div>
          <router-link
            v-if="hasPermission('create-borrowing')"
            to="/borrowings/create"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Peminjaman
          </router-link>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Peminjaman</h3>
        </div>

        <!-- Filter -->
        <div class="px-6 pb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama peminjam atau barang"
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <select
            v-model="statusFilter"
            class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Semua Status</option>
            <option value="borrowed">Dipinjam</option>
            <option value="returned">Dikembalikan</option>
          </select>
        </div>

        <!-- Table Body -->
        <div v-if="loading" class="p-6 text-gray-600">Memuat data...</div>
        <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Peminjam</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Barang</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Tgl Pinjam</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Tgl Kembali</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
                <th v-if="hasPermission('edit-borrowing')" class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="borrowing in filteredBorrowings"
                :key="borrowing.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ borrowing.user?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ borrowing.item?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(borrowing.borrow_date) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(borrowing.return_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="borrowing.is_returned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ borrowing.is_returned ? 'Dikembalikan' : 'Dipinjam' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <router-link
                      v-if="hasPermission('edit-borrowing')"
                      :to="`/borrowings/${borrowing.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      Edit
                    </router-link>
                    <button
                      v-if="!borrowing.is_returned"
                      @click="markReturned(borrowing.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      Kembalikan
                    </button>
                    <button
                      v-if="hasPermission('delete-borrowing')"
                      @click="remove(borrowing.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredBorrowings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada peminjaman ditemukan</h3>
          <p class="mt-1 text-sm text-gray-500">Coba ubah kata kunci atau filter status di atas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const borrowings = ref([])
const loading = ref(true)
const error = ref(null)

const search = ref('')
const statusFilter = ref('') // '', 'borrowed', 'returned'

const fetchBorrowings = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/borrowings')
    borrowings.value = res.data.data
  } catch (err) {
    error.value = 'Gagal memuat data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredBorrowings = computed(() => {
  return borrowings.value.filter((b) => {
    const keyword = search.value.toLowerCase()
    const matchKeyword =
      b.user?.name?.toLowerCase().includes(keyword) ||
      b.item?.name?.toLowerCase().includes(keyword)

    const matchStatus =
      statusFilter.value === '' ||
      (statusFilter.value === 'borrowed' && !b.is_returned) ||
      (statusFilter.value === 'returned' && b.is_returned)

    return matchKeyword && matchStatus
  })
})

const formatDate = (dateStr) => {
  return dateStr ? dateStr.slice(0, 10) : '-'
}

const markReturned = async (id) => {
  if (!confirm('Tandai sebagai dikembalikan?')) return
  try {
    await axios.put(`/borrowings/${id}`, {
      is_returned: true
    })
    await fetchBorrowings()
    alert('Berhasil menandai sebagai dikembalikan!')
  } catch (err) {
    console.error(err)
    alert('Gagal menandai sebagai dikembalikan.')
  }
}


const remove = async (id) => {
  if (!confirm('Yakin ingin menghapus peminjaman ini?')) return
  try {
    await axios.delete(`/borrowings/${id}`)
    borrowings.value = borrowings.value.filter(b => b.id !== id)
  } catch (err) {
    alert('Gagal menghapus peminjaman.')
    console.error(err)
  }
}

onMounted(fetchBorrowings)
</script>
