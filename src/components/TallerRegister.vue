<template>
  <div class="taller-register-container">
    <div class="register-card">
      <!-- Header -->
      <div class="header-section">
        <h1 class="main-title">Da de alta tu taller</h1>
        <p class="subtitle-text">Completa el formulario para que tu taller pueda ser visible</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="register-form">
        <div class="form-section">
          <h2 class="section-title">Registro de Taller Mecánico Profesional</h2>
          <p class="section-description">
            Para garantizar la calidad del servicio, necesitamos información adicional. Tu perfil será verificado antes de ser publicado.
          </p>

          <!-- Nombre del Taller -->
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

          <!-- Teléfono del Taller -->
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

          <!-- Email/Correo -->
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
          </div>

          <!-- Ubicación del Taller -->
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

          <!-- Código Postal -->
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
          </div>

          <!-- HORARIOS DEL TALLER LITERAL POR DÍA (NUEVO) -->
          <div class="form-group">
            <label class="label-required">Horarios por día * (Activa los días que laboras)</label>
            <div class="weekly-schedule-container">
              
              <div 
                v-for="dayObj in form.weeklySchedule" 
                :key="dayObj.day" 
                class="day-schedule-row"
                :class="{ 'day-active': dayObj.isOpen }"
              >
                <!-- Checkbox del Día -->
                <div class="day-label-checkbox">
                  <input 
                    type="checkbox" 
                    :id="'day-' + dayObj.day" 
                    v-model="dayObj.isOpen" 
                  />
                  <label :for="'day-' + dayObj.day">{{ dayObj.day }}</label>
                </div>

                <!-- Inputs de Horas (Solo se muestran / requieren si el día está activo) -->
                <div v-if="dayObj.isOpen" class="day-hours-inputs transition-fade">
                  <input 
                    type="time" 
                    v-model="dayObj.startTime" 
                    class="time-picker" 
                    required 
                  />
                  <span class="time-separator">a</span>
                  <input 
                    type="time" 
                    v-model="dayObj.endTime" 
                    class="time-picker" 
                    required 
                  />
                </div>

                <!-- Mensaje de Cerrado si no está seleccionado -->
                <div v-else class="day-closed-label">
                  <span>Cerrado</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Foto Ubicación -->
          <div class="form-group">
            <label for="locationPhoto" class="label-required">Adjunta una foto de la ubicación del taller*</label>
            <div class="input-wrapper">
              <span class="input-icon">📷</span>
              <input
                type="file"
                id="locationPhoto"
                accept="image/*"
                class="input-field"
                @change="handleFileUpload"
                required
              />
            </div>
          </div>

          <!-- Especialidades -->
          <div class="form-group">
            <label class="label-required">Especialidades *</label>
            <div class="specialties-grid">
              <div class="specialty-item">
                <input type="checkbox" id="spec1" v-model="form.specialties" value="Mantenimiento General" />
                <label for="spec1">Mantenimiento General</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec2" v-model="form.specialties" value="Motor y Transmisión" />
                <label for="spec2">Motor y Transmisión</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec3" v-model="form.specialties" value="Frenos y Suspensión" />
                <label for="spec3">Frenos y Suspensión</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec4" v-model="form.specialties" value="Electricidad Automotriz" />
                <label for="spec4">Electricidad Automotriz</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec5" v-model="form.specialties" value="Aire Acondicionado" />
                <label for="spec5">Aire Acondicionado</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec6" v-model="form.specialties" value="Alineación y Balanceo" />
                <label for="spec6">Alineación y Balanceo</label>
              </div>
              
              <!-- Casilla interactiva "Otro" -->
              <div class="specialty-item">
                <input type="checkbox" id="specOther" v-model="showOtherInput" />
                <label for="specOther" style="font-weight: bold; color: #0097c7;">Otro...</label>
              </div>
            </div>

            <!-- Escribir otra especialidad -->
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
          </div>

          <!-- Important Note -->
          <div class="note-section">
            <p class="note-title">Nota:</p>
            <p class="note-text">
              Tu perfil será revisado por nuestro equipo en un plazo de 24-48 horas. Recibirás un correo cuando tu cuenta sea verificada y activada.
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-button">
            Enviar solicitud de alta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showOtherInput = ref(false);

