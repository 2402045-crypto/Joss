<template>
  <div class="search-shell">
    <header class="search-header">
      <div>
        <h1>Talleres Automotrices</h1>
        <p>Encuentra el taller ideal con los servicios que tu vehículo necesita</p>
      </div>
    </header>

    <div class="search-layout">
      <aside class="search-filters">
        <h2>Filtros</h2>
        <label>
          <span>Especialidad / Servicio</span>
          <input type="text" v-model="filters.specialty" placeholder="Ej: Frenos, Suspensión" />
        </label>

        <label>
          <span>Rango de Precio</span>
          <input type="text" v-model="filters.priceRange" placeholder="Ej: $$" />
        </label>

        <label>
          <span>Disponibilidad</span>
          <input type="text" v-model="filters.availability" placeholder="Ej: Disponible hoy" />
        </label>

        <label>
          <span>Calificación Mínima</span>
          <input type="number" v-model.number="filters.minRating" placeholder="4.5" min="0" max="5" />
        </label>

        <button type="button" @click="resetFilters">Limpiar Filtros</button>
      </aside>

      <section class="results-panel">
        <article
          v-for="workshop in filteredWorkshops"
          :key="workshop.id"
          class="mechanic-card"
        >
          <div class="card-top">
            <div class="profile">
              
              <div class="workshop-image-container">
                <img :src="obtenerRutaImagen(workshop.foto_taller)" :alt="workshop.name" class="workshop-preview-img" />
                <span class="photos-badge">{{ workshop.photosCount }} fotos</span>
              </div>
              
              <div>
                <div class="name-row">
                  <h2>{{ workshop.name }}</h2>
                  <span v-if="workshop.verified" class="verified">Verificado</span>
                </div>
                <div class="meta-row">
                  <span class="rating">★ {{ workshop.rating }} ({{ workshop.reviews }} reseñas)</span>
                  <span class="distance">· {{ workshop.distance }} km</span>
                </div>
              </div>
            </div>

            <div class="experience">
              <strong>{{ workshop.priceRange }}</strong>
              <div style="color: #5b7388; font-size: 0.9rem; margin-top: 4px;">{{ workshop.experience }} años exp.</div>
            </div>
          </div>

          <div class="tags-row">
            <span v-for="tag in workshop.specialties" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="location-row">
            <span>📍 {{ workshop.location }}</span>
          </div>

          <div class="schedule-row" :class="{ 'text-open': workshop.isOpen, 'text-closed': !workshop.isOpen }">
            <span>{{ workshop.isOpen ? 'Abierto' : 'Cerrado' }}</span> 
            <span class="schedule-text">· {{ workshop.schedule }}</span>
          </div>

          <div class="actions-row">
            <button
            type="button"
            class="secondary-button"
            @click="verTaller">
            Ver Taller
            </button>

            <button type="button" class="primary-button">📍 Cómo llegar</button>
          </div>

          <div class="availability-row" :class="{ 'status-unavailable': !workshop.isAvailableToday }">
            <span class="availability-indicator"></span>
            {{ workshop.availability }}
          </div>
        </article>

        <div v-if="filteredWorkshops.length === 0" class="empty-state">
          Ningún taller coincide con los filtros seleccionados.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const workshopsList = ref([])

const verTaller = () => {
  router.push('/perfilTaller')
}

const filters = ref({
  specialty: '',
  priceRange: '',
  availability: '',
  minRating: ''
})

// Variables dinámicas según tu entorno
const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/obtener_talleres.php' 
  : 'https://mecanicweb.free.nf/api/obtener_talleres.php'

const UPLOADS_URL = esLocal 
  ? 'http://localhost:8080/Joss/api/uploads/' 
  : 'https://mecanicweb.free.nf/api/uploads/'

// ESTA ES LA FUNCIÓN MÁGICA QUE SOLUCIONA LO DE LAS FOTOS
const obtenerRutaImagen = (foto_taller) => {
  // Si no hay foto, le ponemos la de relleno por defecto (Unsplash)
  if (!foto_taller) {
    return 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200'
  }
  // Si la foto sí existe en tu base de datos, Vue le pega la ruta correcta
  return `${UPLOADS_URL}${foto_taller}`
}

const cargarTalleres = async () => {
  try {
    const respuesta = await fetch(API_URL)
    const resultado = await respuesta.json()
    
    if (resultado.status === 'success') {
      workshopsList.value = resultado.data
    }
  } catch (error) {
    console.error("Error al cargar los talleres:", error)
  }
}

