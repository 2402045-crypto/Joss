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
        
        <!-- Filtro Dinámico de Especialidades -->
        <label>
          <span>Especialidad</span>
          <select v-model="filters.specialty" class="filter-select">
            <option value="">Todas las especialidades</option>
            <option v-for="spec in availableSpecialties" :key="spec" :value="spec">
              {{ spec }}
            </option>
          </select>
        </label>

        <!-- Filtro de Experiencia -->
        <label>
          <span>Años de Experiencia</span>
          <select v-model.number="filters.experience" class="filter-select">
            <option value="">Cualquier experiencia</option>
            <option value="5">Más de 5 años</option>
            <option value="10">Más de 10 años</option>
            <option value="20">Más de 20 años</option>
          </select>
        </label>

        <!-- Filtro de Calificación -->
        <label>
          <span>Calificación Mínima</span>
          <select v-model.number="filters.minRating" class="filter-select">
            <option value="">Cualquier calificación</option>
            <option value="4.5">Excelente (4.5+ ★)</option>
            <option value="4">Muy Bueno (4.0+ ★)</option>
            <option value="3">Bueno (3.0+ ★)</option>
          </select>
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

          <!-- Pinta automáticamente las especialidades reales del mecánico -->
          <div class="tags-row">
            <span v-for="tag in mechanic.specialties" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <!-- Quitamos el texto quemado de 'Estado: activo' ya que todos lo son por defecto -->
          <div class="location-row">
            <span>📍 {{ mechanic.specialties.includes('Mecánica General') ? 'Servicio General' : 'Servicio Especializado' }}</span>
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

    <!-- El Modal de detalles queda exactamente igual -->
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

// Actualizamos los campos iniciales del filtro
const filters = ref({
  specialty: '',
  experience: '',
  minRating: ''
})

const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/obtener_mecanicos.php' 
  : 'https://mecanicweb.free.nf/Joss/api/obtener_mecanicos.php'

const UPLOADS_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/uploads/' 
  : 'https://mecanicweb.free.nf/Joss/api/uploads/'

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

// Generamos la lista única de especialidades automáticamente
const availableSpecialties = computed(() => {
  const specialtiesSet = new Set()
  mechanicsList.value.forEach(mechanic => {
    if (Array.isArray(mechanic.specialties)) {
      mechanic.specialties.forEach(spec => specialtiesSet.add(spec))
    }
  })
  return Array.from(specialtiesSet).sort()
})

const filteredMechanics = computed(() => {
  return mechanicsList.value.filter((mechanic) => {
    const specialties = Array.isArray(mechanic.specialties) ? mechanic.specialties : []
    
    // Comparación exacta de especialidad
    const specialtyMatch =
      !filters.value.specialty || specialties.includes(filters.value.specialty)

    // Comparación numérica de experiencia
    const experienceMatch = 
      !filters.value.experience || Number(mechanic.anios_experiencia) >= Number(filters.value.experience)
    
    // Comparación numérica de calificación
    const ratingMatch = 
      !filters.value.minRating || Number(mechanic.calificacion_promedio) >= Number(filters.value.minRating)

    return specialtyMatch && experienceMatch && ratingMatch
  })
})

const resetFilters = () => {
  filters.value = { specialty: '', experience: '', minRating: '' }
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

const esImagen = (foto) => {
  if (!foto) return false;
  return foto.includes('.'); 
}

onMounted(() => {
  cargarMecanicos()
})
</script>

<style scoped src="../styles/components/SearchMechanics.css"></style>