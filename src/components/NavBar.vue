<template>
  <header class="topbar">
    <div class="brand">
      <img :src="logo" alt="MecanicWeb logo" class="brand-image" />
    </div>

    <nav class="main-nav">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/search">Buscar Mecanicos</RouterLink>
      <a href="#">Buscar Talleres</a>
      <a href="#">Ayuda</a>
    </nav>

    <div class="topbar-actions">
      <RouterLink class="secondary-button" to="/login">Iniciar Sesion</RouterLink>
      <RouterLink class="primary-button" to="/register">Registrarse</RouterLink>
    </div>
  </header>
</template>

<script setup>
import logo from '../assets/Logoo.png'
</script>

<style scoped>
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

.main-nav a.router-link-active {
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
  text-decoration: none;
}

.primary-button {
  background: #0d6eef;
  color: white;
}

.secondary-button {
  background: white;
  color: #0d6eef;
}
</style>
