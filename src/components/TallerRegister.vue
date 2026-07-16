<template>
  <div class="taller-register-container">
    <div class="register-card">
      <div class="header-section">
        <h1 class="main-title">Da de alta tu taller</h1>
        <p class="subtitle-text">Completa el formulario para que tu taller pueda ser visible</p>
      </div>

      <form class="register-form" @submit.prevent="submitForm">
        <div class="form-section">
          <h2 class="section-title">Registro de Taller Mecánico Profesional</h2>
          <p class="section-description">
            Para garantizar la calidad del servicio, necesitamos información adicional. Tu perfil será verificado antes de ser publicado.
          </p>

          <div v-if="paso === 1">
            <div class="form-group">
              <label for="shopName" class="label-required">Nombre del Taller *</label>
              <div class="input-wrapper">
                <span class="input-icon">🔧</span>
                <input
                  v-model="form.shopName"
                  type="text"
                  id="shopName"
                  placeholder="Taller Mecánico Rodriguez"
                  class="input-field"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="shopPhone" class="label-required">Teléfono de contacto *</label>
              <div class="input-wrapper">
                <span class="input-icon">📞</span>
                <input
                  v-model="form.shopPhone"
                  type="tel"
                  id="shopPhone"
                  placeholder="Ej: 9841234567"
                  class="input-field"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="shopEmail" class="label-required">Correo Electrónico *</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input
                  v-model="form.shopEmail"
                  type="email"
                  id="shopEmail"
                  placeholder="taller@ejemplo.com"
                  class="input-field"
                  required
                />
              </div>

              <button type="button" class="first-next-btn" @click="siguientePaso">
                Siguiente
              </button>
            </div>
          </div>

          <div v-if="paso === 2">
            <div class="form-group">
              <label for="shopLocation" class="label-required">Dirección del Taller *</label>
              <div class="input-wrapper">
                <span class="input-icon">📍</span>
                <input
                  v-model="form.shopLocation"
                  type="text"
                  id="shopLocation"
                  placeholder="Calle, Colonia, Ciudad"
                  class="input-field"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="postalCode" class="label-required">Código Postal *</label>
              <div class="input-wrapper">
                <span class="input-icon">📮</span>
                <input
                  v-model="form.postalCode"
                  type="text"
                  id="postalCode"
                  placeholder="Ej: 77710"
                  class="input-field"
                  required
                />
              </div>

              <div class="map-placeholder">
                <div class="fake-map">Aquí irá el mapa con geolocalización</div>
              </div>

              <div class="step-buttons">
                <button type="button" class="prev-step-btn" @click="anteriorPaso">
                  ← Anterior
                </button>

                <button type="button" class="next-step-btn" @click="siguientePaso">
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <div v-if="paso === 3">
            <div class="form-group">
              <label class="label-required">Horarios por día * (Activa los días que laboras)</label>
              <div class="weekly-schedule-container">
                <div
                  v-for="dayObj in form.weeklySchedule"
                  :key="dayObj.day"
                  class="day-schedule-row"
                  :class="{ 'day-active': dayObj.isOpen }"
                >
                  <div class="day-label-checkbox">
                    <input
                      :id="'day-' + dayObj.day"
                      v-model="dayObj.isOpen"
                      type="checkbox"
                    />
                    <label :for="'day-' + dayObj.day">{{ dayObj.day }}</label>
                  </div>

                  <div v-if="dayObj.isOpen" class="day-hours-inputs transition-fade">
                    <input v-model="dayObj.startTime" type="time" class="time-picker" required />
                    <span class="time-separator">a</span>
                    <input v-model="dayObj.endTime" type="time" class="time-picker" required />
                  </div>

                  <div v-else class="day-closed-label">
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="locationPhoto" class="label-required">Adjunta una foto de la ubicación del taller*</label>
              <div class="input-wrapper">
                <span class="input-icon">📷</span>
                <input
                  id="locationPhoto"
                  type="file"
                  accept="image/*"
                  class="input-field"
                  required
                  @change="handleFileUpload"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="label-required">Especialidades *</label>
              <div class="specialties-grid">
                <div class="specialty-item">
                  <input id="spec1" v-model="form.specialties" type="checkbox" value="Mantenimiento General" />
                  <label for="spec1">Mantenimiento General</label>
                </div>
                <div class="specialty-item">
                  <input id="spec2" v-model="form.specialties" type="checkbox" value="Motor y Transmisión" />
                  <label for="spec2">Motor y Transmisión</label>
                </div>
                <div class="specialty-item">
                  <input id="spec3" v-model="form.specialties" type="checkbox" value="Frenos y Suspensión" />
                  <label for="spec3">Frenos y Suspensión</label>
                </div>
                <div class="specialty-item">
                  <input id="spec4" v-model="form.specialties" type="checkbox" value="Electricidad Automotriz" />
                  <label for="spec4">Electricidad Automotriz</label>
                </div>
                <div class="specialty-item">
                  <input id="spec5" v-model="form.specialties" type="checkbox" value="Aire Acondicionado" />
                  <label for="spec5">Aire Acondicionado</label>
                </div>
                <div class="specialty-item">
                  <input id="spec6" v-model="form.specialties" type="checkbox" value="Alineación y Balanceo" />
                  <label for="spec6">Alineación y Balanceo</label>
                </div>
                <div class="specialty-item">
                  <input id="specOther" v-model="showOtherInput" type="checkbox" />
                  <label for="specOther" style="font-weight: bold; color: #0097c7;">Otro...</label>
                </div>
              </div>

              <div v-if="showOtherInput" class="other-specialty-wrapper transition-fade">
                <label for="otherSpecText" class="sub-label">Escribe tu otra especialidad:</label>
                <input
                  id="otherSpecText"
                  v-model="form.otherSpecialty"
                  type="text"
                  placeholder="Ej: Pintura wrapping, Cerrajería"
                  class="input-field-no-icon"
                  required
                />
              </div>

              <div class="step-buttons">
                <button type="button" class="prev-step-btn" @click="anteriorPaso">
                  ← Anterior
                </button>
              </div>
            </div>

            <div class="note-section">
              <p class="note-title">Nota:</p>
              <p class="note-text">
                Tu perfil será revisado por nuestro equipo en un plazo de 24-48 horas. Recibirás un correo cuando tu cuenta sea verificada y activada.
              </p>
            </div>

            <button type="submit" class="submit-button">Enviar solicitud de alta</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showOtherInput = ref(false)
