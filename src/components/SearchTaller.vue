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
        
        <!-- Filtro Dinámico de Especialidades -->
        <label>
          <span>Especialidad / Servicio</span>
          <select v-model="filters.specialty" class="filter-select">
            <option value="">Todas las especialidades</option>
            <option v-for="spec in availableSpecialties" :key="spec" :value="spec">
              {{ spec }}
            </option>
          </select>
        </label>

        <!-- Filtro de Precio -->
        <label>
          <span>Rango de Precio</span>
          <select v-model="filters.priceRange" class="filter-select">
            <option value="">Cualquier precio</option>
            <option value="$">Económico ($)</option>
            <option value="$$">Moderado ($$)</option>
            <option value="$$$">Premium ($$$)</option>
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
          v-for="workshop in filteredWorkshops"
          :key="workshop.id"
          :id="'taller-' + workshop.id"
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
          
          <RouterLink 
            :to="`/agendar-cita/${workshop.id_usuario || workshop.id}`" 
            class="primary-button" 
            style="text-decoration: none; display: flex; justify-content: center; align-items: center;"
          >
            📅 Agendar Cita
          </RouterLink>

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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const workshopsList = ref([])

const verTaller = () => {
  router.push('/perfilTaller')
}

// Actualizamos los filtros: quitamos disponibilidad
const filters = ref({
  specialty: '',
  priceRange: '',
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

// 🧠 MAGIA: Leemos todas las especialidades de los talleres y armamos una lista sin repetir
const availableSpecialties = computed(() => {
  const specialtiesSet = new Set()
  
  workshopsList.value.forEach(workshop => {
    if (Array.isArray(workshop.specialties)) {
      workshop.specialties.forEach(spec => specialtiesSet.add(spec))
    }
  })
  
  // Convertimos el Set a un arreglo y lo ordenamos alfabéticamente
  return Array.from(specialtiesSet).sort()
})

const filteredWorkshops = computed(() => {
  return workshopsList.value.filter((workshop) => {
    const specialties = Array.isArray(workshop.specialties) ? workshop.specialties : []
    
    // Ahora busca que coincida exactamente con la opción elegida
    const specialtyMatch =
      !filters.value.specialty || specialties.includes(filters.value.specialty)

    const priceMatch =
      !filters.value.priceRange || (workshop.priceRange && workshop.priceRange === filters.value.priceRange)

    const ratingMatch =
      !filters.value.minRating || Number(workshop.rating) >= Number(filters.value.minRating)

    return specialtyMatch && priceMatch && ratingMatch
  })
})

const resetFilters = () => {
  filters.value = {
    specialty: '',
    priceRange: '',
    minRating: ''
  }
}

onMounted(async () => {
  await cargarTalleres()
  await nextTick()

  const idBuscado = route.query.id

  if (idBuscado) {
    const card = document.getElementById('taller-' + idBuscado)
    
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      card.style.transition = 'box-shadow 0.5s'
      card.style.boxShadow = '0 0 20px #0097c7'
      
      setTimeout(() => {
        card.style.boxShadow = 'none' 
      }, 2000)
    }
  }
})
</script>

<style scoped src="../styles/components/SearchTaller.css"></style>