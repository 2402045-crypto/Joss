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
      <section class="mechanic-card">
        <div class="mechanic-card-top">
          <img class="mechanic-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" alt="Mecánico" />
          <div>
            <div class="name-row">
              <h2>Miguel Ángel Torres</h2>
              <span class="verified">Verificado</span>
            </div>
            <div class="meta-row">
              <span class="rating">★ 4.8 (98 reseñas)</span>
              <span class="distance">· 3.7 km</span>
            </div>
          </div>
        </div>

        <div class="mechanic-tags">
          <span>Frenos</span>
          <span>Suspensión</span>
          <span>Alineación</span>
        </div>

        <div class="mechanic-details">
          <p>Polanco, CDMX</p>
          <span class="availability">Disponible mañana</span>
        </div>

        <div class="booking-actions">
          <button type="button" class="primary-button">Ver Perfil Completo</button>
          <button type="button" class="secondary-button">Contactar</button>
        </div>
      </section>

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

        <label>
          <span>Fecha</span>
          <input type="date" v-model="selectedDate" />
        </label>

        <label>
          <span>Horario</span>
          <input type="time" placeholder="Selecciona hora" />
        </label>

        <label>
          <span>Nombre</span>
          <input type="text" placeholder="Escribe tu nombre" />
        </label>

        <button type="button" class="primary-button">Pedir cita</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

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
    days.push({ number: i, currentMonth: true, selected: dateString === selectedDate.value, date: dateString })
  }

  while (days.length % 7 !== 0) {
    days.push({ number: null, currentMonth: false, selected: false, date: null })
  }

  return days
})

const selectDay = (day) => {
  if (!day.currentMonth || !day.date) return
  selectedDate.value = day.date
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
</script>

<style scoped>
.booking-shell {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  padding: 20px 0 48px;
}

.booking-topbar {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  background: white;
  border-radius: 22px;
  padding: 24px 24px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.04);
}

.booking-topbar h1 {
  margin: 0 0 6px;
  font-size: 1.9rem;
}

.booking-topbar p {
  margin: 0;
  color: #566575;
  font-size: 0.97rem;
}

.booking-title-right h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #101828;
}

.booking-layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) 360px;
}

.mechanic-card,
.booking-form-card {
  background: white;
  border-radius: 22px;
  padding: 22px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.04);
}

.mechanic-card-top {
  display: flex;
  gap: 14px;
  align-items: center;
}

.mechanic-avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  object-fit: cover;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.name-row h2 {
  margin: 0;
  font-size: 1.2rem;
}

.verified {
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.meta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  color: #64748b;
  font-size: 0.93rem;
}

.mechanic-tags {
  margin: 18px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mechanic-tags span {
  padding: 8px 14px;
  border-radius: 999px;
  background: #eef7ff;
  color: #2563eb;
  font-size: 0.86rem;
}

.mechanic-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #52667a;
  font-size: 0.92rem;
}

.availability {
  font-weight: 700;
  color: #16a34a;
}

.booking-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.primary-button,
.secondary-button,
.nav-button {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
}

.primary-button {
  background: #2563eb;
  color: white;
  padding: 12px 18px;
}

.secondary-button {
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #e2e8f0;
  padding: 12px 18px;
}

.primary-button:hover,
.secondary-button:hover,
.nav-button:hover {
  transform: translateY(-1px);
}

.form-header {
  margin-bottom: 16px;
}

.form-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.calendar-card {
  background: #f8fbff;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid #dbeafe;
  margin-bottom: 18px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.calendar-header span {
  font-weight: 700;
  color: #0f172a;
}

.nav-button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: white;
  color: #2563eb;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 1px solid #dbeafe;
}

.calendar-weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.calendar-weekdays span {
  color: #64748b;
  font-size: 0.78rem;
  text-align: center;
}

.calendar-grid span {
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: white;
  color: #0f172a;
  font-size: 0.92rem;
  cursor: pointer;
}

.calendar-grid span.inactive {
  color: #94a3b8;
  background: transparent;
  cursor: default;
}

.calendar-grid span.selected {
  background: #2563eb;
  color: white;
}

.booking-form-card label {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
  color: #334155;
  font-size: 0.95rem;
}

.booking-form-card input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
  font-size: 0.95rem;
}

.booking-form-card button {
  width: 100%;
  margin-top: 10px;
  padding: 14px 0;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
}

@media (max-width: 950px) {
  .booking-layout {
    grid-template-columns: 1fr;
  }

  .booking-topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 680px) {
  .booking-shell {
    padding: 16px 12px 32px;
  }

  .booking-topbar {
    padding: 18px 18px;
  }

  .booking-layout {
    gap: 16px;
  }

  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .calendar-weekdays,
  .calendar-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .calendar-grid span {
    height: 32px;
    font-size: 0.8rem;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
