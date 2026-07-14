<template>
  <div class="mis-citas-view">

    <!-- Header / Hero Section -->
    <section class="hero-citas">
      <div class="hero-citas-info">
        <div class="main-icon-circle">
          <!-- Icono SVG de calendario azul del diseño -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d6eef" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <div>
          <h1>Mis Citas</h1>
          <p>Consulta y administra todas las citas que has agendado</p>
        </div>
      </div>
      <!-- Imagen ilustrativa del calendario con reloj -->
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/calendar-6450654-5349274.png" alt="Calendario Ilustración" class="hero-citas-img" />
    </section>

    <!-- Subtítulo de pestaña/sección -->
    <div class="section-title-wrapper">
      <h2 class="titulo-seccion">
        <span class="calendar-mini-icon">📅</span> Tus próximas citas
      </h2>
      <div class="active-underline"></div>
    </div>

    <!-- Lista de tarjetas de Citas -->
    <div class="citas-list-container">
      <article
        class="cita-card-item"
        v-for="cita in citas"
        :key="cita.id"
      >
        <!-- Icono dinámico según el estado a la izquierda -->
        <div class="status-avatar-zone" :class="'avatar-' + cita.estado.toLowerCase()">
          <span v-if="cita.estado === 'Pendiente'" class="status-inner-icon">📅</span>
          <span v-if="cita.estado === 'Completada'" class="status-inner-icon">✓</span>
          <span v-if="cita.estado === 'Cancelada'" class="status-inner-icon">✕</span>
        </div>

        <!-- Bloque central de contenido (Se expande para ocupar todo el espacio libre) -->
        <div class="cita-main-content">
          
          <div class="card-top-row">
            <!-- Datos del taller y servicio (Alineados a la izquierda) -->
            <div class="info-text-left">
              <h3 class="workshop-title-text">{{ cita.taller }}</h3>
              
              <p class="service-type-row">
                <span class="icon-tool">🔧</span> {{ cita.servicio }}
              </p>

              <div class="datetime-badges-row">
                <span class="dt-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {{ cita.fecha }}
                </span>
                <span class="dt-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {{ cita.hora }}
                </span>
              </div>
            </div>

            <!-- Badge de Estado (Corregido sin v-slot) -->
            <div class="status-badge-wrapper">
              <span class="status-badge" :class="cita.estado.toLowerCase()">
                <span class="badge-dot" v-if="cita.estado === 'Pendiente'">🕒</span>
                <span class="badge-dot" v-if="cita.estado === 'Completada'">✓</span>
                <span class="badge-dot" v-if="cita.estado === 'Cancelada'">✕</span>
                {{ cita.estado }}
              </span>
            </div>
          </div>

          <!-- Fila de Botones de Acción (Empujados abajo a la derecha) -->
          <div class="card-buttons-actions">
            <button class="btn-action-view">
              👁 Ver detalles
            </button>
            <button
              v-if="cita.estado === 'Pendiente'"
              class="btn-action-cancel"
            >
              🗑 Cancelar
            </button>
          </div>

        </div>
      </article>
    </div>

    <!-- Banner Informativo Inferior -->
    <footer class="help-info-banner">
      <div class="help-left-side">
        <div class="info-blue-bubble">i</div>
        <div class="help-text-block">
          <h4>¿Necesitas ayuda?</h4>
          <p>Si tienes dudas sobre alguna cita o necesitas reagendar, contáctanos.</p>
        </div>
      </div>
      <RouterLink to="/help" class="help-center-redirect-btn">
        🎧 Centro de ayuda
      </RouterLink>
    </footer>

  </div>
</template>

<script setup>
import { ref } from "vue";

const citas = ref([
  {
    id: 1,
    taller: "Taller El Chingón",
    servicio: "Cambio de aceite",
    fecha: "20 Julio 2026",
    hora: "10:00 AM",
    estado: "Pendiente"
  },
  {
    id: 2,
    taller: "Mecanic Plus",
    servicio: "Afinación",
    fecha: "12 Julio 2026",
    hora: "2:30 PM",
    estado: "Completada"
  },
  {
    id: 3,
    taller: "Auto Service",
    servicio: "Cambio de frenos",
    fecha: "8 Julio 2026",
    hora: "11:00 AM",
    estado: "Cancelada"
  }
]);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mis-citas-view {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 20px 60px;
  font-family: system-ui, -apple-system, sans-serif;
  background: #ffffff;
}


