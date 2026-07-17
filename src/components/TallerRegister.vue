<template>
  <div class="taller-register-container">
    <div class="register-card" :class="{ 'register-card--wide': paso === 2 }">
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

          <!-- PASO 1 -->
          <div v-if="paso === 1" class="vertical-step-shell">
            <div class="vertical-step-panel">
              <div class="form-group">
                <label for="shopName" class="label-required">Nombre del Taller *</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔧</span>
                  <input v-model="form.shopName" type="text" id="shopName" placeholder="Taller Mecánico Rodriguez" class="input-field" required />
                </div>
              </div>

              <div class="form-group">
                <label for="shopPhone" class="label-required">Teléfono de contacto *</label>
                <div class="input-wrapper">
                  <span class="input-icon">📞</span>
                  <input v-model="form.shopPhone" type="tel" id="shopPhone" placeholder="Ej: 9841234567" class="input-field" required />
                </div>
              </div>

              <div class="form-group">
                <label for="shopEmail" class="label-required">Correo Electrónico *</label>
                <div class="input-wrapper">
                  <span class="input-icon">✉️</span>
                  <input v-model="form.shopEmail" type="email" id="shopEmail" placeholder="taller@ejemplo.com" class="input-field" required />
                </div>

                <button type="button" class="first-next-btn" @click="siguientePaso">
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <!-- PASO 2 -->
          <div v-if="paso === 2">
            <div class="step-two-layout">
              <div class="step-two-form-column">
                <div class="form-group">
                  <label for="shopLocation" class="label-required">Dirección del Taller *</label>
                  <div class="input-wrapper">
                    <span class="input-icon">📍</span>
                    <input v-model="form.shopLocation" type="text" id="shopLocation" placeholder="Calle, Colonia, Ciudad" class="input-field" required />
                  </div>
                </div>

                <div class="form-group compact-gap">
                  <label for="postalCode" class="label-required">Código Postal *</label>
                  <div class="input-wrapper">
                    <span class="input-icon">📮</span>
                    <input v-model="form.postalCode" type="text" id="postalCode" placeholder="Ej: 77710" class="input-field" required />
                  </div>
                </div>

                <div class="location-help-card">
                  <p class="location-help-title">Cómo fijar tu ubicación</p>
                  <p class="location-help-text">Busca la dirección, usa tu ubicación actual o mueve el pin hasta el punto exacto de tu taller.</p>
                </div>

                <div class="coords-grid coords-grid-sidebar">
                  <div><span>Latitud</span><strong>{{ coords.lat ?? '-' }}</strong></div>
                  <div><span>Longitud</span><strong>{{ coords.lng ?? '-' }}</strong></div>
                </div>

                <p v-if="direccion" class="map-address sidebar-address">
                  <strong>Dirección detectada:</strong> {{ direccion }}
                </p>
                <p v-if="errorMsg" class="map-error">{{ errorMsg }}</p>
              </div>

              <div class="step-two-map-column">
                <div class="map-card horizontal-map-card">
                  <div class="map-card-header">
                    <div>
                      <p class="map-card-kicker">Ubicación del taller</p>
                      <h3>Marca el punto exacto</h3>
                    </div>
                    <button type="button" class="geo-btn" @click="usarMiUbicacion" :disabled="loadingGeo">
                      {{ loadingGeo ? 'Buscando...' : 'Usar mi ubicación' }}
                    </button>
                  </div>

                  <div class="map-search-row">
                    <span class="map-search-icon">🔎</span>
                    <input ref="inputBusquedaRef" v-model="searchText" type="text" class="map-search-input" placeholder="Buscar dirección o lugar" @keydown.enter.prevent="buscarDireccionEscrita" />
                  </div>
                  <div ref="mapRef" class="mini-map horizontal-mini-map"></div>
                </div>
              </div>
            </div>

            <div class="step-buttons step-two-buttons">
              <button type="button" class="prev-step-btn" @click="anteriorPaso">← Anterior</button>
              <button type="button" class="next-step-btn" @click="siguientePaso">Siguiente →</button>
            </div>
          </div>

          <!-- PASO 3 -->
          <div v-if="paso === 3" class="vertical-step-shell">
            <div class="vertical-step-panel">
              <div class="form-group">
                <label class="label-required">Horarios por día * (Activa los días que laboras)</label>
                <div class="weekly-schedule-container">
                  <div v-for="dayObj in form.weeklySchedule" :key="dayObj.day" class="day-schedule-row" :class="{ 'day-active': dayObj.isOpen }">
                    <div class="day-label-checkbox">
                      <input :id="'day-' + dayObj.day" v-model="dayObj.isOpen" type="checkbox" />
                      <label :for="'day-' + dayObj.day">{{ dayObj.day }}</label>
                    </div>
                    <div v-if="dayObj.isOpen" class="day-hours-inputs transition-fade">
                      <input v-model="dayObj.startTime" type="time" class="time-picker" required />
                      <span class="time-separator">a</span>
                      <input v-model="dayObj.endTime" type="time" class="time-picker" required />
                    </div>
                    <div v-else class="day-closed-label"><span>Cerrado</span></div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="locationPhoto" class="label-required">Adjunta una foto de la ubicación del taller*</label>
                <div class="input-wrapper">
                  <span class="input-icon">📷</span>
                  <input id="locationPhoto" type="file" accept="image/*" class="input-field" required @change="handleFileUpload" />
                </div>
              </div>

              <div class="step-buttons">
                <button type="button" class="prev-step-btn" @click="anteriorPaso">← Anterior</button>
                <button type="button" class="next-step-btn" @click="siguientePaso">Siguiente →</button>
              </div>
            </div>
          </div>

          <!-- PASO 4 -->
          <div v-if="paso === 4" class="vertical-step-shell">
            <div class="vertical-step-panel">
              
              <!-- SERVICIOS -->
              <div class="form-group">
                <label class="label-required">Servicios * (Selecciona los servicios e indica el precio base)</label>
                <div class="specialties-grid">
                  
                  <div v-for="(servicio, index) in form.services" :key="index" class="service-item-wrapper">
                    <div class="specialty-item">
                      <input :id="'serv' + index" v-model="servicio.selected" type="checkbox" />
                      <label :for="'serv' + index">{{ servicio.name }}</label>
                    </div>
                    
                    <div v-if="servicio.selected" class="price-input-wrapper transition-fade">
                      <span class="currency-symbol">$</span>
                      <input 
                        v-model="servicio.price" 
                        type="number" 
                        placeholder="Precio (Opcional)" 
                        class="price-input" 
                        min="0" 
                        step="0.01" 
                      />
                    </div>
                  </div>

                  <!-- NUEVO: Opción Otro para Servicios -->
                  <div class="service-item-wrapper">
                    <div class="specialty-item">
                      <input id="servOther" v-model="showOtherService" type="checkbox" />
                      <label for="servOther" style="font-weight: bold; color: #0097c7;">Otro...</label>
                    </div>
                  </div>

                </div>

                <!-- NUEVO: Cajón para el Servicio personalizado -->
                <div v-if="showOtherService" class="other-specialty-wrapper transition-fade">
                  <label for="otherServiceText" class="sub-label">Escribe tu otro servicio:</label>
                  <input 
                    id="otherServiceText" 
                    v-model="form.otherService.name" 
                    type="text" 
                    placeholder="Ej: Cambio de balatas" 
                    class="input-field-no-icon" 
                    required 
                  />
                  
                  <!-- Y le agregamos su propio campo de precio -->
                  <div class="price-input-wrapper transition-fade" style="margin-left: 0; margin-top: 8px;">
                    <span class="currency-symbol">$</span>
                    <input 
                      v-model="form.otherService.price" 
                      type="number" 
                      placeholder="Precio base (Opcional)" 
                      class="price-input" 
                      min="0" 
                      step="0.01" 
                    />
                  </div>
                </div>
              </div>

              <!-- ESPECIALIDADES -->
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
                  <input id="otherSpecText" v-model="form.otherSpecialty" type="text" placeholder="Ej: Pintura wrapping, Cerrajería" class="input-field-no-icon" required />
                </div>
              </div>

              <div class="step-buttons">
                <button type="button" class="prev-step-btn" @click="anteriorPaso">← Anterior</button>
              </div>

              <div class="note-section">
                <p class="note-title">Nota:</p>
                <p class="note-text">
                  Tu perfil será revisado por nuestro equipo en un plazo de 24-48 horas. Recibirás un correo cuando tu cuenta sea verificada y activada.
                </p>
              </div>

              <button type="submit" class="submit-button" :disabled="submitting">
                {{ submitting ? 'Enviando...' : 'Enviar solicitud de alta' }}
              </button>

            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useTallerLocationMap } from '@/composables/useTallerLocationMap'

