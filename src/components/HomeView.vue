<template>
  <div class="home-shell">
    <header class="home-header">
      <div class="header-text">
        <h1>Bienvenido a MecanicWeb</h1>
        <p class="subtitle">Selecciona una opción para continuar</p>
      </div>
    </header>

    <section class="cards-grid">
      <article class="home-card">
        <div class="card-icon">
          <img :src="mapsImage" alt="Buscador en Maps" />
        </div>
        <h2>Buscador en Maps</h2>
        <p>Encuentra talleres y mecánicos en el<br> mapa de tu zona.</p>
      </article>

      <article class="home-card" @click="switchView('search')">
        <div class="card-icon">
          <img :src="mechanicsImage" alt="Buscar Mecánicos" />
        </div>
        <h2>Buscar Mecánicos</h2>
        <p>Busca mecánicos y talleres por tipo <br> de servicio y ubicación.</p>
      </article>
    </section>
  </div>
</template>

<script setup>
import mapsImage from '../../gm.png'
import mechanicsImage from '../../bm.png'
const emit = defineEmits(['logout', 'switch-view'])
const logout = () => emit('logout')
const switchView = (view) => emit('switch-view', view)
</script>

<style scoped>
.home-shell {
  width: 100%;
  max-width: 1200px;
  padding: 40px 24px 60px;
  display: grid;
  gap: 20px;
}

.home-header {
  display: grid;
  place-items: center;
  text-align: center;
  padding: 12px 32px 8px;
  background: transparent;
  margin-top: 12px;
}

.home-header h1 {
  margin: 0 0 8px 0;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  color: #102a43;
  font-weight: 800;
}

.subtitle {
  margin: 12px 0 0;
  color: #486581;
  font-size: 1rem;
  line-height: 1.7;
}

.logout-button {
  border: none;
  background: #0288d1;
  color: white;
  cursor: pointer;
  border-radius: 14px;
  padding: 14px 22px;
  font-weight: 700;
}

.cards-grid {
  display: flex;
  justify-content: center;
  gap: 96px;
    
}

.home-card {
  background: white;
  width: 300px;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  padding: 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  text-align: center;
}

.card-icon {
  width: 76px;
  height: 76px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 6px;
  left: 50%;
  transform: translateX(-15%);
}

.card-icon img {
  width: 88px;
  height: 88px;
  object-fit: contain;
  place-items: center;
}

.home-card h2 {
  text-align: center;
}

.home-card p {
  text-align: center;
}

.home-card h2 {
  margin: 0 0 6px 0;
  font-size: 1.9rem;
  color: #102a43;
}

.home-card p {
  margin: 0;
  color: #486581;
  line-height: 1.7;
  max-width: 420px;
}

.home-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-card:hover {
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.15);
  transform: translateY(-8px);
}

</style>
