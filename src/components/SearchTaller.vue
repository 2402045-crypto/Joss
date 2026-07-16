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

const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API_URL = esLocal
  ? 'http://localhost:8080/Joss/api/obtener_talleres.php'
  : 'https://mecanicweb.free.nf/Joss/api/obtener_talleres.php'

const cargarTalleres = async () => {
  try {
    const respuesta = await fetch(API_URL)
    const resultado = await respuesta.json()

    if (resultado.status === 'success') {
      workshopsList.value = resultado.data
    }
  } catch (error) {
    console.error('Error al cargar los talleres:', error)
  }
}

const obtenerRutaImagen = (fotoTaller) => {
  if (!fotoTaller) {
    return 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200'
  }

  if (fotoTaller.startsWith('http://') || fotoTaller.startsWith('https://')) {
    return fotoTaller
  }

  return esLocal
    ? `http://localhost:8080/Joss/api/uploads/${fotoTaller}`
    : `https://mecanicweb.free.nf/Joss/api/uploads/${fotoTaller}`
}

const filteredWorkshops = computed(() => {
  return workshopsList.value.filter((workshop) => {
    const specialties = Array.isArray(workshop.specialties) ? workshop.specialties : []
    const specialtyMatch =
      !filters.value.specialty ||
      specialties.some((tag) => tag.toLowerCase().includes(filters.value.specialty.toLowerCase()))

    const priceMatch =
      !filters.value.priceRange || (workshop.priceRange && workshop.priceRange.includes(filters.value.priceRange))

    const availabilityMatch =
      !filters.value.availability ||
      (workshop.availability && workshop.availability.toLowerCase().includes(filters.value.availability.toLowerCase()))

    const ratingMatch =
      !filters.value.minRating || Number(workshop.rating) >= Number(filters.value.minRating)

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

<style scoped src="../styles/components/SearchTaller.css"></style>
