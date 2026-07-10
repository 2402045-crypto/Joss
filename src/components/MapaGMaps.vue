<template>
  <div ref="mapaRef" class="mapa"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapaRef = ref(null)

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function cargarGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')

    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    script.async = true
    script.defer = true

    script.onload = resolve
    script.onerror = reject

    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await cargarGoogleMaps()

  new google.maps.Map(mapaRef.value, {
    center: {
      lat: 19.4326,
      lng: -99.1332
    },
    zoom: 13
  })
})
</script>

<style scoped>
.mapa{
    width:100%;
    height:100%;
}
</style>