<template>
  <header class="topbar">
    <RouterLink class="brand" to="/" aria-label="Ir a la pagina de inicio">
      <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
    </RouterLink>

    <nav class="main-nav">
      <RouterLink v-if="rol !== '2'" to="/home">Inicio</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/search">Buscar Mecanicos</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/buscarTaller">Buscar Talleres</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/maps">Mapa</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/help">Ayuda</RouterLink>
      <RouterLink v-if="rol === '2'" to="/taller-register">Mi Taller</RouterLink>
    </nav>

   <div class="topbar-actions" v-if="!isLoggedIn">
    <RouterLink class="secondary-button" to="/login">
      Iniciar Sesión
    </RouterLink>

    <RouterLink class="primary-button" to="/register">
     Registrarse
    </RouterLink>

    
  </div>

  <div class="topbar-actions" v-else>
  <button class="menu-btn" @click="SideBarAbierto = true">
    ☰
  </button>

  <!--- Sidebar -->
  <SideBarMenu
    :abierto="SideBarAbierto" @cerrar="SideBarAbierto = false" @logout="cerrarSesion"
    />
  
</div>
  </header>
</template>

<script setup>
import logo from '../assets/Logoo.png'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBarMenu from './SideBarMenu.vue'

const SideBarAbierto = ref(false)

const router = useRouter()
const route = useRoute()
const rol = ref(null)
const isLoggedIn = ref(false)

const revisarSesion = () => {
  const rolGuardado = localStorage.getItem('usuario_rol')
  const legacyLogin = localStorage.getItem('usuarioLogueado') === 'true'

  if (rolGuardado) {
    rol.value = rolGuardado
    isLoggedIn.value = true
    return
  }

  rol.value = null
  isLoggedIn.value = legacyLogin
}

onMounted(() => {
  revisarSesion()
})

watch(
  () => route.path,
  () => {
    revisarSesion()
  }
)

const cerrarSesion = () => {
  localStorage.removeItem('usuario_rol')
  localStorage.removeItem('usuario_id')
  localStorage.removeItem('usuarioLogueado')
  SideBarAbierto.value = false
  revisarSesion()
  router.push('/login')
}


</script>

<style scoped>
.topbar {
  width: 100%;
  max-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: linear-gradient(180deg, #dff5ff 0%, #d4ecff 100%);
  border: 1px solid rgba(2, 136, 209, 0.18);
  border-radius: 24px;
  margin: 24px 0 0;
  box-shadow: 0 20px 40px rgba(11, 43, 78, 0.08);
}

.brand-image {
  width: auto;
  height: 56px;
}

.brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.main-nav a {
  color: #102a43;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.98rem;
}

.main-nav a.router-link-exact-active {
  color: #0d5bbc;
}

.main-nav a.router-link-active {
  color: #0d5bbc;
}

.main-nav a:hover {
  color: #0b71b3;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.primary-button,
.secondary-button {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  padding: 12px 22px;
  text-decoration: none;
}

.primary-button {
  background: #0d6eef;
  color: white;
}

.secondary-button {
  background: white;
  color: #0d6eef;
}

@media (max-width: 900px) {
  .topbar {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }

  .main-nav {
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  }

  .topbar-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .topbar-actions .primary-button,
  .topbar-actions .secondary-button {
    width: auto;
    min-width: 140px;
  }
}

@media (max-width: 600px) {
  .topbar {
    padding: 16px 16px;
  }

  .topbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .topbar-actions .primary-button,
  .topbar-actions .secondary-button {
    width: 100%;
  }
}

.menu-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #1f2937;
  font-size: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .25s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}

.menu-btn:hover {
  background: #e8f4ff;
  color: #0d6eef;
  transform: scale(1.05);
}
</style>
