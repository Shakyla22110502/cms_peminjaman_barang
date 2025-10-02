<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <Card class="max-w-md w-full text-center shadow-lg">
      <CardHeader>
        <CardTitle class="text-3xl font-bold text-red-600">403 - Akses Ditolak</CardTitle>
        <CardDescription>
          Anda tidak memiliki izin untuk melihat halaman ini.
        </CardDescription>
      </CardHeader>
      <CardContent class="mt-4">
        <router-link to="/">
          <Button class="bg-blue-600 hover:bg-blue-700 text-white">
            Kembali ke Dashboard
          </Button>
        </router-link>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
</script>
