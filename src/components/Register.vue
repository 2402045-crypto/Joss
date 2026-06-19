<template>
  <div class="register-page">
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
        </div>

        <div class="field-grid two-columns">
          <label>
            <span>Correo Electrónico *</span>
            <input type="email" v-model="formData.email" placeholder="carlos@example.com" />
          </label>

          <label>
            <span>Teléfono *</span>
            <input type="tel" v-model="formData.phone" placeholder="+52 55 1234 5678" />
          </label>
        </div>

        <label>
          <span>Contraseña *</span>
          <input type="password" v-model="formData.password" placeholder="********" />
        </label>

        <div v-if="role === 'mecanico'" class="mecanico-section">
          <div class="info-box">
            <strong>Registro de Mecánico Profesional</strong>
            <p>Completa toda la información para activar tu perfil.</p>
          </div>

          <div class="field-grid two-columns">
            <label>
              <span>Años de Experiencia *</span>
              <input type="number" v-model.number="formData.experience" placeholder="10" min="0" />
            </label>

            <label>
              <span>Estado *</span>
              <select v-model="formData.estado">
                <option value="">Selecciona tu estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente de Verificación</option>
              </select>
            </label>
          </div>

          <div class="profile-photo-section">
            <span class="section-label">Foto de Perfil *</span>
            <div class="photo-options">
              <div class="upload-option">
                <label class="upload-input">
                  <span>📷 Subir Foto</span>
                  <input type="file" @change="handlePhotoUpload" accept="image/*" />
                </label>
              </div>
              <div class="avatar-option">
                <span>ó elige un avatar:</span>
                <div class="avatar-grid">
                  <button 
                    v-for="avatar in avatars" 
                    :key="avatar"
                    type="button"
                    :class="['avatar-btn', formData.fotoPerfil === avatar ? 'selected' : '']"
                    @click="formData.fotoPerfil = avatar"
                  >
                    {{ avatar }}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="photoPreview" class="photo-preview">
              <img :src="photoPreview" alt="Vista previa">
              <button type="button" @click="removePhoto" class="remove-btn">✕</button>
            </div>
          </div>

          <label>
            <span>Certificaciones * (Opcional)</span>
          </label>

          <div class="field-grid three-columns">
            <label>
              <span>Certificado 1</span>
              <input type="text" v-model="formData.certificado1" placeholder="Ej: Certificado ASE" />
            </label>

            <label>
              <span>Certificado 2</span>
              <input type="text" v-model="formData.certificado2" placeholder="Ej: Curso de inyección" />
            </label>

            <label>
              <span>Certificado 3</span>
              <input type="text" v-model="formData.certificado3" placeholder="Ej: Diagnóstico electrónico" />
            </label>
          </div>

          <label>
            <span>Descripción del Servicio *</span>
            <textarea v-model="formData.descripcionServicio" placeholder="Describe brevemente tu experiencia y los servicios que ofreces..."></textarea>
          </label>

          <div class="note-box">
            <strong>Nota:</strong>
            <p>Tu perfil será revisado por nuestro equipo en un plazo de 24-48 horas. Recibirás un correo cuando tu cuenta sea verificada y activada.</p>
          </div>
        </div>

        <button type="submit" class="primary-button">{{ role === 'usuario' ? 'Crear Cuenta' : 'Enviar Solicitud' }}</button>
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
const photoPreview = ref(null)

const avatars = ['👨‍🔧', '👩‍🔧', '🔧', '⚙️', '🛠️', '⚡']

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  experience: '',
  estado: '',
  fotoPerfil: '👨‍🔧',
  certificaciones: '',
  descripcionServicio: ''
})

const emit = defineEmits(['switch-view'])

const handlePhotoUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  photoPreview.value = null
}

const handleSubmit = async () => {
  // Validación básica
  if (!formData.value.fullName || !formData.value.email || !formData.value.password || !formData.value.phone) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  if (role.value === 'mecanico') {
    if (!formData.value.experience || !formData.value.estado || !formData.value.certificaciones || !formData.value.descripcionServicio) {
      alert('Por favor completa todos los campos de mecánico')
      return
    }
  }

  try {
    // 1. Preparamos el paquete de datos
    const payload = {
      ...formData.value,
      role: role.value // 'usuario' o 'mecanico'
    }

    // 2. Enviamos los datos al PHP usando Fetch
    const respuesta = await fetch('http://localhost:8080/Joss/api/registro_usuario.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const resultado = await respuesta.json()

    // 3. Revisamos la respuesta de la base de datos
    if (resultado.status === 'success') {
      // Si salió bien, mostramos el modal de éxito
      showSuccessModal.value = true
      
      // Limpiamos el formulario para que quede en blanco
      Object.keys(formData.value).forEach(key => {
        if(key === 'fotoPerfil') formData.value[key] = '👨‍🔧'
        else formData.value[key] = ''
      })
      photoPreview.value = null
      
    } else {
      // Si la base de datos rebotó algo (ej. el correo ya existe), mostramos el error
      alert("Error: " + resultado.message)
    }

  } catch (error) {
    console.error('Error de conexión:', error)
    alert('Hubo un problema al conectar con el servidor')
  }
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
.register-form textarea,
.register-form select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  background: #f8fbff;
  color: #102a43;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
  ;
}

.register-form input:focus,
.register-form textarea:focus,
.register-form select:focus {
  outline: none;
  border-color: #0288d1;
  background: #ffffff;
  box-shadow: 0 0 0 4px 3px rgba(2, 136, 209, 0.12);
}

.register-form textarea {
  min-height: 120px;
  height: 120px;
  resize: vertical;
  line-height: 1.5;
}

register-form textarea::placeholder {
  color: #627d98;
  opacity: 1;
}

.mecanico-section {
  display: grid;
  gap: 18px;
}

.profile-photo-section {
  display: grid;
  gap: 12px;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #334e68;
  font-size: 0.95rem;
}

.photo-options {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px dashed #d9e2ec;
  border-radius: 14px;
  background: #fbfcff;
}

.upload-option {
  display: flex;
  align-items: center;
}

.upload-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #0288d1;
  transition: all 0.3s ease;
}

.upload-input:hover {
  background: #f0f8ff;
  border-color: #0288d1;
}

.upload-input input[type="file"] {
  display: none;
}

.avatar-option {
  display: grid;
  gap: 10px;
}

.avatar-option > span {
  font-size: 0.9rem;
  color: #627d98;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.avatar-btn {
  padding: 14px 8px;
  border: 2px solid #d9e2ec;
  border-radius: 12px;
  background: white;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-btn:hover {
  border-color: #0288d1;
  background: #f0f8ff;
  transform: scale(1.05);
}

.avatar-btn.selected {
  border-color: #0288d1;
  background: #e8f6ff;
  box-shadow: 0 4px 12px rgba(2, 136, 209, 0.2);
}

.photo-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #0288d1;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #d32f2f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #b71c1c;
  transform: scale(1.1);
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
  transition: all 0.3s ease;
}

.primary-button:hover {
  background: #0277bd;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(2, 136, 209, 0.3);
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
  transition: all 0.3s ease;
}

.modal-button:hover {
  background: #0277bd;
}

footer {
  margin-top: 18px;
  text-align: center;
}

.text-link {
  background: none;
  border: none;
  color: #0288d1;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: inherit;
  transition: color 0.3s ease;
}

.text-link:hover {
  color: #0277bd;
  text-decoration: underline;
}
</style>