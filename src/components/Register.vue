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
            <span> <b>Nombre Completo *</b></span>
            <input type="text" v-model="formData.fullName" placeholder="Carlos Rodríguez" />
          </label>
        </div>

        <div class="field-grid two-columns">
          <label>
            <span><b>Correo Electrónico *</b></span>
            <input type="email" v-model="formData.email" placeholder="carlos@example.com" />
          </label>

          <label>
            <span><b>Teléfono *</b></span>
            <input type="tel" v-model="formData.phone" placeholder="+52 55 1234 5678" />
          </label>
        </div>

        <label>
          <span><b>Contraseña *</b></span>
          <input type="password" v-model="formData.password" placeholder="********" />
        </label>

        <div v-if="role === 'mecanico'" class="mecanico-section">
          <div class="info-box">
            <strong>Registro de Mecánico Profesional</strong>
            <p>Completa toda la información para activar tu perfil.</p>
          </div>

          <div class="field-grid three-columns">
            <label>
              <span><b>Edad *</b></span>
              <input type="number" v-model.number="formData.edad" placeholder="Ej: 30" min="18" />
            </label>

            <label>
              <span><b>Años de Experiencia *</b></span>
              <input type="number" v-model.number="formData.experience" placeholder="10" min="0" />
            </label>

            <label>
              <span><b>Estado *</b></span>
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
                    @click="seleccionarAvatar(avatar)"
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

          <label class="certificaciones-title">
            <span> <b>Certificaciones en PDF * (Opcional, máximo 3) </b></span>
          </label>

          <div class="field-grid three-columns">
            <div class="cert-item">
              <span><b>Certificado 1</b></span>
              <label class="pdf-upload">
                <span>Subir PDF</span>
                <input type="file" accept=".pdf" @change="(e) => handleFileUpload(e, 1)" />
              </label>
            </div>

            <div class="cert-item">
              <span><b>Certificado 2</b></span>
              <label class="pdf-upload">
                <span>Subir PDF</span>
                <input type="file" accept=".pdf" @change="(e) => handleFileUpload(e, 2)" />
              </label>
            </div>

            <div class="cert-item">
              <span><b>Certificado 3</b></span>
              <label class="pdf-upload">
                <span>Subir PDF</span>
                <input type="file" accept=".pdf" @change="(e) => handleFileUpload(e, 3)" />
              </label>
            </div>
          </div>

          <label>
            <span><b>Descripción del Servicio *</b></span>
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
import { useRouter } from 'vue-router'

const router = useRouter()

const role = ref('mecanico')
const showSuccessModal = ref(false)
const photoPreview = ref(null)

const avatars = ['👨‍🔧', '👩‍🔧', '🔧', '⚙️', '🛠️', '⚡']

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  edad: '',
  experience: '',
  estado: '',
  fotoPerfil: '👨‍🔧',
  fotoPerfilArchivo: null, // Agregamos una variable para el archivo real
  certificado1: null,
  certificado2: null,
  certificado3: null,
  descripcionServicio: ''
})

const handlePhotoUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    formData.value.fotoPerfilArchivo = file // Guardamos el archivo
    formData.value.fotoPerfil = '' // Borramos el emoji para darle prioridad a la foto
    
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const seleccionarAvatar = (avatar) => {
  formData.value.fotoPerfil = avatar
  removePhoto() // Si eligen un emoji, borramos la foto que hayan subido
}

const removePhoto = () => {
  photoPreview.value = null
  formData.value.fotoPerfilArchivo = null
  if (!formData.value.fotoPerfil) {
    formData.value.fotoPerfil = '👨‍🔧' // Regresamos al emoji por defecto si no hay nada
  }
}

const handleFileUpload = (event, num) => {
  const file = event.target.files?.[0]
  if (file) {
    formData.value[`certificado${num}`] = file
  }
}

const handleSubmit = async () => {
  if (!formData.value.fullName || !formData.value.email || !formData.value.password || !formData.value.phone) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  if (role.value === 'mecanico') {
    if (!formData.value.edad || !formData.value.experience || !formData.value.estado || !formData.value.descripcionServicio) {
      alert('Por favor completa todos los campos de mecánico')
      return
    }
  }

  try {
    const payload = new FormData()
    
    payload.append('role', role.value)
    payload.append('fullName', formData.value.fullName)
    payload.append('email', formData.value.email)
    payload.append('phone', formData.value.phone)
    payload.append('password', formData.value.password)
    
    if (role.value === 'mecanico') {
      payload.append('edad', formData.value.edad)
      payload.append('experience', formData.value.experience)
      payload.append('estado', formData.value.estado)
      payload.append('descripcionServicio', formData.value.descripcionServicio)
      
      // Enviamos el emoji o el archivo de foto dependiendo de lo que haya elegido
      payload.append('fotoPerfil', formData.value.fotoPerfil)
      if (formData.value.fotoPerfilArchivo) {
        payload.append('fotoPerfilArchivo', formData.value.fotoPerfilArchivo)
      }
      
      if (formData.value.certificado1) payload.append('certificado1', formData.value.certificado1)
      if (formData.value.certificado2) payload.append('certificado2', formData.value.certificado2)
      if (formData.value.certificado3) payload.append('certificado3', formData.value.certificado3)
    }

    const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const API_URL = esLocal 
      ? 'http://localhost:8080/Joss/api/registro_usuario.php' 
      : 'https://mecanicweb.free.nf/api/registro_usuario.php'

    const respuesta = await fetch(API_URL, {
      method: 'POST',
      body: payload
    })

    const resultado = await respuesta.json()

    if (resultado.status === 'success') {
      showSuccessModal.value = true
      
      Object.keys(formData.value).forEach(key => {
        if(key === 'fotoPerfil') formData.value[key] = '👨‍🔧'
        else if (key.startsWith('certificado') || key === 'fotoPerfilArchivo') formData.value[key] = null
        else formData.value[key] = ''
      })
      photoPreview.value = null
      
    } else {
      alert("Error: " + resultado.message)
    }

  } catch (error) {
    console.error('Error de conexión:', error)
    alert('Hubo un problema al conectar con el servidor')
  }
}

const closeModal = () => {
  showSuccessModal.value = false
  router.push('/login')
}

const goToLogin = () => router.push('/login')
</script>

<style scoped src="../styles/components/Register.css"></style>
