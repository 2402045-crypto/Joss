<template>
  <div class="register-page">
    <div class="register-card">
      <div class="card-header">
        <div>
          <h1>Crear Cuenta</h1>
          <p>Completa el formulario para crear tu cuenta</p>
        </div>
      </div>

      <form class="register-form" @submit.prevent>
        <div class="role-switch">
          <button type="button" :class="['role-button', role === 'usuario' ? 'active' : '']" @click="role = 'usuario'">
            Usuario
          </button>
          <button type="button" :class="['role-button', role === 'mecanico' ? 'active' : '']" @click="role = 'mecanico'">
            Mecánico
          </button>
        </div>

        <div class="field-grid">
          <label>
            <span>Nombre Completo *</span>
            <input type="text" placeholder="Carlos Rodríguez" />
          </label>

          <label v-if="role === 'mecanico'">
            <span>Nombre del Taller *</span>
            <input type="text" placeholder="Taller Mecánico Rodríguez" />
          </label>
        </div>

        <div class="field-grid two-columns">
          <label>
            <span>Correo Electrónico *</span>
            <input type="email" placeholder="carlos@taller.com" />
          </label>

          <label>
            <span>Teléfono *</span>
            <input type="tel" placeholder="+52 55 1234 5678" />
          </label>
        </div>

        <label v-if="role === 'mecanico'">
          <span>Ubicación del Taller *</span>
          <input type="text" placeholder="Calle, Colonia, Ciudad" />
        </label>

        <div class="field-grid two-columns" v-if="role === 'mecanico'">
          <label>
            <span>Años de Experiencia *</span>
            <input type="number" placeholder="10" />
          </label>

          <label>
            <span>Rango de Precios *</span>
            <input type="text" placeholder="Desde $... hasta $..." />
          </label>
        </div>

        <div class="info-box" v-if="role === 'mecanico'">
          <strong>Registro de Mecánico Profesional</strong>
          <p>Para garantizar la calidad del servicio, necesitamos información adicional. Tu perfil será verificado antes de ser publicado.</p>
        </div>

        <div class="specialties" v-if="role === 'mecanico'">
          <span>Especialidades * (Selecciona al menos 3)</span>
          <div class="specialty-grid">
            <button type="button" class="chip">Mantenimiento General</button>
            <button type="button" class="chip">Frenos y Suspensión</button>
            <button type="button" class="chip">Aire Acondicionado</button>
            <button type="button" class="chip">Diagnóstico Computarizado</button>
            <button type="button" class="chip">Hojalatería</button>
            <button type="button" class="chip">Motor y Transmisión</button>
            <button type="button" class="chip">Electricidad Automotriz</button>
            <button type="button" class="chip">Alineación y Balanceo</button>
            <button type="button" class="chip">Pintura y Carrocería</button>
            <button type="button" class="chip">Motores Diesel</button>
          </div>
        </div>

        <label v-if="role === 'mecanico'">
          <span>Certificaciones</span>
          <textarea placeholder="Ej: Certificado ASE, Curso de sistemas de inyección, etc."></textarea>
        </label>

        <label v-if="role === 'mecanico'">
          <span>Descripción de tu Servicio *</span>
          <textarea placeholder="Describe brevemente tu experiencia y servicios..."></textarea>
        </label>

        <label>
          <span>Contraseña *</span>
          <input type="password" placeholder="********" />
        </label>

        <div class="note-box" v-if="role === 'mecanico'">
          <strong>Nota:</strong>
          <p>Tu perfil será revisado por nuestro equipo en un plazo de 24-48 horas. Recibirás un correo cuando tu cuenta sea verificada y activada.</p>
        </div>

        <button type="submit" class="primary-button">Crear cuenta envío solicitud</button>
      </form>

      <footer>
        <button type="button" class="text-link" @click="goToLogin">¿Ya tienes cuenta? Inicia sesión</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const role = ref('mecanico')
const emit = defineEmits(['switch-view'])
const goToLogin = () => emit('switch-view', 'login')
</script>

<style scoped>
.register-page {
  width: 100%;
  max-width: 680px;
  padding: 24px;
}

.register-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
  padding: 32px;
  border: 1px solid rgba(2, 136, 209, 0.12);
}

.card-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #102a43;
}

.card-header p {
  margin: 10px 0 0;
  color: #627d98;
  font-size: 0.95rem;
  line-height: 1.6;
}

.register-form {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}

.role-switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: #f4f7fb;
  border-radius: 999px;
  border: 1px solid #d9e2ec;
  padding: 6px;
}

.role-button {
  border: none;
  background: transparent;
  padding: 14px 16px;
  border-radius: 999px;
  color: #486581;
  font-weight: 600;
  cursor: pointer;
}

.role-button.active {
  background: white;
  color: #0b4772;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.field-grid {
  display: grid;
  gap: 18px;
}

.field-grid.two-columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.register-form label,
.specialties {
  display: grid;
  gap: 10px;
  color: #334e68;
  font-size: 0.95rem;
}

.register-form input,
.register-form textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  background: #f8fbff;
  color: #102a43;
}

.register-form textarea {
  min-height: 110px;
  resize: vertical;
}

.specialties span {
  display: block;
  font-weight: 600;
}

.specialty-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 18px;
  border: 1px solid #dde7ee;
  border-radius: 16px;
  background: #fbfcff;
}

.chip {
  border: 1px solid #d9e2ec;
  border-radius: 999px;
  padding: 10px 14px;
  text-align: left;
  background: white;
  color: #334e68;
  cursor: pointer;
  font-size: 0.92rem;
}

.info-box,
.note-box {
  border-radius: 16px;
  padding: 18px;
  background: #e8f6ff;
  border: 1px solid #b1ddff;
  color: #0f4f76;
}

.info-box strong,
.note-box strong {
  display: block;
  margin-bottom: 8px;
  font-size: 0.98rem;
}

.note-box {
  background: #fff4d9;
  border-color: #ffdba7;
  color: #7a4a00;
}

.primary-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: #0288d1;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

footer {
  margin-top: 18px;
  text-align: center;
}

footer a {
  color: #0288d1;
  font-weight: 600;
  text-decoration: none;
}
</style>
