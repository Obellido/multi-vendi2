<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <Card class="w-full max-w-md shadow-2xl">
        <template #title>
          <div class="text-center text-2xl font-bold">Iniciar Sesión</div>
        </template>
  
        <template #content>
          <div class="flex flex-col gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-user text-gray-500" />
                <label for="usuario" class="text-sm font-medium">Usuario</label>
              </div>
              <InputText 
                id="usuario" 
                v-model="usuario" 
                placeholder="Ingrese su usuario" 
                :class="['w-full', {'p-invalid': usuarioError}]"
              />
            </div>
  
            <div>
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-lock text-gray-500" />
                <label for="password" class="text-sm font-medium">Contraseña</label>
              </div>
              <Password 
                id="password" 
                v-model="password" 
                placeholder="Ingrese su contraseña" 
                toggleMask 
                :class="['w-full', {'p-invalid': passwordError}]"
              />
            </div>
  
            <Button :label="loading ? 'Ingresando...' : 'Ingresar'" :loading="loading" class="w-full" @click="login" />
  
            <div class="text-center mt-4">
              <small class="text-gray-500">¿Olvidaste tu contraseña?</small>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  import { useAuthStore } from '@/stores/authStore'

  const auth = useAuthStore()
  
  const usuario = ref('')
  const password = ref('')
  const usuarioError = ref(false)
  const passwordError = ref(false)
  const loading = ref(false)
  
  async function login() {
    usuarioError.value = !usuario.value
    passwordError.value = !password.value
  
    if (usuarioError.value || passwordError.value) {
      return
    }
  
    loading.value = true
  
    // Simula una llamada a API
    auth.login(usuario.value, password.value)
      .then(() => {
        loading.value = false
        // Redirigir a la página de inicio o dashboard
        window.location.href = '/'
      })
      .catch((error) => {
        loading.value = false
        // Manejar el error de inicio de sesión (ej. mostrar un mensaje de error)
        console.error('Error de inicio de sesión:', error)
      })
  }
  </script>
  
  <style scoped>
  .p-invalid {
    border-color: #f87171;
  }
  </style>