<template>
  <div v-if="abierto" class="overlay" @click="$emit('cerrar')">
    <Transition name="sidebar">
      <aside class="sidebar" @click.stop>
        <button class="close" @click="$emit('cerrar')">✕</button>

        <img :src="rutaFoto" class="foto" alt="Perfil Usuario" />

        <h2>{{ usuarioInfo.nombre }}</h2>
        <p>{{ usuarioInfo.email }}</p>

        <div class="menu">
          <RouterLink to="/perfil" class="item" @click="$emit('cerrar')">
            <span class="icon-emoji">👤</span>
            <div class="item-text">
              <h4>Mi Perfil</h4>
              <span>Ver y editar tu perfil</span>
            </div>
          </RouterLink>

          <RouterLink to="/miscitas" class="item" @click="$emit('cerrar')">
            <span class="icon-emoji">📅</span>
            <div class="item-text">
              <h4>Mis citas</h4>
              <span>Revisa tus citas</span>
            </div>
          </RouterLink>

          <button type="button" class="item logout" @click="clickCerrarSesion">
            <span class="icon-emoji">🚪</span>
            <div class="item-text">
              <h4>Cerrar sesión</h4>
              <span>Salir de la cuenta</span>
            </div>
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  abierto: Boolean
})

const emit = defineEmits(['cerrar', 'logout'])

const usuarioInfo = ref({
  nombre: 'Cargando...',
  email: 'cargando...'
})

const rutaFoto = ref('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png') // Avatar gris por defecto

// Se ejecuta cada vez que abres el menú lateral
watch(() => props.abierto, async (estaAbierto) => {
  if (estaAbierto) {
    const idUsuario = localStorage.getItem('usuario_id')
    if (!idUsuario) return

    const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const API_URL = esLocal 
      ? `http://localhost:8080/Joss/api/obtener_perfil.php?id_usuario=${idUsuario}` 
      : `https://mecanicweb.free.nf/api/obtener_perfil.php?id_usuario=${idUsuario}`
    
    const UPLOADS_URL = esLocal 
      ? 'http://localhost:8080/Joss/api/uploads/' 
      : 'https://mecanicweb.free.nf/Joss/api/uploads/'

    try {
      const respuesta = await fetch(API_URL)
      const resultado = await respuesta.json()
      
      if (resultado.status === 'success') {
        usuarioInfo.value = resultado.data
        if (resultado.data.foto_perfil) {
          rutaFoto.value = UPLOADS_URL + resultado.data.foto_perfil
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del sidebar", error)
    }
  }
})

const clickCerrarSesion = () => {
  emit('logout')
  emit('cerrar')
}
</script>

<style scoped>
/* Botón de raya */
.menu-btn {
  width: 42px;
  height: 42px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  color: #1f2937;
  border-radius: 10px;
  transition: .2s;
}

.menu-btn:hover {
  background: #e8f4ff;
}

/* Overlay de fondo */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
}

/* Barra lateral */
.sidebar {
  width: 370px;
  height: 100vh;
  background: white;
  padding: 30px;
  box-shadow: -8px 0 25px rgba(0,0,0,.15);
  position: relative;
  box-sizing: border-box; /* Asegura que el padding no deforme el ancho de la barra */
}

/* Botón cerrar "X" */
.close {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 25px;
  border: none;
  background: none;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
}

.close:hover {
  color: #1e293b;
}

/* Avatar circular */
.foto {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  margin: 20px auto 0;
  object-fit: cover;
  border: 3px solid #f1f5f9;
}

h2 {
  text-align: center;
  margin-top: 15px;
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 700;
}

p {
  text-align: center;
  color: #64748b;
  margin: 4px 0 0;
  font-size: 0.95rem;
}

/* Menú y tarjetas de opciones */
.menu {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Estilo unificado para enlaces y botones por igual */
.item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 15px;
  text-decoration: none;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Arreglo específico para elementos <button> */
  width: 100%;
  font-family: inherit; /* Hereda la fuente global del sistema */
  text-align: left;    /* Alinea el texto a la izquierda en botones */
  box-sizing: border-box;
}

.item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.icon-emoji {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-text h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.item-text span {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Estilo específico de hover y enfoque para el botón Cerrar Sesión */
.logout:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.logout:hover .item-text h4 {
  color: #dc2626;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  animation: fade .3s;
}

@keyframes fade {
  from{
    opacity:0;
  }

  to{
    opacity:1;
  }
}
</style>