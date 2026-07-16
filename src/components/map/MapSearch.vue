<template>
    <div class="map-page">
      <button class="back-button" @click="goBack">← Volver</button>

      <div class="map-hero">
        <div class="hero-copy">
          <span class="hero-kicker">Mapa interactivo</span>
          <h2>Encuentra tu punto exacto</h2>
          <p>Usa tu ubicación para centrar el mapa y revisa las coordenadas cuando lo necesites.</p>
        </div>

        <div class="top-controls">
          <button class="locate-btn" @click="usarMiUbicacion" :disabled="loadingGeo">
            {{ loadingGeo ? 'Obteniendo ubicación...' : 'Usar mi ubicación' }}
          </button>

          <details class="coords-note">
            <summary>Detalles técnicos de ubicación</summary>
            <div class="note-body">
              <p><strong>Lat:</strong> {{ coords.lat ?? '-' }}</p>
              <p><strong>Lng:</strong> {{ coords.lng ?? '-' }}</p>
            </div>
          </details>
        </div>
      </div>

      <div class="map-stage">
        <div ref="mapRef" class="map-container"></div>
      </div>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMapSearch } from '@/composables/useMapSearch'

const router = useRouter()

const {
  mapRef,
  coords,
  loadingGeo,
  usarMiUbicacion,
} = useMapSearch()

function goBack() {
  router.back()
}
</script>

<style scoped>
.map-page {
  --ui-scale: 1.08;
  min-height: auto;
  background:
    radial-gradient(circle at 10% 8%, rgba(255, 255, 255, 0.18), transparent 34%),
    radial-gradient(circle at 88% 22%, rgba(143, 220, 255, 0.16), transparent 30%),
    linear-gradient(140deg, #0a6f9e 0%, #118fb7 46%, #176f9e 100%),
    repeating-linear-gradient(
      -30deg,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 8px,
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
  background: #f3f9fd;
  color: #0a5f8a;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  line-height: 1.2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.11);
  border: 1px solid rgba(10, 95, 138, 0.2);
}

.map-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 20px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.18), transparent 22%),
    radial-gradient(circle at 82% 30%, rgba(157, 229, 255, 0.16), transparent 24%),
    linear-gradient(135deg, rgba(16, 132, 182, 0.9), rgba(13, 102, 156, 0.86));
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.hero-copy {
  display: grid;
  gap: 6px;
  color: #f7fbff;
}

.hero-kicker {
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(7, 77, 116, 0.32), rgba(13, 106, 157, 0.2));
  color: #e7f6ff;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 10px 20px rgba(5, 54, 84, 0.18);
}

.hero-copy h2 {
  margin: 0;
  font-size: clamp(1.1rem, 2vw, 1.55rem);
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 0 1px 0 rgba(7, 57, 88, 0.28);
}

.hero-copy p {
  margin: 0;
  max-width: 58ch;
  color: rgba(240, 248, 255, 0.9);
  font-size: 0.96rem;
  line-height: 1.5;
}

.top-controls {
  position: absolute;
  top: 18px;
  right: 18px;
  width: min(392px, calc(100% - 36px));
  display: grid;
  justify-items: end;
  gap: 10px;
  z-index: 4;
}

.locate-btn {
  width: auto;
  min-width: 0;
  flex: 0 0 auto;
  border: none;
  background: linear-gradient(135deg, #0d86ea 0%, #0a5fd0 100%);
  color: white;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 12px 22px rgba(8, 95, 200, 0.3);
}

.locate-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.map-stage {
  position: relative;
  width: 100%;
}

.coords-note {
  position: static;
  width: 100%;
  border-radius: 12px;
  background: rgba(242, 248, 252, 0.96);
  border: 1px solid rgba(10, 95, 138, 0.18);
  box-shadow: 0 12px 24px rgba(10, 95, 138, 0.1);
  overflow: hidden;
}

.coords-note summary {
  cursor: pointer;
  list-style: none;
  padding: 12px 14px;
  font-weight: 700;
  color: #0a4f76;
  font-size: 1rem;
  background: linear-gradient(135deg, rgba(222, 239, 249, 0.98), rgba(203, 227, 242, 0.92));
}

.coords-note summary::-webkit-details-marker {
  display: none;
}

.note-body {
  padding: 12px 14px 14px;
  line-height: 1.45;
}

.note-body p {
  margin: 6px 0;
  color: #173f58;
  font-size: 0.98rem;
}

.map-container {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 560px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.18);
  background: #e8f1f7;
  border: 1px solid rgba(10, 95, 138, 0.18);
}

:deep(.gm-style .gm-style-iw-c) {
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

:deep(.gm-style .gm-style-iw-d) {
  overflow: visible !important;
}

:deep(.gm-style .gm-ui-hover-effect) {
  display: none !important;
}

:deep(.gm-style .gm-style-iw-t::after) {
  display: none !important;
}

@media (max-width: 768px) {
  .map-page {
    --ui-scale: 1;
    padding: 14px;
    margin-bottom: 0;
  }

  .map-hero {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .hero-copy p {
    max-width: none;
  }

  .top-controls {
    position: static;
    width: 100%;
    justify-items: stretch;
  }

  .locate-btn {
    width: 100%;
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

