import { onMounted, onUnmounted, ref } from 'vue'
import { loadGoogleMaps, geocodificarInverso, obtenerUbicacionActual } from '@/services/googleMapsService'

export function useMapSearch() {
  // Estado reactivo que consume la vista del mapa.
  const mapRef = ref(null)
  const direccion = ref('')
  const errorMsg = ref('')
  const loadingGeo = ref(false)
  const coords = ref({ lat: null, lng: null })

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  let map = null
  let marker = null
  let clickListener = null
  let dragListener = null

  // Actualiza coordenadas, pin y cámara del mapa desde un único punto de control.
  function updateMapAndMarker(lat, lng, zoom = 16) {
    const pos = { lat, lng }

    coords.value = {
      lat: +lat.toFixed(7),
      lng: +lng.toFixed(7),
    }

    if (marker) {
      marker.setPosition(pos)
    }

    if (map) {
      map.panTo(pos)
      map.setZoom(zoom)
    }

  }

  // Convierte lat/lng en una dirección legible para mostrarla en pantalla.
  async function syncAddress(lat, lng) {
    try {
      direccion.value = await geocodificarInverso(lat, lng)
      errorMsg.value = ''
    } catch (error) {
      direccion.value = ''
      errorMsg.value = error.message || 'Error en geocodificación inversa'
    }
  }

  // Inicializa Google Maps, crea marcador draggable y registra listeners de interacción.
  async function initMap() {
    try {
      await loadGoogleMaps(apiKey)

      const centro = { lat: 20.6274, lng: -87.0799 }

      map = new window.google.maps.Map(mapRef.value, {
        center: centro,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        clickableIcons: false,
      })

      marker = new window.google.maps.Marker({
        position: centro,
        map,
        draggable: true,
        title: 'Ubicación seleccionada',
      })

      updateMapAndMarker(centro.lat, centro.lng, 12)
      await syncAddress(centro.lat, centro.lng)

      clickListener = map.addListener('click', (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        updateMapAndMarker(lat, lng)
        syncAddress(lat, lng)
      })

      dragListener = marker.addListener('dragend', () => {
        const position = marker.getPosition()
        if (!position) return

        const lat = position.lat()
        const lng = position.lng()
        updateMapAndMarker(lat, lng)
        syncAddress(lat, lng)
      })
    } catch (error) {
      errorMsg.value = error.message || 'No se puede inicializar el mapa'
    }
  }

  // Usa geolocalización del navegador para posicionar el mapa en la ubicación del usuario.
  async function usarMiUbicacion() {
    loadingGeo.value = true
    errorMsg.value = ''

    try {
      const { lat, lng } = await obtenerUbicacionActual()
      updateMapAndMarker(lat, lng, 17)
      await syncAddress(lat, lng)
    } catch (error) {
      errorMsg.value = error.message
    } finally {
      loadingGeo.value = false
    }
  }

  // Al montar el composable, el mapa se crea automáticamente.
  onMounted(initMap)

  onUnmounted(() => {
    // Limpieza de listeners para evitar fugas al navegar entre vistas.
    if (clickListener) window.google?.maps?.event.removeListener(clickListener)
    if (dragListener) window.google?.maps?.event.removeListener(dragListener)

    map = null
    marker = null
  })

  return {
    mapRef,
    direccion,
    errorMsg,
    loadingGeo,
    coords,
    usarMiUbicacion,
  }
}