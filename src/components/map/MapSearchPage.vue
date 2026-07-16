<template>
  <!-- Contenedor de página para aislar layout/responsividad de la vista de mapa -->
  <section class="map-page-shell">
    <MapSearch />
  </section>
</template>

<script setup>
// Esta página delega toda la lógica de mapa al componente MapSearch.
import MapSearch from './MapSearch.vue'
</script>

<style scoped>
.map-page-shell {
  width: 100%;
  max-width: 1320px;
  min-width: 0;
  margin: 0 auto;
}
</style>