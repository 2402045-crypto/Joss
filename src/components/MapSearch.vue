<template>
  <div class="map-page">

    <button class="back-button" @click="goBack">
      ← Volver
    </button>

    <div class="map-container">
      <img :src="mapImage" alt="Mapa" />

      <button class="search-area-btn">
        Buscar en esta área
      </button>
    </div>

    <div class="search-card">
      <div class="inputs">
        <input
          type="text"
          placeholder="📍 Ciudad o código postal"
        />

        <input
          type="text"
          placeholder="🔧 Tipo de servicio"
        />
      </div>

      <button class="search-btn">
        Buscar Mecánicos
      </button>
    </div>

  </div>
</template>

<script setup>
import mapImage from '../../Mapa.png'
const emit = defineEmits(['go-back'])
const goBack = () => emit('go-back')
</script>

<style scoped>
.map-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0b8dc4, #16c0b8);

  position: relative;
  left: 0;
  padding: 40px 0;
  overflow: hidden;
  box-sizing: border-box;
}

/* curva inferior */
.map-page::after {
  content: "";
  position: absolute;
  bottom: -140px;
  left: -5%;
  width: 110%;
  height: 320px;
  background: #efefef;
  border-radius: 50%;
}

.back-button {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 6;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: none;
  background: white;
  color: #0b8dc4;

  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
}

.map-container {
  position: relative;
  width: 90%;
  max-width: 1100px;
  margin: auto;
  z-index: 2;
}

.map-container img {
  width: 100%;
  height: 550px;
  object-fit: cover;

  border-radius: 35px;

  box-shadow:
    0 20px 50px rgba(0,0,0,.20);
}

.search-area-btn {
  position: absolute;

  top: 25px;
  left: 50%;

  transform: translateX(-50%);

  border: none;
  background: white;

  padding: 12px 22px;
  border-radius: 25px;

  font-weight: 600;
  cursor: pointer;
}

.search-card {
  position: relative;
  z-index: 3;

  width: 720px;
  max-width: 90%;

  margin: -40px auto 0;

  background: white;
  padding: 16px;

  border-radius: 18px;

  box-shadow:
    0 15px 40px rgba(0,0,0,.15);
}

.inputs {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.inputs input {
  flex: 1;

  padding: 14px;

  border: 1px solid #ddd;
  border-radius: 10px;

  background: #f5f5f5;
}

.search-btn {
  width: 100%;

  border: none;

  padding: 14px;

  border-radius: 10px;

  background: #0b8dc4;
  color: white;

  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 900px) {
  .map-container {
    position: relative;
    width: 100%;
  }
  .map-page {
    padding: 20px 0;
  }
  .back-button {
    top: 16px;
    left: 16px;
    padding: 8px 12px;
  }
}
</style>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>

