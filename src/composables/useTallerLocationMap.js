import { onUnmounted, ref } from 'vue'
import { loadGoogleMaps, geocodificarInversoDetallado, obtenerUbicacionActual } from '@/services/googleMapsService'

export function useTallerLocationMap() {
  // Referencias de UI y estado reactivo consumido por TallerRegister.
  const mapRef = ref(null)
  const inputBusquedaRef = ref(null)
  const searchText = ref('')
  const coords = ref({ lat: null, lng: null })
  const direccion = ref('')
  const locationDetails = ref({
    addressLine: '',
    postalCode: '',
    formattedAddress: '',
  })
  const loadingGeo = ref(false)
  const errorMsg = ref('')

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  let map = null
  let marker = null
  let autocomplete = null
  let clickListener = null
  let dragListener = null
  let placeListener = null

  // Delimita búsquedas dentro de Playa del Carmen para evitar resultados fuera de zona.
  function getPlayaDelCarmenBounds() {
    if (!window.google?.maps) return null

    return new window.google.maps.LatLngBounds(
      { lat: 20.566, lng: -87.128 },
      { lat: 20.691, lng: -86.958 }
    )
  }

  // Limpia listeners y objetos de mapa cuando el paso 2 se desmonta o se reinicia.
  function destroyMap() {
    if (clickListener) {
      window.google?.maps?.event.removeListener(clickListener)
      clickListener = null
    }

    if (dragListener) {
      window.google?.maps?.event.removeListener(dragListener)
      dragListener = null
    }

    if (placeListener) {
      window.google?.maps?.event.removeListener(placeListener)
      placeListener = null
    }

    if (marker) {
      marker.setMap(null)
    }

    map = null
    marker = null
    autocomplete = null
  }

  // Centraliza la actualización de coordenadas y sincroniza vista (pin + centro + zoom).
  function setCoords(lat, lng, zoom = 16) {
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

  // Convierte lat/lng en dirección legible y extras (línea + CP) para autollenado.
  async function syncAddress(lat, lng) {
    try {
      const result = await geocodificarInversoDetallado(lat, lng)
      direccion.value = result.formattedAddress
      locationDetails.value = {
        addressLine: result.addressLine,
        postalCode: result.postalCode,
        formattedAddress: result.formattedAddress,
      }
      errorMsg.value = ''
    } catch (error) {
      direccion.value = ''
      locationDetails.value = {
        addressLine: '',
        postalCode: '',
        formattedAddress: '',
      }
      errorMsg.value = error.message || 'Error en geocodificación inversa'
    }
  }

  // Inicializa autocomplete de Google Places restringido a México y al bounding box local.
  function initAutocomplete() {
    if (!inputBusquedaRef.value || !window.google?.maps?.places) return

    const playaDelCarmenBounds = getPlayaDelCarmenBounds()
    if (!playaDelCarmenBounds) return

    autocomplete = new window.google.maps.places.Autocomplete(inputBusquedaRef.value, {
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'mx' },
      bounds: playaDelCarmenBounds,
      strictBounds: true,
    })

    placeListener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      if (!playaDelCarmenBounds.contains(place.geometry.location)) {
        errorMsg.value = 'Solo se permiten búsquedas dentro de Playa del Carmen.'
        return
      }

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      searchText.value = place.formatted_address || ''
      setCoords(lat, lng, 17)
      syncAddress(lat, lng)
    })
  }

  // Permite buscar con Enter sin depender del dropdown de autocomplete.
  function buscarDireccionEscrita() {
    if (!searchText.value.trim() || !window.google?.maps) return

    const playaDelCarmenBounds = getPlayaDelCarmenBounds()
    if (!playaDelCarmenBounds) return

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode(
      {
        address: searchText.value.trim(),
        bounds: playaDelCarmenBounds,
        region: 'mx',
      },
      (results, status) => {
        if (status !== 'OK' || !results?.[0]?.geometry?.location) {
          errorMsg.value = 'No se encontró una dirección válida en Playa del Carmen.'
          return
        }

        const location = results[0].geometry.location

        if (!playaDelCarmenBounds.contains(location)) {
          errorMsg.value = 'Solo se permiten búsquedas dentro de Playa del Carmen.'
          return
        }

        const lat = location.lat()
        const lng = location.lng()

        searchText.value = results[0].formatted_address || searchText.value
        setCoords(lat, lng, 17)
        syncAddress(lat, lng)
      }
    )
  }

  // Monta mapa, pin draggable y listeners de click/drag para seleccionar ubicación exacta.
  async function initMap() {
    if (!mapRef.value) return

    if (map && map.getDiv && map.getDiv() !== mapRef.value) {
      destroyMap()
    }

    if (map) return

    try {
      await loadGoogleMaps(apiKey)

      const centro = { lat: 20.6274, lng: -87.0799 }

      map = new window.google.maps.Map(mapRef.value, {
        center: centro,
        zoom: 12,
        controlSize: 28,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      })

      marker = new window.google.maps.Marker({
        position: centro,
        map,
        draggable: true,
        title: 'Ubicación del taller',
      })

      setCoords(centro.lat, centro.lng, 12)
      await syncAddress(centro.lat, centro.lng)

      clickListener = map.addListener('click', (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setCoords(lat, lng)
        syncAddress(lat, lng)
      })

      dragListener = marker.addListener('dragend', () => {
        const position = marker.getPosition()
        if (!position) return

        const lat = position.lat()
        const lng = position.lng()
        setCoords(lat, lng)
        syncAddress(lat, lng)
      })

      initAutocomplete()
    } catch (error) {
      errorMsg.value = error.message || 'No se pudo cargar el mapa'
    }
  }

  // Usa geolocalización del navegador para mover pin y recalcular dirección/código postal.
  async function usarMiUbicacion() {
    loadingGeo.value = true
    errorMsg.value = ''

    try {
      const { lat, lng } = await obtenerUbicacionActual()
      setCoords(lat, lng, 17)
      await syncAddress(lat, lng)
    } catch (error) {
      errorMsg.value = error.message
    } finally {
      loadingGeo.value = false
    }
  }

  // Recalcula el layout visual del mapa al entrar al paso 2 o tras cambios de contenedor.
  function resetMapSize() {
    if (!map || !window.google?.maps) return
    window.google.maps.event.trigger(map, 'resize')
    const center = map.getCenter()
    if (center) map.panTo(center)
  }

  // Payload mínimo que necesita el backend para persistir ubicación del taller.
  function getLocationPayload() {
    return {
      latitud: coords.value.lat,
      longitud: coords.value.lng,
      direccion_geocodificada: direccion.value,
    }
  }

  onUnmounted(() => {
    destroyMap()
  })

  return {
    mapRef,
    inputBusquedaRef,
    searchText,
    coords,
    direccion,
    locationDetails,
    loadingGeo,
    errorMsg,
    initMap,
    destroyMap,
    buscarDireccionEscrita,
    usarMiUbicacion,
    resetMapSize,
    getLocationPayload,
  }
}