const showOtherInput = ref(false)
const showOtherService = ref(false) // Nueva variable para mostrar el cajón del otro servicio
const paso = ref(1)
const submitting = ref(false)

const {
  mapRef, inputBusquedaRef, searchText, coords, direccion, locationDetails,
  loadingGeo, errorMsg, initMap, destroyMap, buscarDireccionEscrita,
  usarMiUbicacion, resetMapSize, getLocationPayload,
} = useTallerLocationMap()

const siguientePaso = () => { if (paso.value < 4) paso.value++ }
const anteriorPaso = () => { if (paso.value > 1) paso.value-- }

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
  // Lista actualizada según tu captura de pantalla
  services: [
    { name: 'Frenos ABS', selected: false, price: '' },
    { name: 'Cambio de tambores', selected: false, price: '' },
    { name: 'Rectificación de discos', selected: false, price: '' },
    { name: 'Cambio caja de dirección', selected: false, price: '' },
    { name: 'Cambiar puntas homocineticas', selected: false, price: '' },
    { name: 'Cambio de kit de clutch', selected: false, price: '' }
  ],
  otherService: { name: '', price: '' }, // Aquí guardamos el servicio personalizado
  otherSpecialty: ''
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) { form.value.locationPhotoFile = file }
}

watch(paso, async (valor) => {
  if (valor === 2) {
    await nextTick()
    await initMap()
    resetMapSize()
    return
  }
  destroyMap()
})

