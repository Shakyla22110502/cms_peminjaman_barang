<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <Card>
        <!-- Header -->
        <CardHeader>
          <CardTitle class="text-xl font-bold">
            {{ isEdit ? 'Edit' : 'Tambah' }} User
          </CardTitle>
          <CardDescription>
            Isi data untuk {{ isEdit ? 'memperbarui' : 'menambahkan' }} user
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Nama -->
            <div class="space-y-2">
              <Label for="name">Nama Lengkap</Label>
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="contoh@email.com"
              />
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <Label for="phone">Nomor Telepon</Label>
              <div class="flex">
                <span class="inline-flex items-center px-3 border border-r-0 border-input bg-gray-100 text-gray-600 text-sm">
                  +62
                </span>
                <Input
                  id="phone"
                  v-model="form.phone_without_prefix"
                  type="tel"
                  placeholder="81234567890"
                  class="rounded-l-none"
                />
              </div>
            </div>

            <!-- Password (hanya saat create) -->
            <div v-if="!isEdit" class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Masukkan password"
              />
            </div>

            <div v-if="!isEdit" class="space-y-2">
              <Label for="password_confirmation">Konfirmasi Password</Label>
              <Input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                placeholder="Konfirmasi password"
              />
            </div>

            <!-- Code -->
            <div class="space-y-2">
              <Label for="code">Kode Unik</Label>
              <Input
                id="code"
                v-model="form.code"
                type="text"
                placeholder="Masukkan kode unik"
              />
            </div>

            <!-- Code NFC -->
            <div class="space-y-2">
              <Label for="code_nfc">Kode NFC</Label>
              <Input
                id="code_nfc"
                v-model="form.code_nfc"
                type="text"
                placeholder="Masukkan kode NFC"
              />
            </div>

            <!-- Role -->
            <div class="space-y-2">
              <Label for="roles">Role</Label>
              <Select v-model="form.roles">
                <SelectTrigger id="roles" class="w-full">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Daftar Role</SelectLabel>
                    <SelectItem
                      v-for="role in allRoles"
                      :key="role"
                      :value="role"
                    >
                      {{ role }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>

        <CardFooter class="flex justify-end gap-2">
          <Button variant="outline" type="button" @click="router.back()">
            Batal
          </Button>
          <Button type="submit" @click="handleSubmit">
            {{ isEdit ? 'Update' : 'Simpan' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../services/api'

// shadcn-vue components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  email: '',
  phone_without_prefix: '',
  password: '',
  password_confirmation: '',
  code: '',
  code_nfc: '',
  roles: '',
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
    form.value.code_nfc = user.code_nfc || ''
    form.value.roles = user.roles.length > 0 ? user.roles[0].name : ''

    if (user.phone && user.phone.startsWith('+62')) {
      form.value.phone_without_prefix = user.phone.slice(3)
    } else {
      form.value.phone_without_prefix = user.phone || ''
    }
  } catch (e) {
    console.error('Gagal mengambil data user:', e)
  }
}

const handleSubmit = async () => {
  const url = isEdit.value ? `/users/${route.params.id}` : '/users'
  const method = isEdit.value ? 'put' : 'post'

  const phoneWithoutZero = form.value.phone_without_prefix.replace(/^0+/, '')
  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: phoneWithoutZero ? '+62' + phoneWithoutZero : null,
    code: form.value.code,
    code_nfc: form.value.code_nfc,
    roles: form.value.roles ? [form.value.roles] : [],
  }

  if (!isEdit.value) {
    payload.password = form.value.password
    payload.password_confirmation = form.value.password_confirmation
  }

  try {
    await axios({ method, url, data: payload })
    router.push('/users')
  } catch (e) {
    console.error('Gagal menyimpan user:', e)
  }
}

onMounted(() => {
  getRoles()
  if (isEdit.value) getUser()
})
</script>
