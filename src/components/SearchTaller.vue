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
              <!-- Reemplazamos el avatar de iniciales por la foto del taller  -->
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

<style scoped src="../styles/components/SearchTaller.css"></style>
