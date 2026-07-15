<template>
  <div class="search-shell">
    <header class="search-header">
      <div>
        <h1>Mecánicos</h1>
        <p>Encuentra el profesional perfecto para tu vehículo</p>
      </div>
    </header>

    <div class="search-layout">
      <aside class="search-filters">
        <h2>Filtros</h2>
        <label>
          <span>Especialidad (Palabra clave)</span>
          <input type="text" v-model="filters.specialty" placeholder="Ej: Frenos, Motor" />
        </label>

        <label>
          <span>Estado / Disponibilidad</span>
          <input type="text" v-model="filters.availability" placeholder="Ej: activo" />
        </label>

        <label>
          <span>Calificación Mínima</span>
          <input type="number" v-model.number="filters.minRating" placeholder="4.5" min="0" max="5" step="0.1" />
        </label>

        <button type="button" @click="resetFilters">Limpiar Filtros</button>
      </aside>

      <section class="results-panel">
        <article
          v-for="mechanic in filteredMechanics"
          :key="mechanic.id_usuario"
          class="mechanic-card"
        >
          <div class="card-top">
            <div class="profile">
              
              <div class="avatar">
                <img v-if="esImagen(mechanic.foto_perfil)" :src="obtenerRutaPDF(mechanic.foto_perfil)" alt="Foto de perfil" />
                <span v-else>{{ mechanic.foto_perfil }}</span>
              </div>

              <div>
                <div class="name-row">
                  <h2>{{ mechanic.nombre }}</h2>
                  <span v-if="mechanic.estado === 'activo'" class="verified">Verificado</span>
                </div>
                <div class="meta-row">
                  <span class="rating">★ {{ mechanic.calificacion_promedio || '0.0' }} (Reseñas)</span>
                </div>
              </div>
            </div>

            <div class="experience" style="text-align: right;">
              <strong>{{ mechanic.edad }} años de edad</strong><br>
              <span style="font-size: 0.95em;">{{ mechanic.anios_experiencia }} años exp.</span>
            </div>
          </div>

          <div class="tags-row">
            <span class="tag">Mecánica General</span>
          </div>

          <div class="location-row">
            <span>📍 Estado: <span style="text-transform: capitalize;">{{ mechanic.estado }}</span></span>
          </div>

          <div class="actions-row">
            <button type="button" class="primary-button" @click="abrirDetalle(mechanic)">Ver Perfil Completo</button>
            <a :href="'tel:' + mechanic.telefono" class="secondary-button" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">Contactar</a>
          </div>

          <div class="availability-row">
            <span class="availability-indicator" :style="{ background: mechanic.estado === 'activo' ? '#2f7d32' : '#f57c00' }"></span>
            {{ mechanic.estado === 'activo' ? 'Disponible' : 'Pendiente' }}
          </div>
        </article>

        <div v-if="filteredMechanics.length === 0" class="empty-state">
          Ningún mecánico coincide con los filtros actuales.
        </div>
      </section>
    </div>

    <div v-if="mecanicoSeleccionado" class="modal-overlay" @click.self="cerrarDetalle">
      <div class="modal-content">
        <button class="close-btn" @click="cerrarDetalle">✕</button>
        
        <div class="perfil-header">
          
          <div class="avatar-grande">
            <img v-if="esImagen(mecanicoSeleccionado.foto_perfil)" :src="obtenerRutaPDF(mecanicoSeleccionado.foto_perfil)" alt="Foto de perfil" />
            <span v-else>{{ mecanicoSeleccionado.foto_perfil }}</span>
          </div>

          <h2>{{ mecanicoSeleccionado.nombre }}</h2>
          <span class="verified" v-if="mecanicoSeleccionado.estado === 'activo'">Verificado</span>
        </div>

        <div class="perfil-body">
          <h3>Sobre mí</h3>
          <p class="desc-texto">{{ mecanicoSeleccionado.descripcion_servicio }}</p>
          
          <div class="contacto-info">
            <h3>Contacto</h3>
            <p>📞 <b>Teléfono:</b> <a :href="'tel:' + mecanicoSeleccionado.telefono" style="color: #0d6eef; text-decoration: none;">{{ mecanicoSeleccionado.telefono }}</a></p>
            <p>✉️ <b>Email:</b> <a :href="'mailto:' + mecanicoSeleccionado.email" style="color: #0d6eef; text-decoration: none;">{{ mecanicoSeleccionado.email }}</a></p>
          </div>

          <div v-if="mecanicoSeleccionado.certificados && mecanicoSeleccionado.certificados.length > 0" class="certificados-section">
            <h3>Certificaciones</h3>
            <div class="lista-pdf">
              <a 
                v-for="(pdf, index) in mecanicoSeleccionado.certificados" 
                :key="index"
                :href="obtenerRutaPDF(pdf)" 
                target="_blank" 
                class="btn-pdf"
              >
                📄 Ver Certificado {{ index + 1 }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const mechanicsList = ref([])
const mecanicoSeleccionado = ref(null)

const filters = ref({
  specialty: '',
  availability: '',
  minRating: ''
})

const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/obtener_mecanicos.php' 
  : 'https://mecanicweb.free.nf/api/obtener_mecanicos.php'

const UPLOADS_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/uploads/' 
  : 'https://mecanicweb.free.nf/api/uploads/'

const cargarMecanicos = async () => {
  try {
    const respuesta = await fetch(API_URL)
    const resultado = await respuesta.json()
    if (resultado.status === 'success') {
      mechanicsList.value = resultado.data
    }
  } catch (error) {
    console.error("Error de conexión:", error)
  }
}

const filteredMechanics = computed(() => {
  return mechanicsList.value.filter((mechanic) => {
    const specialtyMatch = !filters.value.specialty || 
      (mechanic.descripcion_servicio && mechanic.descripcion_servicio.toLowerCase().includes(filters.value.specialty.toLowerCase()))
    
    const availabilityMatch = !filters.value.availability || 
      (mechanic.estado && mechanic.estado.toLowerCase().includes(filters.value.availability.toLowerCase()))
    
    const ratingMatch = !filters.value.minRating || 
      Number(mechanic.calificacion_promedio) >= Number(filters.value.minRating)

    return specialtyMatch && availabilityMatch && ratingMatch
  })
})

const resetFilters = () => {
  filters.value = { specialty: '', availability: '', minRating: '' }
}

const abrirDetalle = (mechanic) => {
  mecanicoSeleccionado.value = mechanic
}

const cerrarDetalle = () => {
  mecanicoSeleccionado.value = null
}

const obtenerRutaPDF = (nombreArchivo) => {
  return `${UPLOADS_URL}${nombreArchivo}`
}

// Pequeña función para diferenciar un emoji de un archivo .jpg o .png
const esImagen = (foto) => {
  if (!foto) return false;
  return foto.includes('.'); // Todos los archivos subidos llevarán su extensión (.png, .jpeg, etc)
}

onMounted(() => {
  cargarMecanicos()
})
</script>

<style scoped src="../styles/components/SearchMechanics.css"></style>