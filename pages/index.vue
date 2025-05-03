<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { fetchAuth } from '@/services/fetchAuth'
import { startIdleWatcher, useIdleStatus, clearIdleEvent } from '@/services/idleService'

const user = ref(null)
const apiResult = ref('')
const auth = useAuthStore()
const router = useRouter()

const { isIdle: idleStatus, countdown, idleEvent } = useIdleStatus()

// para reautenticación
const showReAuthDialog = ref(false)
const passwordInput = ref('')
const reAuthError = ref('')

definePageMeta({
  layout: 'protected',
  middleware: 'auth',
})

onMounted(() => {
  user.value = auth.user
})

async function llamarApiAgregarStock() {
  try {
    const response = await fetchAuth('/api/protected', {
      method: 'POST',
      body: JSON.stringify({ cantidad: 10 }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    apiResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    apiResult.value = 'Error al llamar API Protegida: ' + error.message
  }
}
</script>

<template>
 
    <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl space-y-6">
      <h1 class="text-2xl font-bold text-center mb-4">Centro de Operaciones</h1>

      <div class="flex flex-col space-y-2">
        <div><strong>ID:</strong> {{ user?.id }}</div>
        <div><strong>Username:</strong> {{ user?.username }}</div>
      </div>

      <div class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Permisos:</h2>
        <ul class="list-disc pl-6">
          <li v-for="(permiso, idx) in user?.permissions" :key="idx">
            {{ permiso.module }} - {{ permiso.action }}
          </li>
        </ul>
      </div>

      <div class="text-sm text-gray-600 mt-6 text-center">
        <template v-if="idleStatus">
          Inactivo, cerrando sesión en {{ countdown }} segundos...
        </template>
        <template v-else>
          Activo
        </template>
      </div>

      <div class="flex flex-col gap-3 mt-6">
        <Button label="Llamar API Protegida (Agregar Stock)" @click="llamarApiAgregarStock" class="w-full" />
        <div v-if="apiResult" class="text-green-600 whitespace-pre mt-2">
          {{ apiResult }}
        </div>

       
      </div>
    </div>

   
 
</template>

<style scoped>
</style>
