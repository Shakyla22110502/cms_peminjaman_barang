import { defineStore } from 'pinia'
import axios from '../services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    permissions: JSON.parse(localStorage.getItem('userPermissions') || '[]'),
  }),
  actions: {
    setUser(userData) {
      this.user = userData.user
      this.token = userData.token
      this.permissions = userData.permissions

      // Simpan ke localStorage
      localStorage.setItem('user', JSON.stringify(userData.user))
      localStorage.setItem('token', userData.token)
      localStorage.setItem('userPermissions', JSON.stringify(userData.permissions))
    },

    clearUser() {
      this.user = null
      this.token = null
      this.permissions = []

      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('userPermissions')
    },

    async fetchUser() {
      try {
        const res = await axios.get('/me') // Pastikan endpoint ini mengembalikan data user
        this.user = res.data.user
      } catch (error) {
        console.error('Gagal memuat data user:', error)
        this.clearUser()
      }
    },
  },
})
