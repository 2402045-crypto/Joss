<template>
  <div class="landing-page">
    <section class="hero-section" :style="heroBackgroundStyle">
      <div class="hero-copy">
        <h1>Encuentra el mecánico perfecto para tu vehículo</h1>
        <p>Conectamos conductores con mecánicos profesionales certificados. Rápido, confiable y cerca de ti.</p>

        <div class="hero-actions">
          <button class="primary-button" type="button" @click="goTo('/login')">Iniciar Sesion</button>
          <button class="secondary-button" type="button" @click="goTo('/register')">Registrarse</button>
        </div>

        <div class="search-card">
          <div class="search-inputs">
            <input type="text" placeholder="Ciudad o código postal" />
            <input type="text" placeholder="Tipo de servicio" />
          </div>
          <button type="button">Buscar Talleres</button>
          <button class="taller-button" type="button" @click="goTo('/taller-register')">Registro de taller temporal</button>
        </div>
      </div>

      <div class="hero-visual">
        <button
          class="map-card map-card-button"
          type="button"
          @click="goTo('/maps')"
          aria-label="Abrir mapa interactivo de talleres"
        >
          <div class="map-header">
            <span>Buscar en esta área</span>
            <div class="map-badge">🔍</div>
          </div>
          <img :src="mapImage" alt="Mapa de talleres cercanos" class="map-image" />
          <span class="map-cta">Abrir mapa interactivo</span>
        </button>
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
import { useRouter } from 'vue-router'
import backgroundImage from '../../fondo.png'
import mapImage from '../../Mapa.png'

const router = useRouter()
const goTo = (path) => router.push(path)

const heroBackgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}
</script>

<style scoped src="../styles/components/LandingPage.css"></style>