watch(locationDetails, (details) => {
  if (!details) return
  if (details.addressLine) { form.value.shopLocation = details.addressLine }
  if (details.postalCode) { form.value.postalCode = details.postalCode }
}, { deep: true })

const submitForm = async () => {
  const activeSchedules = form.value.weeklySchedule
    .filter((d) => d.isOpen)
    .map((d) => `${d.day}: ${d.startTime} a ${d.endTime}`)

  const finalSpecialties = [...form.value.specialties]
  if (showOtherInput.value && form.value.otherSpecialty.trim()) {
    finalSpecialties.push(form.value.otherSpecialty.trim())
  }

  const selectedServices = form.value.services
    .filter((s) => s.selected)
    .map((s) => ({
      name: s.name,
      price: s.price !== '' ? s.price : null
    }))

  // Si el mecánico escribió un servicio "Otro" válido, lo metemos a la lista para enviarlo
  if (showOtherService.value && form.value.otherService.name.trim()) {
    selectedServices.push({
      name: form.value.otherService.name.trim(),
      price: form.value.otherService.price !== '' ? form.value.otherService.price : null
    })
  }

  const locationPayload = getLocationPayload()
  const formData = new FormData()

  formData.append('shopName', form.value.shopName)
  formData.append('shopPhone', form.value.shopPhone)
  formData.append('shopEmail', form.value.shopEmail)
  formData.append('shopLocation', form.value.shopLocation)
  formData.append('postalCode', form.value.postalCode)
  formData.append('scheduleList', JSON.stringify(activeSchedules))
  formData.append('specialties', JSON.stringify(finalSpecialties))
  
  formData.append('services', JSON.stringify(selectedServices))
  
  formData.append('latitud', locationPayload.latitud ?? '')
  formData.append('longitud', locationPayload.longitud ?? '')
  formData.append('direccion_geocodificada', locationPayload.direccion_geocodificada ?? '')

  if (form.value.locationPhotoFile) {
    formData.append('locationPhoto', form.value.locationPhotoFile)
  }

  try {
    submitting.value = true

    const response = await fetch('/api/registro_taller.php', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'No se pudo registrar el taller')
    }

    alert('Formulario de taller enviado correctamente con la ubicación marcada.')
  } catch (error) {
    alert(error.message || 'Hubo un problema al enviar el formulario')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped src="../styles/components/TallerRegister.css"></style>

<style scoped>
.service-item-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}

.price-input-wrapper {
  margin-left: 20px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #c2dbe6;
  border-radius: 6px;
  padding: 2px 8px;
  width: max-content;
}

.currency-symbol {
  color: #0097c7;
  font-size: 11px;
  font-weight: 700;
  margin-right: 4px;
}

.price-input {
  border: none;
  outline: none;
  font-size: 11px;
  padding: 4px 0;
  width: 90px;
  color: #333;
}

.price-input::placeholder {
  color: #9cb1bc;
}
</style>