const filteredWorkshops = computed(() => {
  return workshopsList.value.filter((workshop) => {
    const specialtyMatch =
      !filters.value.specialty ||
      workshop.specialties.some((tag) =>
        tag.toLowerCase().includes(filters.value.specialty.toLowerCase())
      )
    const priceMatch =
      !filters.value.priceRange || (workshop.priceRange && workshop.priceRange.includes(filters.value.priceRange))
    const availabilityMatch =
      !filters.value.availability ||
      (workshop.availability && workshop.availability.toLowerCase().includes(filters.value.availability.toLowerCase()))
    const ratingMatch =
      !filters.value.minRating || workshop.rating >= filters.value.minRating

    return specialtyMatch && priceMatch && availabilityMatch && ratingMatch
  })
})

const resetFilters = () => {
  filters.value = {
    specialty: '',
    priceRange: '',
    availability: '',
    minRating: ''
  }
}

onMounted(() => {
  cargarTalleres()
})
</script>

<style scoped>
/* ESTILOS INTACTOS */
.search-shell {
  width: 100%;
  max-width: 1320px;
  display: grid;
  gap: 24px;
  padding: 24px 0 60px;
}

.search-header {
  padding: 24px 28px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
}

.search-header h1 {
  margin: 0 0 8px;
  font-size: clamp(2rem, 2.5vw, 3rem);
}

.search-header p {
  margin: 0;
  color: #52667a;
}

.search-layout {
  display: grid;
  gap: 24px;
  grid-template-columns: 320px minmax(0, 1fr);
}

.search-filters {
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.06);
}

.search-filters h2 {
  margin: 0 0 18px;
  font-size: 1.3rem;
}

.search-filters label {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
  color: #344e6b;
}

.search-filters input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #dfe4ea;
  background: #f8fafc;
}

.search-filters button {
  margin-top: 10px;
  width: 100%;
  border: none;
  background: #0d6eef;
  color: white;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  font-weight: 700;
}

.results-panel {
  display: grid;
  gap: 18px;
}

.mechanic-card {
  background: white;
  border-radius: 24px;
  padding: 26px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 18px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.profile {
  display: flex;
  gap: 20px;
  align-items: center;
}

.workshop-image-container {
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: 16px;
  overflow: hidden;
  background: #f1f5f9;
}

.workshop-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photos-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 3px 8px;
  font-size: 0.75rem;
  border-radius: 6px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.name-row h2 {
  margin: 0;
  font-size: 1.5rem;
}

.verified {
  background: #e6f4ff;
  color: #0d6eef;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
}

.meta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: #5b7388;
  margin-top: 6px;
}

.experience {
  text-align: right;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #eef6ff;
  color: #0d6eef;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.95rem;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #52667a;
  font-size: 0.96rem;
}

.schedule-row {
  font-size: 0.95rem;
  font-weight: 600;
}
.text-open {
  color: #2f7d32;
}
.text-closed {
  color: #d32f2f;
}
.schedule-text {
  color: #52667a;
  font-weight: 400;
}

.actions-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  padding: 14px 22px;
}

.primary-button {
  background: #0d6eef;
  color: white;
}

.secondary-button {
  background: #ffffff;
  color: #0d6eef;
  border: 1px solid #0d6eef;
}

.availability-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2f7d32;
  font-weight: 600;
}

.availability-row.status-unavailable {
  color: #f57c00;
}

.availability-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2f7d32;
}

.status-unavailable .availability-indicator {
  background: #f57c00;
}

.empty-state {
  padding: 28px;
  background: #f8fafc;
  border-radius: 20px;
  text-align: center;
  color: #52667a;
}

/* --- ADAPTACIÓN PARA CELULARES Y TABLETS --- */
@media (max-width: 768px) {
  .search-layout {
    grid-template-columns: 1fr; 
  }
  .card-top {
    flex-direction: column;
    align-items: flex-start;
  }
  .profile {
    flex-direction: column;
    align-items: flex-start;
  }
  .experience {
    text-align: left;
    margin-top: 10px;
  }
  .actions-row {
    flex-direction: column;
  }
  .actions-row .primary-button,
  .actions-row .secondary-button {
    width: 100%;
    text-align: center;
  }
}
</style>