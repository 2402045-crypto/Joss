<template>
  <div class="landing-page">
    <section class="hero-section" :style="heroBackgroundStyle">
      <div class="hero-copy">
        <h1>Encuentra el mecánico perfecto para tu vehículo</h1>
        <p>Conectamos conductores con mecánicos profesionales certificados. Rápido, confiable y cerca de ti.</p>

        

        <div class="search-card">
          <div class="search-inputs">
            <input type="text" placeholder="Ciudad o código postal" />
            <input type="text" placeholder="Tipo de servicio" />
          </div>
          <button type="button">Buscar Talleres</button>
        </div>

        <div class="hero-actions">
          <button type="button" class="secondary-button" @click="switchView('login')">Iniciar sesión</button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="map-card">
          <div class="map-header">
            <span>Buscar en esta área</span>
            <div class="map-badge">🔍</div>
          </div>
          <img :src="mapImage" alt="Mapa de talleres cercanos" class="map-image" />
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header">
        <h2>¿Por qué elegir MecanicWeb?</h2>
        <p>La plataforma más confiable para conectar con mecánicos profesionales.</p>
      </div>

      <div class="features-grid">
        <article class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Mecánicos Verificados</h3>
          <p>Todos nuestros mecánicos están certificados y verificados para garantizar calidad.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Servicio Rápido</h3>
          <p>Encuentra mecánicos disponibles cerca de ti en minutos.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3>Mejor Calificados</h3>
          <p>Lee reseñas y calificaciones reales de otros usuarios.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">📍</div>
          <h3>Cerca de Ti</h3>
          <p>Localiza mecánicos en tu área con nuestro sistema de geolocalización.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Precios Transparentes</h3>
          <p>Conoce los precios antes de contratar, sin sorpresas.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">🎧</div>
          <h3>Soporte 24/7</h3>
          <p>Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
        </article>
      </div>
    </section>

    <section class="workflow-section">
      <div class="section-header">
        <h2>¿Cómo funciona?</h2>
        <p>Es simple y rápido</p>
      </div>

      <div class="workflow-grid">
        <article class="step-card">
          <div class="step-number">1</div>
          <h3>Busca</h3>
          <p>Ingresa tu ubicación y el servicio que necesitas.</p>
        </article>
        <article class="step-card">
          <div class="step-number">2</div>
          <h3>Compara</h3>
          <p>Revisa perfiles, precios y reseñas de mecánicos disponibles.</p>
        </article>
        <article class="step-card">
          <div class="step-number">3</div>
          <h3>Contacta</h3>
          <p>Agenda tu cita y recibe el servicio que necesitas.</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import backgroundImage from '../../fondo.png'
import mapImage from '../../Mapa.png'

const emit = defineEmits(['switch-view'])
const switchView = (view) => emit('switch-view', view)

const heroBackgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}
</script>

<style scoped>
.landing-page {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 60px;
  padding: 0 16px 40px;
  max-width: none;
}

.hero-section {
  position: relative;
  display: grid;
  gap: 40px;
  align-items: center;
  grid-template-columns: minmax(320px, 1.1fr) minmax(360px, 520px);
  background-color: #0c80c8;
  border-radius: 32px;
  padding: 40px 40px 32px;
  box-shadow: 0 30px 80px rgba(10, 93, 140, 0.18);
}

.hero-copy {
  display: grid;
  gap: 20px;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(2.7rem, 4vw, 3.6rem);
  line-height: 1.06;
  color: white;
  max-width: 520px;
}

.hero-copy p {
  margin: 0;
}

.hero-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  max-width: 520px;
  font-size: 1rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.primary-button,
.secondary-button,
.search-card button {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.primary-button {
  padding: 14px 28px;
  background: #0069ce;
  color: white;
}

.secondary-button {
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.95);
  color: #0d6eef;
}

.search-card {
  display: grid;
  gap: 10px;
  background: white;
  padding: 7px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  max-width: 350px;
  min-width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.search-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.search-card input {
  width: 85%;
  padding: 8px 14px;
  border: 1px solid rgba(138, 138, 138, 0.9);
  border-radius: 9px;
  background: #f8faff;
  color: #1f3c60;
}

.search-card button {
  width: 100%;
  padding: 14px 18px;
  background: #0069ce;
  color: white;
  border-radius: 16px;
}


.search-card input::placeholder {
  color: #006eff;
}

.search-card button {
  min-width: 180px;
  padding: 12px 20px;
  background: #005bb5;
  color: white;
}

.hero-visual {
  display: grid;
  justify-items: end;
}

.map-card {
  width: 100%;
  min-height: 360px;
  border-radius: 34px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px);
  box-shadow: 0 24px 50px rgba(2, 70, 135, 0.14);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  color: #102a43;
  font-weight: 700;
}

.map-badge {
  width: 42px;
  height: 42px;
  border-radius: 50px;
  display: grid;
  place-items: center;
  background: white;
  color: #005bb5;
  font-size: 1.1rem;
}

.map-image {
  width: 100%;
  height: auto;
  border-radius: 30px;
  display: block;
}

.map-label {
  position: absolute;
  bottom: 18px;
  left: 24px;
  color: #102a43;
  font-weight: 700;
}

.pin {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0070d8;
  box-shadow: 0 0 0 10px rgba(0, 108, 207, 0.16);
}

.pin-1 { top: 36%; left: 28%; }
.pin-2 { top: 22%; left: 68%; }
.pin-3 { top: 58%; left: 52%; }
.pin-4 { top: 72%; left: 24%; }

.features-section,
.workflow-section {
  display: grid;
  gap: 24px;
}

.section-header {
  display: grid;
  gap: 12px;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  color: #102a43;
}

.section-header p {
  margin: 0;
  color: #52667a;
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.feature-card {
  background: white;
  border-radius: 22px;
  border: 1px solid rgba(13, 110, 253, 0.08);
  padding: 24px;
  display: grid;
  gap: 16px;
  min-height: 220px;
}

.feature-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  background: rgba(2, 136, 209, 0.12);
  border-radius: 18px;
  font-size: 1.3rem;
}

.feature-card h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #102a43;
}

.feature-card p {
  margin: 0;
  color: #52667a;
  line-height: 1.7;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.step-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(2, 136, 209, 0.08);
  text-align: center;
  box-shadow: 0 10px 35px rgba(2, 11, 40, 0.06);
}

.step-number {
  width: 56px;
  height: 56px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #0288d1;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
}

.step-card h3 {
  margin: 0 0 10px;
  color: #102a43;
}

.step-card p {
  margin: 0;
  color: #52667a;
  line-height: 1.8;
}

@media (max-width: 960px) {
  .hero-section,
  .features-grid,
  .workflow-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .search-card {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
