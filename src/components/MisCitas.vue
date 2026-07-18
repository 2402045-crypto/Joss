<template>
  <div class="mis-citas-view">

    <!-- ========================================== -->
    <!-- VISTA PARA EL MECÁNICO / TALLER            -->
    <!-- ========================================== -->
    <div v-if="esMecanico" class="citas-mecanico-view">
      <header class="header-banner">
        <h1>Panel de Citas del Taller</h1>
        <p>Administra las solicitudes de tus clientes y revisa tu historial</p>
      </header>

      <!-- Pestañas de navegación -->
      <div class="tabs-container">
        <button 
          :class="['tab-btn', { active: pestanaActual === 'pendientes' }]" 
          @click="pestanaActual = 'pendientes'"
        >
          Nuevas Solicitudes ({{ citasPendientes.length }})
        </button>
        <button 
          :class="['tab-btn', { active: pestanaActual === 'historial' }]" 
          @click="pestanaActual = 'historial'"
        >
          Historial de Citas
        </button>
      </div>

      <div v-if="cargando" class="mensaje-estado">Cargando información...</div>

      <!-- PESTAÑA: SOLICITUDES PENDIENTES -->
      <div v-if="!cargando && pestanaActual === 'pendientes'">
        <div v-if="citasPendientes.length === 0" class="mensaje-estado">
          No tienes citas nuevas por revisar.
        </div>
        
        <div class="grid-citas">
          <div v-for="cita in citasPendientes" :key="cita.id_cita" class="cita-card">
            <div class="cita-info">
              <h3>👤 Cliente: {{ cita.nombre_cliente || 'Desconocido' }}</h3>
              <p><strong>Servicio:</strong> {{ cita.nombre_servicio }}</p>
              <p><strong>Fecha:</strong> {{ formatearFecha(cita.fecha) }} a las {{ formatearHora(cita.hora) }}</p>
              <p v-if="cita.descripcion" class="descripcion-caja">
                "{{ cita.descripcion }}"
              </p>
            </div>
            <div class="cita-acciones">
              <button class="btn-aceptar" @click="cambiarEstado(cita.id_cita, 'Aceptada')">✓ Aceptar</button>
              <button class="btn-rechazar" @click="cambiarEstado(cita.id_cita, 'Rechazada')">✕ Denegar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- PESTAÑA: HISTORIAL (ACORDEÓN POR MES) -->
      <div v-if="!cargando && pestanaActual === 'historial'">
        <div v-if="Object.keys(historialAgrupado).length === 0" class="mensaje-estado">
          Aún no hay historial de citas en tu taller.
        </div>

        <div class="acordeon-mes" v-for="(citasDelMes, mes) in historialAgrupado" :key="mes">
          <div class="acordeon-header" @click="toggleMes(mes)">
            <h2>📅 {{ mes }} <span>({{ citasDelMes.length }} citas)</span></h2>
            <span class="flecha">{{ mesesAbiertos[mes] ? '▲' : '▼' }}</span>
          </div>
          
          <div class="acordeon-body" v-show="mesesAbiertos[mes]">
            <div v-for="cita in citasDelMes" :key="cita.id_cita" class="cita-card historial-card">
              <div class="cita-info">
                <h3>{{ cita.nombre_cliente || 'Desconocido' }}</h3>
                <p>🔧 {{ cita.nombre_servicio }} - {{ formatearFecha(cita.fecha) }}</p>
              </div>
              <div>
                 <span :class="['badge', cita.estado.toLowerCase()]">{{ cita.estado }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- VISTA PARA EL CLIENTE NORMAL               -->
    <!-- ========================================== -->
    <div v-else>
      <!-- Header / Hero Section -->
      <section class="hero-citas">
        <div class="hero-citas-info">
          <div class="main-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d6eef" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <h1>Mis Citas</h1>
            <p>Consulta y administra todas las citas que has agendado</p>
          </div>
        </div>
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/calendar-6450654-5349274.png" alt="Calendario Ilustración" class="hero-citas-img" />
      </section>

      <!-- Subtítulo de pestaña/sección -->
      <div class="section-title-wrapper">
        <h2 class="titulo-seccion">
          <span class="calendar-mini-icon">📅</span> Tus próximas citas
        </h2>
        <div class="active-underline"></div>
      </div>

      <!-- Mensajes de estado -->
      <div v-if="cargando" class="mensaje-estado">Cargando tus citas...</div>
      <div v-else-if="citas.length === 0" class="mensaje-estado">No tienes citas agendadas aún.</div>

      <!-- Lista de tarjetas de Citas -->
      <div v-else class="citas-list-container">
        <article class="cita-card-item" v-for="cita in citas" :key="cita.id_cita">
          <!-- Icono dinámico -->
          <div class="status-avatar-zone" :class="'avatar-' + cita.estado.toLowerCase()">
            <span v-if="cita.estado === 'Pendiente'" class="status-inner-icon">📅</span>
            <span v-if="cita.estado === 'Completada' || cita.estado === 'Aceptada'" class="status-inner-icon">✓</span>
            <span v-if="cita.estado === 'Cancelada'" class="status-inner-icon">✕</span>
          </div>

          <div class="cita-main-content">
            <div class="card-top-row">
              <div class="info-text-left">
                <h3 class="workshop-title-text">{{ cita.nombre_taller }}</h3>
                <p class="service-type-row"><span class="icon-tool">🔧</span> {{ cita.nombre_servicio }}</p>
                <div class="datetime-badges-row">
                  <span class="dt-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {{ formatearFecha(cita.fecha) }}
                  </span>
                  <span class="dt-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {{ formatearHora(cita.hora) }}
                  </span>
                </div>
              </div>

              <div class="status-badge-wrapper">
                <span class="status-badge" :class="cita.estado.toLowerCase()">
                  <span class="badge-dot" v-if="cita.estado === 'Pendiente'">🕒</span>
                  <span class="badge-dot" v-if="cita.estado === 'Completada' || cita.estado === 'Aceptada'">✓</span>
                  <span class="badge-dot" v-if="cita.estado === 'Cancelada'">✕</span>
                  {{ cita.estado }}
                </span>
              </div>
            </div>

            <div class="card-buttons-actions">
              <button class="btn-action-view" @click="abrirDetalles(cita)">👁 Ver detalles</button>
              <button v-if="cita.estado === 'Pendiente' || cita.estado === 'Aceptada'" class="btn-action-cancel" @click="cancelarCita(cita.id_cita)">
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
        <RouterLink to="/help" class="help-center-redirect-btn">🎧 Centro de ayuda</RouterLink>
      </footer>

      <!-- MODAL DE DETALLES DEL CLIENTE -->
      <div v-if="citaSeleccionada" class="modal-overlay" @click.self="cerrarDetalles">
        <div class="modal-content">
          <button class="close-btn" @click="cerrarDetalles">✕</button>
          <h2>Detalles de la cita</h2>
          <div class="detalle-grupo"><strong>Taller:</strong><p>{{ citaSeleccionada.nombre_taller }}</p></div>
          <div class="detalle-grupo"><strong>📍 Dirección:</strong><p>{{ citaSeleccionada.direccion || 'No registrada' }}</p></div>
          <div class="detalle-grupo"><strong>📞 Teléfono:</strong><p>{{ citaSeleccionada.telefono || 'No registrado' }}</p></div>
          <div class="detalle-grupo"><strong>🔧 Servicio solicitado:</strong><p>{{ citaSeleccionada.nombre_servicio }}</p></div>
          <div class="detalle-grupo"><strong>💵 Precio base:</strong><p>{{ citaSeleccionada.precio ? '$' + citaSeleccionada.precio : 'Por cotizar' }}</p></div>
          <div class="detalle-grupo description-box">
            <strong>📝 Tu descripción del problema:</strong>
            <p>{{ citaSeleccionada.descripcion || 'No agregaste descripción.' }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// ESTADOS GENERALES
// ESTADOS GENERALES
const cargando = ref(true);
const citas = ref([]);
const esMecanico = ref(false);

// ESTADOS DEL CLIENTE
const citaSeleccionada = ref(null);

// ESTADOS DEL MECÁNICO
const pestanaActual = ref('pendientes');
const mesesAbiertos = ref({});

// ==========================================
// FUNCIÓN PRINCIPAL: CARGAR CITAS CORREGIDA
// ==========================================
const obtenerCitas = async () => {
  cargando.value = true;
  
  // 1. Corregimos la lectura según tu LocalStorage real
  const rolGuardado = localStorage.getItem('usuario_rol'); 
  esMecanico.value = (rolGuardado === '2' || rolGuardado === 2); 

  const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let API_URL = '';

  // 2. Usamos tus claves reales para armar las peticiones
  // 2. Preparamos la ruta dependiendo del tipo de usuario
  if (esMecanico.value) {
    // Mandamos el ID del usuario mecánico directamente de tu localStorage
    const idMecanico = localStorage.getItem('usuario_id'); 
    
    API_URL = esLocal 
      ? `http://localhost:8080/Joss/api/obtener_citas_taller.php?id_usuario_mecanico=${idMecanico}` 
      : `https://mecanicweb.free.nf/Joss/api/obtener_citas_taller.php?id_usuario_mecanico=${idMecanico}`;
  } else {
    // ... lo demás se queda igual
    const idUsuario = localStorage.getItem('usuario_id');
    if (!idUsuario) {
      cargando.value = false;
      return;
    }
    API_URL = esLocal 
      ? `http://localhost:8080/Joss/api/obtener_mis_citas.php?id_usuario=${idUsuario}` 
      : `https://mecanicweb.free.nf/Joss/api/obtener_mis_citas.php?id_usuario=${idUsuario}`;
  }

  // 3. Hacemos la petición
  try {
    const respuesta = await fetch(API_URL);
    const resultado = await respuesta.json();
    if (resultado.status === 'success') {
      citas.value = resultado.data;
    }
  } catch (error) {
    console.error('Error al obtener citas:', error);
  } finally {
    cargando.value = false;
  }
};

// ==========================================
// FUNCIONES DEL MECÁNICO
// ==========================================
const cambiarEstado = async (idCita, nuevoEstado) => {
  if (!confirm(`¿Estás seguro de que quieres marcar esta cita como ${nuevoEstado}?`)) return;

  const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = esLocal 
    ? 'http://localhost:8080/Joss/api/actualizar_estado_cita.php' 
    : 'https://mecanicweb.free.nf/Joss/api/actualizar_estado_cita.php';

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cita: idCita, estado: nuevoEstado })
    });
    const resultado = await respuesta.json();
    
    if (resultado.status === 'success') {
      obtenerCitas(); // Recargamos para actualizar la vista
    } else {
      alert('Error al actualizar: ' + resultado.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const citasPendientes = computed(() => {
  return citas.value.filter(c => c.estado === 'Pendiente');
});

const historialAgrupado = computed(() => {
  const historial = citas.value.filter(c => c.estado !== 'Pendiente');
  const grupos = {};

  historial.forEach(cita => {
    const fechaObj = new Date(cita.fecha + 'T12:00:00');
    const mes = fechaObj.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const nombreMes = mes.charAt(0).toUpperCase() + mes.slice(1);

    if (!grupos[nombreMes]) {
      grupos[nombreMes] = [];
      if (mesesAbiertos.value[nombreMes] === undefined) {
        mesesAbiertos.value[nombreMes] = true; 
      }
    }
    grupos[nombreMes].push(cita);
  });
  return grupos;
});

const toggleMes = (mes) => {
  mesesAbiertos.value[mes] = !mesesAbiertos.value[mes];
};


// ==========================================
// FUNCIONES DEL CLIENTE
// ==========================================
const cancelarCita = async (idCita) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

  const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = esLocal 
    ? 'http://localhost:8080/Joss/api/cancelar_cita.php' 
    : 'https://mecanicweb.free.nf/Joss/api/cancelar_cita.php';

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cita: idCita })
    });
    const resultado = await respuesta.json();
    
    if (resultado.status === 'success') {
      obtenerCitas(); 
    } else {
      alert('No se pudo cancelar: ' + resultado.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const abrirDetalles = (cita) => {
  citaSeleccionada.value = cita;
};

const cerrarDetalles = () => {
  citaSeleccionada.value = null;
};


// ==========================================
// UTILIDADES COMPARTIDAS
// ==========================================
const formatearFecha = (fechaGringa) => {
  const date = new Date(fechaGringa + 'T12:00:00');
  const dia = date.getDate();
  const mes = date.toLocaleString('es-ES', { month: 'long' });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const anio = date.getFullYear();
  return `${dia} ${mesCapitalizado} ${anio}`;
};

const formatearHora = (horaMilitar) => {
  const [hora, minuto] = horaMilitar.split(':');
  const ampm = hora >= 12 ? 'PM' : 'AM';
  const hora12 = hora % 12 || 12;
  return `${hora12}:${minuto} ${ampm}`;
};

onMounted(() => {
  obtenerCitas();
});
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

.mensaje-estado {
  text-align: center;
  color: #64748b;
  padding: 40px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

/* ==========================================
   ESTILOS DE LA VISTA DEL CLIENTE
========================================== */
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

.status-avatar-zone {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.avatar-pendiente { background: #fffbeb; border: 1.5px solid #fef3c7; color: #d97706; }
.avatar-completada, .avatar-aceptada { background: #f0fdf4; border: 1.5px solid #dcfce7; color: #16a34a; }
.avatar-cancelada { background: #fef2f2; border: 1.5px solid #fee2e2; color: #dc2626; }

.status-inner-icon { font-size: 1.8rem; font-weight: 600; }

.cita-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.info-text-left { flex: 1; }

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

.icon-tool { font-style: normal; }

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
.status-badge.completada, .status-badge.aceptada { background: #e6f9ed; color: #16a34a; }
.status-badge.cancelada { background: #ffebeb; color: #dc2626; }

.badge-dot { font-style: normal; }

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

.btn-action-view { color: #0d6eef; border-color: #0d6eef; }
.btn-action-view:hover { background: #0d6eef; color: white; }
.btn-action-cancel { color: #dc3545; border-color: #dc3545; }
.btn-action-cancel:hover { background: #dc3545; color: white; }

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: white;
  width: 90%;
  max-width: 480px;
  border-radius: 20px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
}
.close-btn:hover { color: #ef4444; }
.modal-content h2 {
  margin: 0 0 24px;
  font-size: 1.5rem;
  color: #0f172a;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}
.detalle-grupo { margin-bottom: 18px; }
.detalle-grupo strong {
  color: #64748b;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.detalle-grupo p {
  margin: 0;
  color: #1e293b;
  font-size: 1.05rem;
  font-weight: 500;
}
.description-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 24px;
}


/* ==========================================
   ESTILOS DE LA VISTA DEL MECÁNICO
========================================== */
.citas-mecanico-view { max-width: 900px; margin: 0 auto; font-family: sans-serif; }
.header-banner { background: #1e293b; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.header-banner h1 { margin: 0 0 5px; font-size: 1.5rem; }
.header-banner p { margin: 0; color: #94a3b8; }

.tabs-container { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
.tab-btn { background: none; border: none; padding: 10px 20px; font-size: 1rem; cursor: pointer; color: #64748b; font-weight: bold; border-bottom: 3px solid transparent; margin-bottom: -2px; }
.tab-btn.active { color: #0d6eef; border-bottom-color: #0d6eef; }

.grid-citas { display: flex; flex-direction: column; gap: 15px; }
.cita-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); flex-wrap: wrap; gap: 15px; }
.cita-info h3 { margin: 0 0 10px; color: #0f172a; }
.cita-info p { margin: 5px 0; color: #475569; }
.descripcion-caja { background: #f1f5f9; padding: 10px; border-radius: 8px; font-style: italic; }

.cita-acciones { display: flex; gap: 10px; }
.btn-aceptar, .btn-rechazar { padding: 10px 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; color: white; }
.btn-aceptar { background: #16a34a; }
.btn-rechazar { background: #dc2626; }

.acordeon-mes { margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
.acordeon-header { background: #f8fafc; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.acordeon-header h2 { margin: 0; font-size: 1.1rem; color: #1e293b; }
.acordeon-header h2 span { color: #64748b; font-size: 0.9rem; font-weight: normal; }
.acordeon-body { padding: 15px; background: white; }
.historial-card { margin-bottom: 10px; padding: 15px; }

.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
.badge.aceptada, .badge.completada { background: #dcfce7; color: #16a34a; }
.badge.rechazada, .badge.cancelada { background: #fee2e2; color: #dc2626; }


/* ==========================================
   DISEÑO RESPONSIVO COMPARTIDO
========================================== */
@media(max-width: 900px) {
  .hero-citas {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 24px;
  }
  .hero-citas-info { flex-direction: column; }
  .hero-citas-img { width: 140px; }
  .cita-card-item { flex-direction: column; align-items: flex-start; gap: 16px; }
  .status-avatar-zone { width: 60px; height: 60px; }
  .status-inner-icon { font-size: 1.4rem; }
  .card-top-row { flex-direction: column; gap: 12px; }
  .status-badge-wrapper { margin-left: 0; }
  .card-buttons-actions { border-top: 1px dashed #e2e8f0; padding-top: 16px; }
  .help-info-banner { flex-direction: column; align-items: flex-start; }
  .help-center-redirect-btn { width: 100%; text-align: center; }
}

@media(max-width: 500px) {
  .card-buttons-actions { flex-direction: column; }
  .btn-action-view, .btn-action-cancel { width: 100%; justify-content: center; }
}
</style>