<template>
  <div class="taller-register-container">
    <div class="register-card">
      <!-- Header -->
      <div class="header-section">
        <h1 class="main-title">Da de alta tu taller</h1>
        <p class="subtitle-text">Completa el formulario para que tu taller pueda se visible</p>
        <div class="icons-section">
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="register-form">
        <!-- Professional Shop Registration Section -->
        <div class="form-section">
          <h2 class="section-title">Registro de Taller Mecánico Profesional</h2>
          <p class="section-description">
            Para garantizar la calidad del servicio, necesitamos información adicional. Tu perfil será verificado antes de ser publicado.
          </p>

          <!-- Nombre Completo -->
          <div class="form-group">
            <label for="fullName" class="label-required">Nombre Completo *</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.fullName"
                type="text"
                id="fullName"
                placeholder="Carlos Rodriguez"
                class="input-field"
                required
              />
            </div>
          </div>

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

          <!-- Ubicación del Taller -->
          <div class="form-group">
            <label for="shopLocation" class="label-required">Ubicación del Taller *</label>
            <div class="input-wrapper">
              <span class="input-icon"></span>
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

          <!-- Horarios del Taller -->
          <div class="form-group">
            <label class="label-required">Horarios del taller</label>
            <div class="input-wrapper">
              <span class="input-icon">🕐</span>
              <input
                type="text"
                placeholder="Foto"
                class="input-field"
                disabled
              />
            </div>
          </div>

          <!-- Foto Ubicación -->
          <div class="form-group">
            <label for="locationPhoto" class="label-required">Adjunta una foto de la ubicación del taller*</label>
            <div class="input-wrapper">
              <span class="input-icon">📷</span>
              <input
                type="text"
                placeholder="Foto"
                class="input-field"
                disabled
              />
            </div>
          </div>

          <!-- Clases -->
          <div class="form-group">
            <label for="classes" class="label-text">Clases</label>
            <input
              v-model="form.classes"
              type="text"
              id="classes"
              placeholder="Días preferentes para citas"
              class="input-field-no-icon"
            />
          </div>

          <!-- Especialidades -->
          <div class="form-group">
            <label class="label-required">Especialidades * (Selecciona al menos 3)</label>
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
              <div class="specialty-item">
                <input type="checkbox" id="spec7" v-model="form.specialties" value="Diagnóstico Computarizado" />
                <label for="spec7">Diagnóstico Computarizado</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec8" v-model="form.specialties" value="Pintura y Carrocería" />
                <label for="spec8">Pintura y Carrocería</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec9" v-model="form.specialties" value="Hojalatería" />
                <label for="spec9">Hojalatería</label>
              </div>
              <div class="specialty-item">
                <input type="checkbox" id="spec10" v-model="form.specialties" value="Motores Diesel" />
                <label for="spec10">Motores Diesel</label>
              </div>
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
            Hacer envío solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  fullName: '',
  shopName: '',
  shopLocation: '',
  classes: '',
  specialties: []
});

const submitForm = () => {
  alert('Formulario enviado');
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
  max-width: 380px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
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

.icons-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 14px;
}

.shop-badge {
  background: linear-gradient(to right, #d5d5d5, #bcbcbc);
  color: #555;
  padding: 5px 18px;
  border-radius: 15px;
  font-size: 11px;
}

.form-section {
  border: 1px solid #bce6f2;
  border-radius: 6px;
  padding: 10px;
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
  margin-bottom: 10px;
}

.label-required,
.label-text {
  display: block;
  font-size: 11px;
  color: #444;
  margin-bottom: 4px;
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

.input-field-no-icon {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  font-size: 12px;
}

.input-field-no-icon:focus {
  outline: none;
}

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
}

.note-section {
  background: #fff8e8;
  border: 1px solid #ffffff;
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

@media (max-width: 600px) {
  .register-card {
    max-width: 100%;
  }

  }

</style>
