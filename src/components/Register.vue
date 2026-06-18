<template>
  <div class="register-page">
    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon">✓</div>
        <h2>Cuenta creada con éxito</h2>
        <p>Ahora puedes iniciar sesión con tus credenciales</p>
        <button type="button" class="modal-button" @click="closeModal">Ir a Iniciar Sesión</button>
      </div>
    </div>

    <div class="register-card">
      <div class="card-header">
        <div>
          <h1>Crear Cuenta</h1>
          <p>Completa el formulario para crear tu cuenta</p>
        </div>
      </div>

      <form class="register-form" @submit.prevent="handleSubmit">
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
            <input type="text" v-model="formData.fullName" placeholder="Carlos Rodríguez" />
          </label>

          <label v-if="role === 'mecanico'">
            <span>Nombre del Taller *</span>
            <input type="text" v-model="formData.shopName" placeholder="Taller Mecánico Rodríguez" />
          </label>
        </div>

        <div class="field-grid two-columns">
          <label>
            <span>Correo Electrónico *</span>
            <input type="email" v-model="formData.email" placeholder="carlos@taller.com" />
          </label>

          <label>
            <span>Teléfono *</span>
            <input type="tel" v-model="formData.phone" placeholder="+52 55 1234 5678" />
          </label>
        </div>

        <label v-if="role === 'mecanico'">
          <span>Ubicación del Taller *</span>
          <input type="text" v-model="formData.location" placeholder="Calle, Colonia, Ciudad" />
        </label>

        <div class="field-grid two-columns" v-if="role === 'mecanico'">
          <label>
            <span>Años de Experiencia *</span>
            <input type="number" v-model="formData.experience" placeholder="10" />
          </label>

          <label>
            <span>Rango de Precios *</span>
            <input type="text" v-model="formData.priceRange" placeholder="Desde $... hasta $..." />
          </label>
        </div>

        <div class="info-box" v-if="role === 'mecanico'">
          <strong>Registro de Mecánico Profesional</strong>
          <p>Para garantizar la calidad del servicio, necesitamos información adicional. Tu perfil será verificado antes de ser publicado.</p>
        </div>

        <div class="specialties" v-if="role === 'mecanico'">
          <span>Especialidades * (Selecciona al menos 3)</span>
          <div class="specialty-grid">
            <button 
              v-for="specialty in specialties" 
              :key="specialty"
              type="button" 
              :class="['chip', selectedSpecialties.includes(specialty) ? 'selected' : '']"
              @click="toggleSpecialty(specialty)"
            >
              {{ specialty }}
            </button>
          </div>
        </div>

        <label v-if="role === 'mecanico'">
          <span>Certificaciones</span>
          <textarea v-model="formData.certifications" placeholder="Ej: Certificado ASE, Curso de sistemas de inyección, etc."></textarea>
        </label>

        <label v-if="role === 'mecanico'">
          <span>Descripción de tu Servicio *</span>
          <textarea v-model="formData.description" placeholder="Describe brevemente tu experiencia y servicios..."></textarea>
        </label>

        <label>
          <span>Contraseña *</span>
          <input type="password" v-model="formData.password" placeholder="********" />
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
const showSuccessModal = ref(false)
const selectedSpecialties = ref([])

const specialties = [
  'Mantenimiento General',
  'Frenos y Suspensión',
  'Aire Acondicionado',
  'Diagnóstico Computarizado',
  'Hojalatería',
  'Motor y Transmisión',
  'Electricidad Automotriz',
  'Alineación y Balanceo',
  'Pintura y Carrocería',
  'Motores Diesel'
]

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  shopName: '',
  location: '',
  experience: '',
  priceRange: '',
  certifications: '',
  description: ''
})

const emit = defineEmits(['switch-view', 'register-user'])

const toggleSpecialty = (specialty) => {
  const index = selectedSpecialties.value.indexOf(specialty)
  if (index > -1) {
    selectedSpecialties.value.splice(index, 1)
  } else {
    selectedSpecialties.value.push(specialty)
  }
}

const handleSubmit = () => {
  if (role.value === 'mecanico') {
    const specialtyList = selectedSpecialties.value.length
      ? selectedSpecialties.value
      : ['Mantenimiento General']

    emit('register-user', {
      fullName: formData.value.fullName,
      rating: 4.7,
      reviews: 0,
      distance: 1.8,
      priceRange: formData.value.priceRange || '$$',
      experience: formData.value.experience || '1',
      specialties: specialtyList,
      location: formData.value.location || 'CDMX',
      availability: 'Disponible hoy'
    })
  }

  showSuccessModal.value = true
}

const closeModal = () => {
  showSuccessModal.value = false
  emit('switch-view', 'login')
}

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

/* Estilos para el modal de éxito */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 8, 23, 0.45);
  z-index: 60;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: 16px;
  max-width: 640px;
  width: 92%;
  text-align: center;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(2, 136, 209, 0.08);
}

.success-icon {
  font-size: 2.4rem;
  color: #2db94a;
  margin-bottom: 8px;
}

.modal-button {
  margin-top: 18px;
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  background: #0288d1;
  color: #fff;
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
