<template>
  <div class="help-container">
    <!-- Encabezado Principal -->
    <header class="help-header">
      <h1>Centro de Ayuda</h1>
      <p class="header-subtitle">Encuentra respuestas y soporte de MecanicWeb.</p>
    </header>

    <!-- Contenido Principal -->
    <div class="help-content">
      <!-- Sección de Preguntas Frecuentes -->
      <section class="faq-section">
        <div class="section-title">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#0288d1" />
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="18" font-weight="bold">?</text>
          </svg>
          <h2>Preguntas Frecuentes</h2>
        </div>
        <p class="section-subtitle">Encuentra respuestas rápidas a las dudas más comunes.</p>

        <!-- Acordeón de Preguntas -->
        <div class="faq-list">
          <div
            v-for="(item, index) in faqs"
            :key="index"
            class="faq-item"
          >
            <button
              class="faq-question"
              @click="toggleFaq(index)"
              :class="{ active: expandedFaq === index }"
            >
              <span>{{ item.question }}</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="chevron"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <transition name="faq-expand">
              <div v-if="expandedFaq === index" class="faq-answer">
                {{ item.answer }}
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- Panel Lateral de Contacto -->
      <aside class="sidebar">
        <!-- Card de Necesitas Ayuda -->
        <div class="help-card">
          <div class="card-header">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0288d1" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4M12 8h.01"></path>
            </svg>
            <h3>¿Necesitas más ayuda?</h3>
          </div>

          <div class="contact-info">
            <div class="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0288d1">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <a href="mailto:soporte@mecanicweb.com">soporte@mecanicweb.com</a>
            </div>

            <div class="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0288d1">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+52 984 276 5582</span>
            </div>

            <div class="contact-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0288d1">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
              </svg>
              <span class="schedule">Lunes a Viernes</span>
              <span class="time">9:00 am - 6:00 pm</span>
            </div>
          </div>

          <a href="mailto:soporte@mecanicweb.com" class="contact-button">
            ✉️ Contactar Soporte
          </a>
        </div>

        <!-- Card de Seguridad -->
        <div class="security-card">
          <div class="security-header">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0288d1" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 12 15 15 10"></polyline>
            </svg>
            <h3>Tu información es segura</h3>
          </div>
          <p>Tu seguridad y datos están protegidos con nosotros</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expandedFaq = ref(null)

const faqs = [
  {
    question: '¿Cómo encuentro un mecánico?',
    answer: 'Puedes usar la función de búsqueda en nuestra plataforma. Filtra por tipo de servicio, ubicación y calificaciones. También puedes usar el mapa interactivo para ver mecánicos cercanos a ti.'
  },
  {
    question: '¿Cómo contacto un taller?',
    answer: 'Una vez que encuentres un taller de tu interés, puedes comunicarte directamente a través de los datos de contacto que aparecen en su perfil, o usar nuestro sistema de mensajes integrado.'
  },
  {
    question: '¿Puedo pagar un servicio en la página?',
    answer: 'Actualmente, los pagos se coordinan directamente con el mecánico o taller. Estamos trabajando en integrar un sistema de pagos seguro para futuras versiones.'
  },
  {
    question: '¿Sólo es para autos?',
    answer: 'MecanicWeb se enfoca principalmente en servicios automotrices, pero continuamente expandimos nuestro catálogo de servicios relacionados con mantenimiento y reparación.'
  },
  {
    question: '¿Y si si?',
    answer: 'Mexico llegara a ser el campeon del mundial 2026, porque ¿Por qué no?'
  },    
  {
    question: '¿Es gratis usar MecanicWeb?',
    answer: 'Sí, MecanicWeb es completamente gratuito para los usuarios. Los mecánicos y talleres cuentan con opciones de membresía para mayor visibilidad.'
  }
]

const toggleFaq = (index) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.help-container {
  width: 100%;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Encabezado Principal */
.help-header {
  background: linear-gradient(135deg, #0288d1 0%, #01579b 100%);
  color: white;
  padding: 60px 32px;
  text-align: center;
  border-radius: 0 0 24px 24px;
}

.help-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.header-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
}

/* Contenido Principal */
.help-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 50px;
}

/* Sección FAQ */
.faq-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.section-title h2 {
  font-size: 1.5rem;
  color: #102a43;
  margin: 0;
}

.section-subtitle {
  color: #486581;
  font-size: 0.95rem;
  margin: 0 0 24px 44px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid #e0e4e8;
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  background: #f9fafb;
  border: none;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #102a43;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f0f4f8;
}

.faq-question.active {
  background: #e3f2fd;
  color: #0288d1;
}

.faq-question .chevron {
  transition: transform 0.3s ease;
  color: #0288d1;
}

.faq-question.active .chevron {
  transform: rotate(180deg);
}

.faq-answer {
  background: white;
  padding: 16px 20px;
  color: #486581;
  line-height: 1.6;
  font-size: 0.95rem;
  border-top: 1px solid #e0e4e8;
}

.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.2s ease;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.help-card,
.security-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 1.1rem;
  color: #102a43;
  margin: 0;
}

.security-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.security-header h3 {
  font-size: 1rem;
  color: #102a43;
  margin: 0;
}

.security-card p {
  margin: 0;
  color: #486581;
  font-size: 0.9rem;
  line-height: 1.5;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contact-item svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-item a,
.contact-item span {
  color: #486581;
  font-size: 0.9rem;
  text-decoration: none;
}

.contact-item a:hover {
  color: #0288d1;
  text-decoration: underline;
}

.schedule {
  display: block;
  font-weight: 600;
  color: #102a43;
}

.time {
  display: block;
  color: #486581;
}

.contact-button {
  width: 100%;
  background: #0288d1;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.3s ease;
  text-decoration: none;
}

.contact-button:hover {
  background: #0277bd;
}

/* Responsive */
@media (max-width: 768px) {
  .help-content {
    grid-template-columns: 1fr;
    padding: 24px 16px;
    gap: 24px;
  }

  .help-header {
    padding: 40px 20px;
  }

  .help-header h1 {
    font-size: 2rem;
  }

  .faq-section {
    padding: 20px;
  }

  .section-title h2 {
    font-size: 1.3rem;
  }
}
</style>
