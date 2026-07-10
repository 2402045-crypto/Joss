<template>
  <section class="map-page-shell">
    <MapSearch @ubicacion-seleccionada="recibirUbicacion" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MapSearch from './MapSearch.vue'

const ubicacion = ref(null)

function recibirUbicacion(data) {
  ubicacion.value = data
}
</script>

<style scoped>
.map-page-shell {
  width: 100%;
  max-width: 1320px;
  min-width: 0;
  margin: 0 auto;
}
</style>