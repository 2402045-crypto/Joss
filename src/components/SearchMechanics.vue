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
          <span>Especialidad</span>
          <input type="text" v-model="filters.specialty" placeholder="Ej: Frenos" />
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

        <button type="button" @click="resetFilters">Aplicar Filtros</button>
      </aside>

      <section class="results-panel">
        <article
          v-for="mechanic in filteredMechanics"
          :key="mechanic.id"
          class="mechanic-card"
        >
          <div class="card-top">
            <div class="profile">
              <div class="avatar">{{ mechanic.initials }}</div>
              <div>
                <div class="name-row">
                  <h2>{{ mechanic.fullName }}</h2>
                  <span class="verified">Verificado</span>
                </div>
                <div class="meta-row">
                  <span class="rating">★ {{ mechanic.rating }} ({{ mechanic.reviews }} reseñas)</span>
                  <span class="distance">· {{ mechanic.distance }} km</span>
                </div>
              </div>
            </div>

            <div class="experience">
              <strong>{{ mechanic.priceRange }}</strong>
              <span>{{ mechanic.experience }} años exp.</span>
            </div>
          </div>

          <div class="tags-row">
            <span v-for="tag in mechanic.specialties" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="location-row">
            <span>📍 {{ mechanic.location }}</span>
          </div>

          <div class="actions-row">
            <button type="button" class="primary-button">Ver Perfil Completo</button>
            <button type="button" class="secondary-button">Contactar</button>
          </div>

          <div class="availability-row">
            <span class="availability-indicator"></span>
            {{ mechanic.availability }}
          </div>
        </article>

        <div v-if="filteredMechanics.length === 0" class="empty-state">
          Ningún mecánico coincide con los filtros.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  mechanics: {
    type: Array,
    default: () => [
      {
        id: 1,
        fullName: 'Carlos Rodriguez',
        initials: 'CR',
        rating: 4.9,
        reviews: 127,
        distance: 2.3,
        priceRange: '$$$',
        experience: 15,
        specialties: ['Motor', 'Transmisión', 'Diagnóstico'],
        location: 'Centro, CDMX',
        availability: 'Disponible hoy',
        verified: true
      },
      {
        id: 2,
        fullName: 'Miguel Ángel Torres',
        initials: 'MT',
        rating: 4.8,
        reviews: 98,
        distance: 3.7,
        priceRange: '$$',
        experience: 12,
        specialties: ['Frenos', 'Suspensión', 'Alineación'],
        location: 'Polanco, CDMX',
        availability: 'Disponible mañana',
        verified: true
      },
      {
        id: 3,
        fullName: 'Roberto Sánchez',
        initials: 'RS',
        rating: 4.7,
        reviews: 85,
        distance: 4.1,
        priceRange: '$$',
        experience: 10,
        specialties: ['Electricidad', 'Aire Acondicionado', 'Audio'],
        location: 'Roma Norte, CDMX',
        availability: 'Disponible hoy',
        verified: true
      },
      {
        id: 4,
        fullName: 'Andrés Pérez García',
        initials: 'APG',
        rating: 4.6,
        reviews: 72,
        distance: 5.2,
        priceRange: '$',
        experience: 8,
        specialties: ['Mantenimiento', 'Cambio de aceite', 'Filtros'],
        location: 'Coyoacán, CDMX',
        availability: 'Disponible hoy',
        verified: true
      },
      {
        id: 5,
        fullName: 'José María López',
        initials: 'JML',
        rating: 4.5,
        reviews: 64,
        distance: 6.8,
        priceRange: '$$',
        experience: 18,
        specialties: ['Carrocería', 'Pintura', 'Restauración'],
        location: 'Iztapalapa, CDMX',
        availability: 'Disponible mañana',
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

const filteredMechanics = computed(() => {
  return props.mechanics.filter((mechanic) => {
    const specialtyMatch =
      !filters.value.specialty ||
      mechanic.specialties.some((tag) =>
        tag.toLowerCase().includes(filters.value.specialty.toLowerCase())
      )
    const priceMatch =
      !filters.value.priceRange || mechanic.priceRange.includes(filters.value.priceRange)
    const availabilityMatch =
      !filters.value.availability ||
      mechanic.availability.toLowerCase().includes(filters.value.availability.toLowerCase())
    const ratingMatch =
      !filters.value.minRating || mechanic.rating >= filters.value.minRating

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
  gap: 16px;
  align-items: center;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: white;
  background: #0d6eef;
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
  color: #102a43;
  border: 1px solid #dfe4ea;
}

.availability-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2f7d32;
  font-weight: 600;
}

.availability-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2f7d32;
}

.empty-state {
  padding: 28px;
  background: #f8fafc;
  border-radius: 20px;
  text-align: center;
  color: #52667a;
}
</style>