const form = ref({
  shopName: '',
  shopPhone: '',
  shopEmail: '',
  shopLocation: '',
  postalCode: '',
  // Array estructurado para almacenar de forma independiente el horario de cada día
  weeklySchedule: [
    { day: 'Lunes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Martes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Miércoles', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Jueves', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Viernes', isOpen: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Sábado', isOpen: true, startTime: '08:00', endTime: '14:00' }, // Por defecto medio día el sábado
    { day: 'Domingo', isOpen: false, startTime: '09:00', endTime: '14:00' } // Por defecto cerrado el domingo
  ],
  locationPhotoFile: null,
  specialties: [],
  otherSpecialty: ''
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.locationPhotoFile = file;
  }
};

const submitForm = () => {
  // 1. Filtrar solo los días en los que el taller abre y mapear su horario
  const activeSchedules = form.value.weeklySchedule
    .filter(d => d.isOpen)
    .map(d => `${d.day}: ${d.startTime} a ${d.endTime}`);

  // 2. Unificar especialidades
  let finalSpecialties = [...form.value.specialties];
  if (showOtherInput.value && form.value.otherSpecialty.trim()) {
    finalSpecialties.push(form.value.otherSpecialty.trim());
  }

  // Payload final listo para mandar al servidor
  const payload = {
    shopName: form.value.shopName,
    shopPhone: form.value.shopPhone,
    shopEmail: form.value.shopEmail,
    shopLocation: `${form.value.shopLocation}, CP: ${form.value.postalCode}`,
    scheduleList: activeSchedules, // Devuelve un Array del tipo ["Lunes: 07:00 a 22:00", "Martes: 06:00 a 21:00"]
    specialties: finalSpecialties,
    photo: form.value.locationPhotoFile
  };

  console.log('Datos procesados para enviar:', payload);
  alert('Formulario de taller enviado correctamente con horarios personalizados.');
};
</script>

<style scoped>
.taller-register-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 24px;
  background: #f8fbff;
}

.register-card {
  width: 100%;
  max-width: 440px; /* Expandido ligeramente para dar mejor espacio horizontal a las horas */
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.header-section {
  text-align: center;
  margin-bottom: 15px;
}

.main-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.subtitle-text {
  font-size: 11px;
  color: #777;
  margin: 6px 0 12px;
}

.form-section {
  border: 1px solid #bce6f2;
  border-radius: 6px;
  padding: 12px;
}

.section-title {
  color: #0097c7;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
}

.section-description {
  background: #e8f7ff;
  border: 1px solid #bce6f2;
  border-radius: 4px;
  padding: 8px;
  font-size: 11px;
  color: #4f87a0;
  line-height: 1.4;
  margin-bottom: 12px;
}

.form-group {
  margin-bottom: 14px;
}

.label-required {
  display: block;
  font-size: 11px;
  color: #444;
  margin-bottom: 4px;
  font-weight: 600;
}

.sub-label {
  display: block;
  font-size: 10px;
  color: #666;
  margin-bottom: 2px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 8px;
}

.input-icon {
  margin-right: 6px;
  font-size: 12px;
}

.input-field {
  width: 100%;
  height: 34px;
  border: none;
  background: transparent;
  font-size: 12px;
}

.input-field:focus {
  outline: none;
}

input[type="file"].input-field {
  padding-top: 6px;
  font-size: 11px;
}

.input-field-no-icon {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  font-size: 12px;
}

/* ESTILOS DE LA SECCIÓN DE HORARIOS SEMANALES */
.weekly-schedule-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-schedule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #eaeaea;
}

.day-schedule-row:last-child {
  border-bottom: none;
}

.day-label-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 90px;
}

.day-label-checkbox input[type="checkbox"] {
  accent-color: #0097c7;
  width: 13px;
  height: 13px;
  cursor: pointer;
}

.day-label-checkbox label {
  font-size: 11px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
}

.day-hours-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-picker {
  height: 26px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
  background: #fff;
  outline: none;
}

.time-picker:focus {
  border-color: #0097c7;
}

.time-separator {
  font-size: 11px;
  color: #777;
}

.day-closed-label {
  font-size: 10px;
  color: #999;
  font-style: italic;
  padding-right: 10px;
}

/* Modificador cuando el día está activo */
.day-active .day-label-checkbox label {
  color: #0097c7;
  font-weight: 700;
}

/* Rejilla Especialidades */
.specialties-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.specialty-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.specialty-item input {
  width: 12px;
  height: 12px;
  accent-color: #0097c7;
}

.specialty-item label {
  font-size: 10px;
  color: #444;
  cursor: pointer;
}

.other-specialty-wrapper {
  margin-top: 8px;
  padding: 8px;
  border-left: 3px solid #0097c7;
  background: #f4fcff;
}

.note-section {
  background: #fff8e8;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 10px;
  margin-top: 12px;
}

.note-title {
  color: #f39c12;
  font-size: 11px;
  font-weight: 700;
  margin: 0 0 4px;
}

.note-text {
  color: #c07a00;
  font-size: 10px;
  line-height: 1.4;
  margin: 0;
}

.submit-button {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 5px;
  background: #0097c7;
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
}

.submit-button:hover {
  background: #007fab;
}

/* Transiciones */
.transition-fade {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(5px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 600px) {
  .register-card {
    max-width: 100%;
  }
}
</style>