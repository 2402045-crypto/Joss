<template>
  <div class="booking-shell">
    <header class="booking-topbar">
      <div>
        <h1>CITAS</h1>
        <p>Agenda tu cita con el mecánico de tu preferencia</p>
      </div>
      <div class="booking-title-right">
        <h2>Completa tu solicitud de cita</h2>
      </div>
    </header>

    <div class="booking-layout">
      <section class="booking-form-card">
        <div class="form-header">
          <h3>Programación y Cita</h3>
        </div>

        <div class="calendar-card">
          <div class="calendar-header">
            <button type="button" class="nav-button" @click="prevMonth">‹</button>
            <span>{{ monthName }} {{ yearNumber }}</span>
            <button type="button" class="nav-button" @click="nextMonth">›</button>
          </div>
          <div class="calendar-weekdays">
            <span v-for="day in dayNames" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-grid">
            <span
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="[{ inactive: !day.currentMonth }, { selected: day.selected } ]"
              @click="selectDay(day)"
            >
              {{ day.number || '' }}
            </span>
          </div>
        </div>

        <div class="form-fields">
          <label>
            <span>Fecha</span>
            <input type="date" v-model="formulario.fecha" :min="fechaMinima" required />
          </label>

          <label>
            <span>Horario</span>
            <input type="time" v-model="formulario.hora" required />
          </label>

          <label>
            <span>Servicio requerido</span>
            <select v-model="formulario.id_servicio" required class="form-select">
              <option value="" disabled>Selecciona un servicio...</option>
              <option 
                v-for="servicio in serviciosTaller" 
                :key="servicio.id_servicio" 
                :value="servicio.id_servicio"
              >
                {{ servicio.nombre }} {{ servicio.precio ? '— $' + servicio.precio : '' }}
              </option>
            </select>
          </label>

          <!-- NUEVO CAMPO: DESCRIPCIÓN -->
          <label>
            <span>Descripción del problema (Opcional)</span>
            <textarea 
              v-model="formulario.descripcion" 
              class="form-textarea" 
              rows="3"
              placeholder="Ej: Es para una moto, tiene un ruido raro al acelerar..."
            ></textarea>
          </label>
        </div>

        <button type="button" class="primary-button" @click="agendarCita">Pedir cita</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const idTaller = route.params.id_taller || 1
const fechaMinima = ref(new Date().toISOString().slice(0, 10))

const serviciosTaller = ref([])

// Agregamos el campo descripcion en blanco
const formulario = ref({
  fecha: new Date().toISOString().slice(0, 10),
  hora: '',
  id_servicio: '',
  descripcion: '' 
})

const cargarServicios = async () => {
  const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const API_URL = esLocal 
    ? `http://localhost:8080/Joss/api/obtener_servicios_taller.php?id_taller=${idTaller}` 
    : `https://mecanicweb.free.nf/Joss/api/obtener_servicios_taller.php?id_taller=${idTaller}`

  try {
    const respuesta = await fetch(API_URL)
    const resultado = await respuesta.json()
    if (resultado.status === 'success') {
      serviciosTaller.value = resultado.data
    }
  } catch (error) {
    console.error('Error al cargar los servicios del taller:', error)
  }
}