const paso = ref(1)

const siguientePaso = () => {
  if (paso.value < 3) paso.value++
}

const anteriorPaso = () => {
  if (paso.value > 1) paso.value--
}

const form = ref({
  shopName: '',
  shopPhone: '',
  shopEmail: '',
  shopLocation: '',
  postalCode: '',
  weeklySchedule: [
    { day: 'Lunes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Martes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Miércoles', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Jueves', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Viernes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Sábado', isOpen: true, startTime: '08:00', endTime: '14:00' },
    { day: 'Domingo', isOpen: false, startTime: '09:00', endTime: '14:00' }
  ],
  locationPhotoFile: null,
  specialties: [],
  otherSpecialty: ''
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.locationPhotoFile = file
  }
}

const submitForm = () => {
  const activeSchedules = form.value.weeklySchedule
    .filter((d) => d.isOpen)
    .map((d) => `${d.day}: ${d.startTime} a ${d.endTime}`)

  const finalSpecialties = [...form.value.specialties]
  if (showOtherInput.value && form.value.otherSpecialty.trim()) {
    finalSpecialties.push(form.value.otherSpecialty.trim())
  }

  const payload = {
    shopName: form.value.shopName,
    shopPhone: form.value.shopPhone,
    shopEmail: form.value.shopEmail,
    shopLocation: `${form.value.shopLocation}, CP: ${form.value.postalCode}`,
    scheduleList: activeSchedules,
    specialties: finalSpecialties,
    photo: form.value.locationPhotoFile
  }

  console.log('Datos procesados para enviar:', payload)
  alert('Formulario de taller enviado correctamente con horarios personalizados.')
}
</script>

<style scoped src="../styles/components/TallerRegister.css"></style>
