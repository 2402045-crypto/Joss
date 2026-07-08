<template>
  <div class="search-shell">
    <header class="search-header">
      <div>
        <h1>Talleres Automotrices</h1>
        <p>Encuentra el taller ideal con los servicios que tu vehículo necesita</p>
      </div>
    </header>

    <div class="search-layout">
      <!-- Panel de Filtros (Mismo estilo que mecánicos) -->
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

      <!-- Panel de Resultados -->
      <section class="results-panel">
        <article
          v-for="workshop in filteredWorkshops"
          :key="workshop.id"
          class="mechanic-card"
        >
          <div class="card-top">
            <div class="profile">
              <!-- Reemplazamos el avatar de iniciales por la foto del taller usando tus mismos estilos base -->
              <div class="workshop-image-container">
                <img :src="workshop.image" :alt="workshop.name" class="workshop-preview-img" />
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

          <!-- Especialidades / Servicios -->
          <div class="tags-row">
            <span v-for="tag in workshop.specialties" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <!-- Ubicación -->
          <div class="location-row">
            <span>📍 {{ workshop.location }}</span>
          </div>

          <!-- Horarios y Estado de Apertura -->
          <div class="schedule-row" :class="{ 'text-open': workshop.isOpen, 'text-closed': !workshop.isOpen }">
            <span>{{ workshop.isOpen ? 'Abierto' : 'Cerrado' }}</span> 
            <span class="schedule-text">· {{ workshop.schedule }}</span>
          </div>

          <!-- Botones de Acción -->
          <div class="actions-row">
            <button
            type="button"
            class="secondary-button"
            @click="verTaller">
            Ver Taller
            </button>
            
            <button type="button" class="primary-button">📍 Cómo llegar</button>
          </div>

          <!-- Disponibilidad -->
          <div class="availability-row" :class="{ 'status-unavailable': !workshop.isAvailableToday }">
            <span class="availability-indicator"></span>
            {{ workshop.availability }}
          </div>
        </article>

        <!-- Estado vacío -->
        <div v-if="filteredWorkshops.length === 0" class="empty-state">
          Ningún taller coincide con los filtros seleccionados.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const verTaller = () => {
  router.push('/perfilTaller')
}



const props = defineProps({
  workshops: {
    type: Array,
    default: () => [
      {
        id: 1,
        name: 'Taller El Rayo',
        image: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200', // URL de ejemplo, cámbiala por tus assets
        photosCount: 12,
        rating: 4.8,
        reviews: 152,
        distance: 1.8,
        priceRange: '$$',
        experience: 8,
        specialties: ['Motor', 'Frenos', 'Suspensión', 'Diagnóstico'],
        location: 'Av. Insurgentes Sur 1200, Del Valle, CDMX',
        availability: 'Disponible hoy',
        isAvailableToday: true,
        isOpen: true,
        schedule: 'Cierra a las 7:00 pm',
        verified: true
      },
      {
        id: 2,
        name: 'Mecánica Total',
        image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=200',
        photosCount: 8,
        rating: 4.7,
        reviews: 98,
        distance: 2.6,
        priceRange: '$$$',
        experience: 12,
        specialties: ['Transmisión', 'Frenos', 'Eléctrico', 'Diagnóstico'],
        location: 'Eje 6 Sur 164, Narvarte, CDMX',
        availability: 'Disponible hoy',
        isAvailableToday: true,
        isOpen: true,
        schedule: 'Cierra a las 6:30 pm',
        verified: true
      },
      {
        id: 3,
        name: 'Servi Auto',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=200',
        photosCount: 10,
        rating: 4.6,
        reviews: 74,
        distance: 3.2,
        priceRange: '$',
        experience: 5,
        specialties: ['Aire Acondicionado', 'Motor', 'Diagnóstico'],
        location: 'Calz. de Tlalpan 2300, Portales, CDMX',
        availability: 'No disponible hoy',
        isAvailableToday: false,
        isOpen: false,
        schedule: 'Abre a las 9:00 am',
        verified: true
      }
    ]
  }
})

const filters = ref({
  specialty: '',
  priceRange: '',
  availability: '',
  minRating: ''
})

const filteredWorkshops = computed(() => {
  return props.workshops.filter((workshop) => {
    const specialtyMatch =
      !filters.value.specialty ||
      workshop.specialties.some((tag) =>
        tag.toLowerCase().includes(filters.value.specialty.toLowerCase())
      )
    const priceMatch =
      !filters.value.priceRange || workshop.priceRange.includes(filters.value.priceRange)
    const availabilityMatch =
      !filters.value.availability ||
      workshop.availability.toLowerCase().includes(filters.value.availability.toLowerCase())
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
</script>

<style scoped>
/* Conservamos intactos tus estilos compartidos globales */
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

/* Ajuste específico para la previsualización de la imagen del taller */
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

/* Nuevos estilos específicos para el estado de horarios de la imagen */
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

/* Invertimos colores o los mantenemos según tu diseño original */
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
</style>