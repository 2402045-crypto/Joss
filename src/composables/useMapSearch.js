import { onMounted, onUnmounted, ref } from 'vue'
import { loadGoogleMaps, geocodificarInverso, obtenerUbicacionActual } from '@/services/googleMapsService'

export function useMapSearch() {
  const mapRef = ref(null)
  const inputBusquedaRef = ref(null)

  const searchText = ref('')
  const direccion = ref('')
  const errorMsg = ref('')
  const loadingGeo = ref(false)
  const coords = ref({ lat: null, lng: null })

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  let map = null
  let marker = null
  let autocomplete = null
  let clickListener = null
  let dragListener = null
  let placeListener = null

  const emitters = ref([])

  function onLocationSelected(callback) {
    emitters.value.push(callback)
  }

  function emitLocation(lat, lng, direccionTexto = '') {
    emitters.value.forEach((callback) => callback({ lat, lng, direccion: direccionTexto }))
  }

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

    emitLocation(coords.value.lat, coords.value.lng, direccion.value)
  }

  async function syncAddress(lat, lng) {
    try {
      direccion.value = await geocodificarInverso(lat, lng)
      errorMsg.value = ''
    } catch (error) {
      direccion.value = ''
      errorMsg.value = error.message || 'Error en geocodificación inversa'
    }
  }

  function initAutocomplete() {
    if (!inputBusquedaRef.value || !window.google?.maps?.places) return

    autocomplete = new window.google.maps.places.Autocomplete(inputBusquedaRef.value, {
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'mx' },
    })

    placeListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      updateMapAndMarker(lat, lng, 17)
      direccion.value = place.formatted_address || ''
      errorMsg.value = ''
    })
  }

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

      initAutocomplete()
    } catch (error) {
      errorMsg.value = error.message || 'No se puede inicializar el mapa'
    }
  }

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

  onMounted(initMap)

  onUnmounted(() => {
    if (clickListener) window.google?.maps?.event.removeListener(clickListener)
    if (dragListener) window.google?.maps?.event.removeListener(dragListener)
    if (placeListener) window.google?.maps?.event.removeListener(placeListener)

    map = null
    marker = null
    autocomplete = null
  })

  return {
    mapRef,
    inputBusquedaRef,
    searchText,
    direccion,
    errorMsg,
    loadingGeo,
    coords,
    usarMiUbicacion,
    onLocationSelected,
  }
}