const agendarCita = async () => {
  const idUsuario = localStorage.getItem('usuario_id')
  
  if (!idUsuario) {
    alert("Inicia sesión para agendar")
    router.push('/login')
    return
  }

  if (!formulario.value.fecha || !formulario.value.hora || !formulario.value.id_servicio) {
    alert("Llena todos los campos obligatorios")
    return
  }

  // Ahora mandamos también la descripción
  const payload = {
    id_usuario: idUsuario,
    id_taller: idTaller,
    id_servicio: formulario.value.id_servicio,
    fecha: formulario.value.fecha,
    hora: formulario.value.hora,
    descripcion: formulario.value.descripcion
  }

  const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const API_URL = esLocal 
    ? 'http://localhost:8080/Joss/api/agendar_cita.php' 
    : 'https://mecanicweb.free.nf/Joss/api/agendar_cita.php'

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const resultado = await respuesta.json()
    if (resultado.status === 'success') {
      alert("¡Cita agendada con éxito!")
      router.push('/miscitas')
    } else {
      alert("Error: " + resultado.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const yearNumber = computed(() => currentYear.value)
const monthName = computed(() => monthNames[currentMonth.value])

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
const firstWeekday = (month, year) => {
  const weekday = new Date(year, month, 1).getDay()
  return weekday === 0 ? 6 : weekday - 1
}

const calendarDays = computed(() => {
  const days = []
  const firstDayIndex = firstWeekday(currentMonth.value, currentYear.value)
  const currentMonthDays = daysInMonth(currentMonth.value, currentYear.value)
  const prevMonthDays = daysInMonth((currentMonth.value + 11) % 12, currentYear.value - (currentMonth.value === 0 ? 1 : 0))

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({ number: prevMonthDays - i, currentMonth: false, selected: false, date: null })
  }
  for (let i = 1; i <= currentMonthDays; i++) {
    const dateString = new Date(currentYear.value, currentMonth.value, i).toISOString().slice(0, 10)
    days.push({ number: i, currentMonth: true, selected: dateString === formulario.value.fecha, date: dateString })
  }
  while (days.length % 7 !== 0) {
    days.push({ number: null, currentMonth: false, selected: false, date: null })
  }
  return days
})

const selectDay = (day) => {
  if (!day.currentMonth || !day.date) return
  formulario.value.fecha = day.date
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

onMounted(() => {
  cargarServicios()
})
</script>

<style scoped>
.booking-shell { width: 100%; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; padding: 24px 16px 48px; }
.booking-topbar { display: flex; justify-content: space-between; align-items: center; gap: 18px; background: white; border-radius: 22px; padding: 24px 28px; border: 1px solid rgba(15, 23, 42, 0.08); box-shadow: 0 14px 24px rgba(15, 23, 42, 0.04); flex-wrap: wrap; }
.booking-topbar h1 { margin: 0 0 6px; font-size: 1.9rem; color: #0f172a; }
.booking-topbar p { margin: 0; color: #566575; font-size: 0.97rem; }
.booking-title-right h2 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #101828; }
.booking-layout { display: flex; justify-content: center; width: 100%; }
.booking-form-card { width: 100%; max-width: 480px; background: white; border-radius: 22px; padding: 28px; border: 1px solid rgba(15, 23, 42, 0.06); box-shadow: 0 14px 26px rgba(15, 23, 42, 0.04); }
.form-header { margin-bottom: 20px; text-align: center; }
.form-header h3 { margin: 0; font-size: 1.2rem; font-weight: 700; color: #0f172a; }
.calendar-card { background: #f8fbff; border-radius: 20px; padding: 20px; border: 1px solid #dbeafe; margin-bottom: 24px; }
.calendar-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.calendar-header span { font-weight: 700; color: #0f172a; font-size: 1.05rem; }
.nav-button { width: 38px; height: 38px; display: grid; place-items: center; background: white; color: #2563eb; font-size: 1.2rem; border-radius: 12px; border: 1px solid #dbeafe; cursor: pointer; transition: all 0.2s; }
.nav-button:hover { background: #2563eb; color: white; }
.calendar-weekdays, .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
.calendar-weekdays span { color: #64748b; font-size: 0.8rem; text-align: center; font-weight: 600; margin-bottom: 8px; }
.calendar-grid span { height: 42px; display: grid; place-items: center; border-radius: 12px; background: white; color: #0f172a; font-size: 0.95rem; cursor: pointer; font-weight: 500; transition: all 0.2s; }
.calendar-grid span:hover:not(.inactive) { border: 1px solid #2563eb; }
.calendar-grid span.inactive { color: #94a3b8; background: transparent; cursor: default; }
.calendar-grid span.selected { background: #2563eb; color: white; }

.form-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.booking-form-card label { display: grid; gap: 8px; color: #334155; font-size: 0.95rem; font-weight: 500; }
.booking-form-card input, .form-select, .form-textarea { width: 100%; padding: 14px 16px; border-radius: 14px; border: 1px solid #dbeafe; background: #f8fbff; font-size: 0.95rem; color: #0f172a; outline: none; transition: border-color 0.2s; font-family: inherit; }
.booking-form-card input:focus, .form-select:focus, .form-textarea:focus { border-color: #2563eb; }

/* Permitimos que el cliente haga más grande la caja de texto solo hacia abajo */
.form-textarea { resize: vertical; }

.primary-button { width: 100%; padding: 16px 0; border-radius: 14px; background: #2563eb; color: white; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.1s; }
.primary-button:hover { background: #1d4ed8; transform: translateY(-2px); }
.primary-button:active { transform: translateY(0); }

@media (max-width: 680px) { 
  .booking-shell { padding: 16px 12px 32px; } 
  .booking-topbar { padding: 20px; flex-direction: column; align-items: flex-start; } 
  .booking-form-card { padding: 20px; }
  .calendar-grid span { height: 36px; font-size: 0.85rem; } 
}
</style>