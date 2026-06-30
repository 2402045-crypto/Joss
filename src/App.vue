<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
      </div>

      <nav class="main-nav">
         <a href="#" @click.prevent="switchView('landing')">Inicio</a>
         <a href="#" @click.prevent="switchView('search')">Buscar Mecánicos</a>
        <a href="#" @click.prevent="switchView('mapsearch')">Buscar Talleres</a>
        <a href="#">Ayuda</a>
      </nav>

      <div class="topbar-actions">
        <button class="switch-account-button" type="button" @click="switchView('login')">
          Cambiar de cuenta
        </button>
      </div>
    </header>

    <main class="content-shell">
      <LandingPage
        v-if="currentView === 'landing'"
        @switch-view="switchView"
      />
      <Login
        v-else-if="currentView === 'login'"
        @switch-view="switchView"
        @login="onLogin"
      />
      <Register
        v-else-if="currentView === 'register'"
        @switch-view="switchView"
        @register-user="onRegister"
      />
      <HomeView
        v-else-if="currentView === 'home'"
        @logout="onLogout"
        @search="switchView('search')"
        @map-search="switchView('mapsearch')"
      />
      <SearchMechanics
        v-else-if="currentView === 'search'"
        :mechanics="mechanics"
        @go-back="switchView('home')"
      />
      <MapSearch
        v-else-if="currentView === 'mapsearch'"
        @go-back="switchView('home')"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LandingPage from './components/LandingPage.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import HomeView from './components/HomeView.vue'
import SearchMechanics from './components/SearchMechanics.vue'
import MapSearch from './components/MapSearch.vue'
import logo from './assets/Logoo.png'

const currentView = ref('landing')
const mechanics = ref([
  {
    id: 1,
    initials: 'CR',
    fullName: 'Carlos Rodríguez',
    rating: 4.9,
    reviews: 127,
    distance: 2.3,
    priceRange: '$$$',
    experience: '15',
    specialties: ['Motor', 'Transmisión', 'Diagnóstico'],
    location: 'Centro, CDMX',
    availability: 'Disponible hoy'
  },
  {
    id: 2,
    initials: 'MA',
    fullName: 'Miguel Ángel Torres',
    rating: 4.8,
    reviews: 98,
    distance: 3.7,
    priceRange: '$$',
    experience: '12',
    specialties: ['Frenos', 'Suspensión', 'Alineación'],
    location: 'Polanco, CDMX',
    availability: 'Disponible mañana'
  },
  {
    id: 3,
    initials: 'RS',
    fullName: 'Roberto Sánchez',
    rating: 4.7,
    reviews: 85,
    distance: 4.1,
    priceRange: '$$',
    experience: '10',
    specialties: ['Electricidad', 'Aire Acondicionado', 'Audio'],
    location: 'Roma Norte, CDMX',
    availability: 'Disponible hoy'
  }
])

const switchView = (view) => {
  currentView.value = view
}
const currentUser = ref(null)

const onLogin = () => {
  currentView.value = 'home'
}
const onLogout = () => {
  currentView.value = 'landing'
}
const onRegister = (registered) => {
  if (!registered) return

  if (registered.role === 'mecanico') {
    mechanics.value.unshift({
      ...registered,
      id: Date.now(),
      initials: registered.fullName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    })
  } else {
    currentUser.value = registered
  }
}
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #eff7fb;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eff7fb;
}

.topbar {
  width: 100%;
  max-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: linear-gradient(180deg, #dff5ff 0%, #d4ecff 100%);
  border: 1px solid rgba(2, 136, 209, 0.18);
  border-radius: 24px;
  margin: 24px 0 0;
  box-shadow: 0 20px 40px rgba(11, 43, 78, 0.08);
}

.brand-image {
  width: auto;
  height: 56px;
}

.main-nav {
  display: flex;
  gap: 30px;
  align-items: center;
}

.main-nav a {
  color: #102a43;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.98rem;
}

.main-nav a.active {
  color: #0d5bbc;
}

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .switch-account-button {
    padding: 12px 18px;
    border: none;
    background: #0288d1;
    color: white;
    border-radius: 999px;
    font-weight: 700;
    cursor: pointer;
  }

.primary-button,
.secondary-button {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  padding: 12px 22px;
}

.primary-button {
  background: #0d6eef;
  color: white;
}

.secondary-button {
  background: white;
  color: #0d6eef;
}

.content-shell {
  width: 100%;
  max-width: 1320px;
  display: flex;
  justify-content: center;
  padding: 32px 24px 60px;
}
</style>
