<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
      </div>

      <nav class="main-nav">
        <a href="#">Inicio</a>
        <a href="#">Buscar Mecánicos</a>
        <a href="#">Buscar Talleres</a>
        <a href="#">Ayuda</a>
      </nav>

      <div class="topbar-actions" v-if="currentView === 'home'">
        <button class="logout-topbar" type="button" @click="onLogout">Log out</button>
      </div>
    </header>

    <main class="content-shell">
      <Login
        v-if="currentView === 'login'"
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
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import HomeView from './components/HomeView.vue'
import logo from './assets/Logoo.png'

const currentView = ref('login')
const switchView = (view) => {
  currentView.value = view
}
const onLogin = () => {
  currentView.value = 'home'
}
const onLogout = () => {
  currentView.value = 'login'
}
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #e8e8e8 0%, #e8e8e8 40%, #e8e8e8 100%);
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar {
  width: 97%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background: #d8ecf9;
  border: 1px solid rgba(2, 136, 209, 0.18);
}

.brand-image {
  width: auto;
  height: 48px;
}

.main-nav {
  display: flex;
  gap: 28px;
  align-items: center;
}

.main-nav a {
  color: #102a43;
  text-decoration: none;
  font-weight: 600;
}

.main-nav a:hover {
  color: #0288d1;
}

.topbar-actions {
  display: flex;
  align-items: center;
}

.logout-topbar {
  border: none;
  background: #2db94a;
  color: white;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.content-shell {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  padding: 40px 24px 60px;
}
</style>
