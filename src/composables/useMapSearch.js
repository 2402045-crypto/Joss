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
  // Marcadores secundarios para talleres registrados (independientes del pin principal).
  let talleresMarkers = []
  // Ventana reutilizable para mostrar detalle del taller al hacer click.
  let infoWindow = null
  let clickListener = null
  let dragListener = null

  // Sanitiza texto antes de inyectarlo en InfoWindow para evitar HTML no deseado.
  function escapeHtml(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // Limpia del mapa todos los marcadores de talleres previamente renderizados.
  function clearTallerMarkers() {
    talleresMarkers.forEach((shopMarker) => {
      shopMarker.setMap(null)
    })

    talleresMarkers = []
  }

  // Consulta talleres registrados al backend y pinta un marcador por cada coordenada valida.
  async function cargarTalleresRegistrados() {
    try {
      const response = await fetch('/api/obtener_talleres.php')
      const result = await response.json()

      if (!response.ok || result.status !== 'success' || !Array.isArray(result.data)) {
        return
      }

      clearTallerMarkers()

      result.data.forEach((taller) => {
        const lat = Number(taller.latitud)
        const lng = Number(taller.longitud)

        // Ignora registros sin coordenadas numericas para evitar errores de mapa.
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return
        }

        const shopMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: taller.nombre_taller || 'Taller registrado',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 13,
            fillColor: '#0097c7',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 4,
          },
          // Prioriza visualmente los talleres sobre capas/markers secundarios.
          zIndex: 999,
          animation: window.google.maps.Animation.DROP,
        })

        // Cada marcador abre una ficha breve con datos del taller.
        shopMarker.addListener('click', () => {
          if (!infoWindow) {
            infoWindow = new window.google.maps.InfoWindow()
          }

          const contenido = `
            <div style="max-width:240px;font-family:Arial,sans-serif;line-height:1.35;">
              <h4 style="margin:0 0 6px;color:#0f4c81;">${escapeHtml(taller.nombre_taller || 'Taller')}</h4>
              <p style="margin:0 0 4px;"><strong>Direccion:</strong> ${escapeHtml(taller.direccion || 'No disponible')}</p>
              <p style="margin:0 0 4px;"><strong>Telefono:</strong> ${escapeHtml(taller.telefono || 'No disponible')}</p>
              <p style="margin:0;"><strong>Especialidades:</strong> ${escapeHtml(taller.especialidades || 'Sin especialidades registradas')}</p>
            </div>
          `

          infoWindow.setContent(contenido)
          infoWindow.open({ map, anchor: shopMarker })
        })

        talleresMarkers.push(shopMarker)
      })
    } catch (error) {
      console.error('No se pudieron cargar los talleres registrados:', error)
    }
  }

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
      // Pinta talleres guardados despues de inicializar mapa y marcador principal.
      await cargarTalleresRegistrados()

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
    // Limpieza explicita de recursos creados para talleres.
    clearTallerMarkers()
    if (infoWindow) infoWindow.close()

    map = null
    marker = null
    infoWindow = null
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