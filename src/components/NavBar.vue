<template>
  <header class="topbar">
    <RouterLink class="brand" to="/" aria-label="Ir a la página de inicio">
      <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
    </RouterLink>

    <nav class="main-nav">

      <!-- BOTÓN PARA USUARIOS NORMALES O VISITANTES (Oculto para mecánicos) -->
       <RouterLink v-if="rol !== '2'" to="/home">Inicio</RouterLink>
       <RouterLink v-if="rol !== '2'" to="/search">Buscar Mecánicos</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/buscarTaller">Buscar Talleres</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/maps">Mapa</RouterLink>
      <RouterLink v-if="rol !== '2'" to="/help">Ayuda</RouterLink>

      <!-- BOTÓN EXCLUSIVO PARA MECÁNICOS (Oculto para usuarios normales) -->
      <RouterLink v-if="rol === '2'" to="/taller-register">Mi Taller</RouterLink>

    </nav>

    <!-- Si no ha iniciado sesión, mostramos los botones de Login/Registro -->
    <div class="topbar-actions" v-if="!isLoggedIn">
      <RouterLink class="secondary-button" to="/login">Iniciar Sesión</RouterLink>
      <RouterLink class="primary-button" to="/register">Registrarse</RouterLink>
    </div>
    
    <!-- Si ya inició sesión, mostramos un botón para Salir -->
    <div class="topbar-actions" v-else>
      <button class="secondary-button" @click="cerrarSesion">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logo from '../assets/Logoo.png'

const router = useRouter()
const route = useRoute()

const rol = ref(null)
const isLoggedIn = ref(false)

// Función para revisar la mochila (el localStorage) y ver si traemos gafete
const revisarSesion = () => {
  const rolGuardado = localStorage.getItem('usuario_rol')
  if (rolGuardado) {
    rol.value = rolGuardado
    isLoggedIn.value = true
  } else {
    rol.value = null
    isLoggedIn.value = false
  }
}

// Revisamos cuando carga la barra
onMounted(() => {
  revisarSesion()
})

// Nos quedamos vigilando si cambiamos de página para actualizar la barra automáticamente
watch(
  () => route.path,
  () => {
    revisarSesion()
  }
)

// Para que puedas cambiar de cuentas fácilmente mientras haces pruebas
const cerrarSesion = () => {
  localStorage.removeItem('usuario_rol')
  localStorage.removeItem('usuario_id')
  revisarSesion()
  router.push('/login')
}
</script>

<style scoped>

.topbar { width: 100%; max-width: 1300px; display: flex; align-items: center; justify-content: space-between; padding: 18px 32px; background: linear-gradient(180deg, #dff5ff 0%, #d4ecff 100%); border: 1px solid rgba(2, 136, 209, 0.18); border-radius: 24px; margin: 24px 0 0; box-shadow: 0 20px 40px rgba(11, 43, 78, 0.08); }
.brand-image { width: auto; height: 56px; }
.brand { display: inline-flex; align-items: center; text-decoration: none; }
.main-nav { display: flex; gap: 30px; align-items: center; }
.main-nav a { color: #102a43; text-decoration: none; font-weight: 700; font-size: 0.98rem; }
.main-nav a.router-link-active { color: #0d5bbc; }
.main-nav a:hover { color: #0b71b3; }
.topbar-actions { display: flex; align-items: center; gap: 14px; }
.primary-button, .secondary-button { border: none; border-radius: 999px; cursor: pointer; font-weight: 700; padding: 12px 22px; text-decoration: none; }
.primary-button { background: #0d6eef; color: white; }
.secondary-button { background: white; color: #0d6eef; }

/* --- ADAPTACIÓN PARA CELULARES Y TABLETS --- */
@media (max-width: 768px) {
  .topbar {
    flex-direction: column; /* Apila todo hacia abajo */
    gap: 16px;
    padding: 16px;
    border-radius: 16px;
  }
  
  .main-nav {
    flex-wrap: wrap; /* Permite que los links pasen a otra línea si no caben */
    justify-content: center;
    gap: 15px;
  }
  
  .main-nav a {
    font-size: 0.9rem;
  }
  
  .topbar-actions {
    width: 100%;
    justify-content: center;
    flex-direction: column; /* Apila los botones de iniciar sesión / registro */
  }
  
  .primary-button, .secondary-button {
    width: 100%;
    text-align: center;
  }
}
</style>