.hero-citas {
  background: linear-gradient(135deg, #f0f6ff 0%, #e1edfe 100%);
  border-radius: 20px;
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.hero-citas-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.main-icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(13, 110, 239, 0.08);
}

.hero-citas h1 {
  margin: 0;
  font-size: 2.25rem;
  color: #0f172a;
  font-weight: 800;
}

.hero-citas p {
  margin: 6px 0 0 0;
  color: #64748b;
  font-size: 1.05rem;
}

.hero-citas-img {
  width: 180px;
  height: auto;
  object-fit: contain;
}

/* --- SECCIÓN SUBTÍTULO --- */
.section-title-wrapper {
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

.titulo-seccion {
  font-size: 1.15rem;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-mini-icon {
  font-size: 1.1rem;
}

.active-underline {
  height: 3px;
  width: 100%;
  background: #0d6eef;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* --- TARJETAS CONTENEDORAS --- */
.citas-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  width: 100%;
}

.cita-card-item {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.cita-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.07);
}

/* Avatares de estado redondos a la izquierda */
.status-avatar-zone {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.avatar-pendiente { background: #fffbeb; border: 1.5px solid #fef3c7; color: #d97706; }
.avatar-completada { background: #f0fdf4; border: 1.5px solid #dcfce7; color: #16a34a; }
.avatar-cancelada { background: #fef2f2; border: 1.5px solid #fee2e2; color: #dc2626; }

.status-inner-icon {
  font-size: 1.8rem;
  font-weight: 600;
}

/* Bloque central de datos */
.cita-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

/* Fila Superior: Datos a la izq y Badge a la derecha */
.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.info-text-left {
  flex: 1;
}

.workshop-title-text {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 700;
}

.service-type-row {
  margin: 6px 0 10px;
  font-size: 0.95rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-tool {
  font-style: normal;
}

.datetime-badges-row {
  display: flex;
  gap: 20px;
}

.dt-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
}

/* Badge de Estado */
.status-badge-wrapper {
  flex-shrink: 0;
  margin-left: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-badge.pendiente { background: #fff9e6; color: #d97706; }
.status-badge.completada { background: #e6f9ed; color: #16a34a; }
.status-badge.cancelada { background: #ffebeb; color: #dc2626; }

.badge-dot {
  font-style: normal;
}

/* Fila Inferior: Botones de Acción abajo a la derecha */
.card-buttons-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 15px;
  width: 100%;
}

.btn-action-view,
.btn-action-cancel {
  border: 1px solid #cbd5e1;
  background: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-action-view {
  color: #0d6eef;
  border-color: #0d6eef;
}

.btn-action-view:hover {
  background: #0d6eef;
  color: white;
}

.btn-action-cancel {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-action-cancel:hover {
  background: #dc3545;
  color: white;
}

/* --- BANNER DE AYUDA INFERIOR --- */
.help-info-banner {
  background: #f0f5ff;
  border-radius: 14px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.help-left-side {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-blue-bubble {
  width: 32px;
  height: 32px;
  background: #0d6eef;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: serif;
  font-weight: bold;
  font-size: 1.1rem;
}

.help-text-block h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 700;
}

.help-text-block p {
  margin: 3px 0 0 0;
  font-size: 0.85rem;
  color: #475569;
}

.help-center-redirect-btn {
  background: white;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: background 0.2s;
  white-space: nowrap;
}

.help-center-redirect-btn:hover {
  background: #f8fafc;
}

/* --- RESPONSIVO EXACTO --- */
@media(max-width: 900px) {
  .hero-citas {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 24px;
  }
  .hero-citas-info {
    flex-direction: column;
  }
  .hero-citas-img {
    width: 140px;
  }
  .cita-card-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .status-avatar-zone {
    width: 60px;
    height: 60px;
  }
  .status-inner-icon {
    font-size: 1.4rem;
  }
  .card-top-row {
    flex-direction: column;
    gap: 12px;
  }
  .status-badge-wrapper {
    margin-left: 0;
  }
  .card-buttons-actions {
    border-top: 1px dashed #e2e8f0;
    padding-top: 16px;
  }
  .help-info-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .help-center-redirect-btn {
    width: 100%;
    text-align: center;
  }
}

@media(max-width: 500px) {
  .card-buttons-actions {
    flex-direction: column;
  }
  .btn-action-view, .btn-action-cancel {
    width: 100%;
    justify-content: center;
  }
}
</style>