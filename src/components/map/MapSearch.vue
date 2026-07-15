<template>
    <div class="map-page">
      <button class="back-button" @click="goBack">← Volver</button>

      <div class="top-controls">
        <input
          ref="inputBusquedaRef"
          v-model="searchText"
          type="text"
          placeholder="Buscar dirección..."
        />

        <button class="locate-btn" @click="usarMiUbicacion" :disabled="loadingGeo">
          {{ loadingGeo ? 'Obteniendo ubicación...' : 'Usar mi ubicación' }}
        </button>
      </div>

      <div class="map-stage">
        <div ref="mapRef" class="map-container"></div>

        <details class="status-note">
          <summary>Detalles técnicos de ubicación</summary>
          <div class="note-body">
            <p><strong>Lat:</strong> {{ coords.lat ?? '-' }}</p>
            <p><strong>Lng:</strong> {{ coords.lng ?? '-' }}</p>
            <p><strong>Dirección:</strong> {{ direccion || 'Sin dirección' }}</p>
            <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
          </div>
        </details>
      </div>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMapSearch } from '@/composables/useMapSearch'

const router = useRouter()
const emit = defineEmits(['ubicacion-seleccionada'])

const {
  mapRef,
  inputBusquedaRef,
  searchText,
  direccion,
  errorMsg,
  loadingGeo,
  coords,
  usarMiUbicacion,
  onLocationSelected,
} = useMapSearch()

onLocationSelected((data) => emit('ubicacion-seleccionada', data))

function goBack() {
  router.back()
}
</script>

<style scoped>
.map-page {
  --ui-scale: 1.08;
  min-height: auto;
  background:
    radial-gradient(circle at 10% 8%, rgba(255, 255, 255, 0.28), transparent 36%),
    radial-gradient(circle at 88% 22%, rgba(164, 236, 255, 0.22), transparent 32%),
    linear-gradient(140deg, #0f83b8 0%, #16a7c3 48%, #1993be 100%),
    repeating-linear-gradient(
      -30deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 8px,
      rgba(255, 255, 255, 0) 8px,
      rgba(255, 255, 255, 0) 20px
    );
  padding: 16px;
  box-sizing: border-box;
  display: grid;
  gap: 12px;
  width: 100%;
  max-width: 1160px;
  min-width: 0;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid rgba(11, 93, 128, 0.22);
  box-shadow: 0 18px 38px rgba(22, 93, 126, 0.16);
  transform: scale(var(--ui-scale));
  transform-origin: top center;
  margin-bottom: 54px;
}

.back-button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  border: none;
  background: #f6fbff;
  color: #0c6e9a;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  line-height: 1.2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(12, 110, 154, 0.22);
}

.top-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  gap: 10px;
}

.top-controls input {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #c4d9ea;
  border-radius: 12px;
  background: #fafdff;
  padding: 12px;
  font-size: 14px;
  color: #12344d;
}

.top-controls input:focus {
  outline: none;
  border-color: #0d8dc2;
  box-shadow: 0 0 0 3px rgba(13, 141, 194, 0.15);
}

.locate-btn {
  width: auto;
  min-width: 0;
  border: none;
  background: linear-gradient(135deg, #0d78dc 0%, #0d63cf 100%);
  color: white;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 18px rgba(13, 99, 207, 0.24);
}

.locate-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.map-stage {
  position: relative;
  width: 100%;
}

.status-note {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  width: min(460px, calc(100% - 24px));
  border-radius: 12px;
  background: rgba(245, 251, 255, 0.92);
  border: 1px solid rgba(12, 109, 152, 0.22);
  box-shadow: 0 8px 20px rgba(12, 109, 152, 0.12);
  overflow: hidden;
}

.status-note summary {
  cursor: pointer;
  list-style: none;
  padding: 12px 14px;
  font-weight: 700;
  color: #0d5f86;
  font-size: 1rem;
  background: rgba(231, 242, 249, 0.85);
}

.status-note summary::-webkit-details-marker {
  display: none;
}

.note-body {
  padding: 12px 14px 14px;
  line-height: 1.45;
}

.note-body p {
  margin: 6px 0;
  color: #23465f;
  font-size: 0.98rem;
}

.note-body p.error {
  color: #c62828;
  font-weight: 700;
  margin: 0;
}

.map-container {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 560px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
  background: #e7f2f9;
  border: 1px solid rgba(12, 109, 152, 0.22);
}

@media (max-width: 768px) {
  .map-page {
    --ui-scale: 1;
    padding: 14px;
    margin-bottom: 0;
  }

  .top-controls {
    grid-template-columns: 1fr;
  }

  .locate-btn {
    width: 100%;
  }

  .status-note {
    position: static;
    width: 100%;
    margin-top: 10px;
  }

  .map-container {
    min-height: 430px;
  }
}

@media (max-width: 1200px) {
  .map-page {
    --ui-scale: 1;
    margin-bottom: 0;
  }
}
</style>

