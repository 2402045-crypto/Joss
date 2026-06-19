<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
      </div>

      <nav class="main-nav">
        <a href="#" @click.prevent="switchView('landing')">Inicio</a>
        <a href="#" @click.prevent="switchView('search')">Buscar Mecánicos</a>
        <a href="#">Buscar Talleres</a>
        <a href="#">Ayuda</a>
      </nav>

      <div class="topbar-actions">
        <button class="secondary-button" type="button" @click="switchView('login')">Iniciar Sesión</button>
        <button class="primary-button" type="button" @click="switchView('register')">Registrarse</button>
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
      />
      <HomeView
        v-else-if="currentView === 'home'"
        @logout="onLogout"
        @switch-view="switchView"
      />
      <SearchMechanics
        v-else-if="currentView === 'search'"
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
import logo from './assets/Logoo.png'

const currentView = ref('landing')
const switchView = (view) => {
  currentView.value = view
}
const onLogin = () => {
  currentView.value = 'home'
}
const onLogout = () => {
  currentView.value = 'landing'
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

.main-nav a:hover {
  color: #0b71b3;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
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
