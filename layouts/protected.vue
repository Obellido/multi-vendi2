<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { startIdleWatcher, useIdleStatus, clearIdleEvent } from '@/services/idleService'
import { useBreakpoints } from '@vueuse/core'

import Menubar from 'primevue/menubar'
import PanelMenu from 'primevue/panelmenu'
import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

const auth = useAuthStore()
const router = useRouter()
const { isIdle: idleStatus, countdown, idleEvent } = useIdleStatus()

const showReAuthDialog = ref(false)
const passwordInput = ref('')
const reAuthError = ref('')
const isClient = ref(false)
const collapsedSidebar = ref(false)
const sidebarMobileVisible = ref(false)

onMounted(() => {
  startIdleWatcher()
  isClient.value = true
})

watch(idleEvent, (value) => {
  if (value) {
    showReAuthDialog.value = true
    clearIdleEvent()
  }
})

async function reAuthenticate() {
  try {
    await auth.login(auth.user?.username, passwordInput.value)
    showReAuthDialog.value = false
    passwordInput.value = ''
    reAuthError.value = ''
  } catch (error) {
    reAuthError.value = 'Contraseña inválida. Intente de nuevo.'
  }
}

function logout() {
  auth.logout()
  router.push('/login')
}

// Módulos disponibles
const modulosDisponibles = computed(() => {
  if (!isClient.value || !auth.user?.permissions) return []

  const iconos = {
    'Productos': 'pi pi-box',
    'Stock': 'pi pi-database',
    'Ventas': 'pi pi-shopping-cart',
    'Envios': 'pi pi-send'
  }

  const modulosSet = new Set()
  auth.user.permissions.forEach(p => modulosSet.add(p.module))

  return Array.from(modulosSet).map(m => ({
    label: m,
    icon: iconos[m] || 'pi pi-folder',
    command: () => router.push('/' + m.toLowerCase())
  }))
})

// Breakpoints para detectar móvil
const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
})

const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">

    <!-- Menubar -->
    <Menubar class="bg-white shadow-md flex-none" :model="[]">
      <template #start>
        <div class="flex items-center gap-4 px-4">
          <Button
            v-if="isClient && isMobile"
            icon="pi pi-bars"
            text
            rounded
            @click="sidebarMobileVisible = true"
            class="p-2"
          />
          <div class="text-md font-bold">Decorando</div>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-4 pr-4">
          <div v-if="isClient && auth.user?.username" class="text-sm text-gray-700">
            <Tag :value="'👤 ' + auth.user.username" rounded severity="info" />
          </div>
        </div>
      </template>
    </Menubar>

    <div class="flex flex-1 min-h-0">

      <!-- Sidebar Desktop -->
      <aside
        v-if="isClient && !isMobile"
        :class="[
          'bg-blue-50 border-r-2 border-blue-200 p-2 flex flex-col transition-all duration-300 ease-in-out',
          collapsedSidebar ? 'w-20' : 'w-64'
        ]"
      >

        <div class="flex justify-between items-center mb-4">
          <h2 v-if="!collapsedSidebar" class="text-lg font-bold text-gray-800">Módulos</h2>
          <Button
            :icon="collapsedSidebar ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"
            text
            rounded
            @click="collapsedSidebar = !collapsedSidebar"
            class="p-2"
          />
        </div>

        <div class="flex-1 overflow-y-auto space-y-2">
          <template v-for="(modulo, idx) in modulosDisponibles" :key="idx">
            <Button
              class="w-full flex items-center justify-start gap-2 p-3"
              text
              :icon="modulo.icon"
              :label="collapsedSidebar ? '' : modulo.label"
              @click="modulo.command"
              v-tooltip.right="collapsedSidebar ? modulo.label : ''"
            />

          </template>
        </div>

        <div class="mt-6 flex justify-center">
          <Button
            class="w-full flex items-center justify-start gap-2 p-3"
            severity="danger"
            text
            icon="pi pi-sign-out"
            :label="collapsedSidebar ? '' : 'Cerrar Sesión'"
            @click="logout"
            v-tooltip.right="collapsedSidebar ? 'Cerrar Sesión' : ''"
          />

        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 bg-slate-100">

        <slot />
      </main>

    </div>

    <!-- Footer -->
    <footer class="flex items-center justify-between bg-white shadow-inner p-3 text-sm flex-none">

      <div>
        <Tag v-if="idleStatus" value="Inactivo" severity="danger" />
        <Tag v-else value="Activo" severity="success" />
      </div>
      <div v-if="idleStatus" class="text-red-500">
        Cerrando sesión en {{ countdown }} segundos...
      </div>
      <div class="text-gray-600">
        Sistema Vendi2 &copy; {{ new Date().getFullYear() }}
      </div>
    </footer>

    <!-- Sidebar Mobile -->
    <Drawer
  v-model:visible="sidebarMobileVisible"
  position="left"
  class="w-64"
  :modal="true"
  :dismissable="true"
>
  <h2 class="text-lg font-bold mb-4">Módulos</h2>
  <PanelMenu :model="modulosDisponibles" class="mb-4" />
  <Button label="Cerrar Sesión" @click="logout" severity="danger" class="w-full mt-4" />
</Drawer>

    <!-- Dialogo Reautenticación -->
    <Dialog v-model:visible="showReAuthDialog" header="Reautenticación requerida" modal :closable="false">
      <div class="flex flex-col gap-4">
        <p class="text-center">Debido a la inactividad, debes ingresar tu contraseña para continuar.</p>
        <InputText v-model="passwordInput" type="password" class="w-full" placeholder="Contraseña" />
        <div v-if="reAuthError" class="text-red-600 text-sm text-center">{{ reAuthError }}</div>
        <div class="flex justify-end gap-2">
          <Button label="Confirmar" @click="reAuthenticate" />
          <Button label="Cerrar Sesión" severity="danger" @click="logout" />
        </div>
      </div>
    </Dialog>

  </div>
</template>

<style scoped>
</style>
