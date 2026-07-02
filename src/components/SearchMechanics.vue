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
              <div class="avatar">{{ mechanic.foto_perfil }}</div>
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

            <div class="experience">
              <strong>$$</strong>
              <span>{{ mechanic.anios_experiencia }} años exp.</span>
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
            <button type="button" class="secondary-button">Contactar</button>
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
          <div class="avatar-grande">{{ mecanicoSeleccionado.foto_perfil }}</div>
          <h2>{{ mecanicoSeleccionado.nombre }}</h2>
          <span class="verified" v-if="mecanicoSeleccionado.estado === 'activo'">Verificado</span>
        </div>

        <div class="perfil-body">
          <h3>Sobre mí</h3>
          <p class="desc-texto">{{ mecanicoSeleccionado.descripcion_servicio }}</p>
          
          <div class="contacto-info">
            <h3>Contacto</h3>
            <p>📞 <b>Teléfono:</b> {{ mecanicoSeleccionado.telefono }}</p>
            <p>✉️ <b>Email:</b> {{ mecanicoSeleccionado.email }}</p>
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

// Estado y variables reactivas
const mechanicsList = ref([])
const mecanicoSeleccionado = ref(null)

const filters = ref({
  specialty: '',
  availability: '',
  minRating: ''
})

// Detección inteligente de entorno (Local vs InfinityFree)
const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/obtener_mecanicos.php' 
  : 'https://mecanicweb.free.nf/api/obtener_mecanicos.php'

const UPLOADS_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/uploads/' 
  : 'https://mecanicweb.free.nf/api/uploads/'

// Obtener mecánicos de la BD
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

// Lógica de filtrado adaptada a la Base de Datos
const filteredMechanics = computed(() => {
  return mechanicsList.value.filter((mechanic) => {
    // Busca en la descripción del servicio
    const specialtyMatch = !filters.value.specialty || 
      (mechanic.descripcion_servicio && mechanic.descripcion_servicio.toLowerCase().includes(filters.value.specialty.toLowerCase()))
    
    // Busca en el estado (activo, inactivo, pendiente)
    const availabilityMatch = !filters.value.availability || 
      (mechanic.estado && mechanic.estado.toLowerCase().includes(filters.value.availability.toLowerCase()))
    
    // Evalúa la calificación
    const ratingMatch = !filters.value.minRating || 
      Number(mechanic.calificacion_promedio) >= Number(filters.value.minRating)

    return specialtyMatch && availabilityMatch && ratingMatch
  })
})

const resetFilters = () => {
  filters.value = { specialty: '', availability: '', minRating: '' }
}

// Funciones del Modal (Vista Detallada)
const abrirDetalle = (mechanic) => {
  mecanicoSeleccionado.value = mechanic
}

const cerrarDetalle = () => {
  mecanicoSeleccionado.value = null
}

const obtenerRutaPDF = (nombreArchivo) => {
  return `${UPLOADS_URL}${nombreArchivo}`
}

onMounted(() => {
  cargarMecanicos()
})
</script>

<style scoped>
/* CSS ORIGINAL*/
.search-shell { width: 100%; max-width: 1320px; display: grid; gap: 24px; padding: 24px 0 60px; }
.search-header { padding: 24px 28px; background: white; border-radius: 24px; box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08); }
.search-header h1 { margin: 0 0 8px; font-size: clamp(2rem, 2.5vw, 3rem); }
.search-header p { margin: 0; color: #52667a; }
.search-layout { display: grid; gap: 24px; grid-template-columns: 320px minmax(0, 1fr); }
.search-filters { background: white; border-radius: 24px; padding: 24px; border: 1px solid rgba(15, 23, 42, 0.06); box-shadow: 0 18px 30px rgba(15, 23, 42, 0.06); }
.search-filters h2 { margin: 0 0 18px; font-size: 1.3rem; }
.search-filters label { display: grid; gap: 10px; margin-bottom: 16px; color: #344e6b; }
.search-filters input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid #dfe4ea; background: #f8fafc; }
.search-filters button { margin-top: 10px; width: 100%; border: none; background: #0d6eef; color: white; border-radius: 14px; padding: 14px; cursor: pointer; font-weight: 700; }
.results-panel { display: grid; gap: 18px; }
.mechanic-card { background: white; border-radius: 24px; padding: 26px; border: 1px solid rgba(15, 23, 42, 0.06); box-shadow: 0 24px 40px rgba(15, 23, 42, 0.06); display: grid; gap: 18px; }
.card-top { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
.profile { display: flex; gap: 16px; align-items: center; }
.avatar { width: 64px; height: 64px; border-radius: 18px; display: grid; place-items: center; font-size: 2rem; color: white; background: #f0f8ff; border: 2px solid #0d6eef; }
.name-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.name-row h2 { margin: 0; font-size: 1.5rem; }
.verified { background: #e6f4ff; color: #0d6eef; padding: 6px 12px; border-radius: 999px; font-size: 0.9rem; font-weight: 700; }
.meta-row { display: flex; gap: 12px; flex-wrap: wrap; color: #5b7388; }
.experience { text-align: right; }
.tags-row { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: #eef6ff; color: #0d6eef; padding: 8px 14px; border-radius: 999px; font-size: 0.95rem; }
.location-row { display: flex; align-items: center; gap: 10px; color: #52667a; font-size: 0.96rem; }
.actions-row { display: flex; gap: 14px; flex-wrap: wrap; }
.primary-button, .secondary-button { border: none; border-radius: 14px; cursor: pointer; font-weight: 700; padding: 14px 22px; }
.primary-button { background: #0d6eef; color: white; }
.secondary-button { background: #ffffff; color: #102a43; border: 1px solid #dfe4ea; }
.availability-row { display: flex; align-items: center; gap: 10px; color: #2f7d32; font-weight: 600; }
.availability-indicator { width: 10px; height: 10px; border-radius: 50%; background: #2f7d32; }
.empty-state { padding: 28px; background: #f8fafc; border-radius: 20px; text-align: center; color: #52667a; }

/* NUEVOS ESTILOS PARA LA VISTA DETALLADA (MODAL) */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 25, 47, 0.6);
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 36px;
  border-radius: 24px;
  max-width: 540px;
  width: 90%;
  position: relative;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  color: #64748b;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.perfil-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.avatar-grande {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 3.5rem;
  background: #f0f8ff;
  border: 3px solid #0d6eef;
}

.perfil-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.8rem;
}

.perfil-body h3 {
  color: #334155;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.desc-texto {
  color: #475569;
  line-height: 1.6;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
}

.contacto-info {
  margin-top: 24px;
}

.contacto-info p {
  margin: 8px 0;
  color: #475569;
}

.certificados-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.lista-pdf {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-pdf {
  display: inline-block;
  padding: 14px 18px;
  background: #f0f8ff;
  color: #0d6eef;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid #bae6fd;
  transition: all 0.2s ease;
}

.btn-pdf:hover {
  background: #0d6eef;
  color: white;
}
</style>