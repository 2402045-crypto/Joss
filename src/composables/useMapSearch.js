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
  // Overlay modal para ampliar la imagen del taller al hacer click.
  let imagePreviewOverlay = null
  let clickListener = null
  let dragListener = null
  let windowResizeHandler = null

  // Fuerza recalculo de tiles/canvas para evitar que el mapa se quede en gris o "cortado".
  function refreshMapSize() {
    if (!map || !window.google?.maps?.event) return

    const center = map.getCenter()
    window.google.maps.event.trigger(map, 'resize')
    if (center) {
      map.setCenter(center)
    }
  }

  // Cierra y limpia el visor ampliado si existe.
  function closeImagePreview() {
    if (imagePreviewOverlay) {
      imagePreviewOverlay.remove()
      imagePreviewOverlay = null
    }
  }

  // Abre la imagen del taller en grande con fondo oscuro y boton de cierre.
  function openImagePreview(src) {
    if (!src) return

    // Evita overlays duplicados si el usuario abre varias imagenes seguidas.
    closeImagePreview()

    // Capa oscura full-screen para enfocar la imagen ampliada.
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.inset = '0'
    overlay.style.background = 'rgba(0, 0, 0, 0.76)'
    overlay.style.display = 'flex'
    overlay.style.alignItems = 'center'
    overlay.style.justifyContent = 'center'
    overlay.style.padding = '20px'
    overlay.style.zIndex = '99999'

    // Marco contenedor de la imagen ampliada.
    const frame = document.createElement('div')
    frame.style.position = 'relative'
    frame.style.maxWidth = 'min(94vw, 900px)'
    frame.style.maxHeight = '88vh'
    frame.style.borderRadius = '14px'
    frame.style.overflow = 'hidden'
    frame.style.boxShadow = '0 24px 60px rgba(0, 0, 0, 0.45)'
    frame.style.background = '#000'

    // Imagen en grande sin recortes (contain).
    const image = document.createElement('img')
    image.src = src
    image.alt = 'Foto ampliada del taller'
    image.style.display = 'block'
    image.style.maxWidth = '100%'
    image.style.maxHeight = '88vh'
    image.style.objectFit = 'contain'

    // Boton de cierre flotante.
    const closeBtn = document.createElement('button')
    closeBtn.type = 'button'
    closeBtn.textContent = 'x'
    closeBtn.style.position = 'absolute'
    closeBtn.style.top = '10px'
    closeBtn.style.right = '10px'
    closeBtn.style.width = '34px'
    closeBtn.style.height = '34px'
    closeBtn.style.border = 'none'
    closeBtn.style.borderRadius = '999px'
    closeBtn.style.cursor = 'pointer'
    closeBtn.style.fontWeight = '700'
    closeBtn.style.fontSize = '18px'
    closeBtn.style.background = 'rgba(255, 255, 255, 0.92)'
    closeBtn.style.color = '#123b57'

    // Permite cerrar desde la "x" o haciendo click fuera de la imagen.
    closeBtn.addEventListener('click', closeImagePreview)
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeImagePreview()
      }
    })

    frame.appendChild(image)
    frame.appendChild(closeBtn)
    overlay.appendChild(frame)
    document.body.appendChild(overlay)

    imagePreviewOverlay = overlay
  }

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
      const response = await fetch('http://localhost:8080/Joss/api/obtener_talleres.php')
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

        // Marcador visual de taller con estilo azul destacado.
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

          // Construye ruta publica de la imagen guardada en uploads.
          const fotoUrl = taller.foto_taller
            ? `/api/uploads/${encodeURIComponent(taller.foto_taller)}`
            : ''

          // Imagen en modo contain con fondo negro: evita recortes y mantiene proporciones.
          // Incluye hover suave y click para abrir el visor ampliado.
          const imageBlock = fotoUrl
            ? `<div style="width:100%;height:108px;border-radius:10px;border:1px solid #b9e1ef;box-shadow:0 4px 10px rgba(0,72,104,0.12);margin:0 0 8px;display:flex;align-items:center;justify-content:center;background:#000000;overflow:hidden;cursor:zoom-in;" onclick="window.__openMapImagePreview && window.__openMapImagePreview('${fotoUrl}')"><img src="${fotoUrl}" alt="Foto del taller" style="max-width:100%;max-height:100%;object-fit:contain;display:block;transition:transform .2s ease, filter .2s ease;" onmouseover="this.style.transform='scale(1.035)'; this.style.filter='brightness(1.06)'" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)'" /></div>`
            : ''

          // Tarjeta compacta del InfoWindow con acentos azules.
          const contenido = `
            <div style="max-width:220px;font-family:Arial,sans-serif;line-height:1.3;background:linear-gradient(180deg,#f5fbff 0%,#edf7fc 100%);border:1px solid #c8e6f2;border-radius:12px;padding:8px;box-shadow:0 6px 12px rgba(0,87,125,0.10);">
              ${imageBlock}
              <div style="display:inline-block;background:#0097c7;color:#ffffff;font-size:9px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;padding:3px 7px;border-radius:999px;margin:0 0 6px;">Taller</div>
              <h4 style="margin:0 0 6px;color:#0f4c81;font-size:17px;font-weight:700;line-height:1.2;">${escapeHtml(taller.nombre_taller || 'Taller')}</h4>
              <p style="margin:0 0 5px;color:#154d67;font-size:12px;"><strong style="color:#0b5f86;">Direccion:</strong> ${escapeHtml(taller.direccion || 'No disponible')}</p>
              <p style="margin:0 0 5px;color:#154d67;font-size:12px;"><strong style="color:#0b5f86;">Telefono:</strong> ${escapeHtml(taller.telefono || 'No disponible')}</p>
              <p style="margin:0;padding-top:5px;border-top:1px dashed #9fcde0;color:#154d67;font-size:12px;"><strong style="color:#0b5f86;">Especialidades:</strong> ${escapeHtml(taller.especialidades || 'Sin especialidades registradas')}</p>
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

      // Recalculo diferido para estabilizar el render inicial de Google Maps.
      requestAnimationFrame(() => {
        refreshMapSize()
      })

      // Mantiene estable el mapa tras cambios de tamaño de ventana/layout.
      windowResizeHandler = () => {
        refreshMapSize()
      }
      window.addEventListener('resize', windowResizeHandler)

      updateMapAndMarker(centro.lat, centro.lng, 12)
      await syncAddress(centro.lat, centro.lng)
      // Pinta talleres guardados despues de inicializar mapa y marcador principal.
      await cargarTalleresRegistrados()

      clickListener = map.addListener('click', (event) => {
        // Cierra la ficha del taller solo cuando se hace click fuera (en el mapa).
        if (infoWindow) {
          infoWindow.close()
        }

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
  onMounted(() => {
    // Exponer handler global para que el HTML inline del InfoWindow pueda abrir el modal.
    window.__openMapImagePreview = openImagePreview
    initMap()
  })

  onUnmounted(() => {
    // Limpieza de listeners para evitar fugas al navegar entre vistas.
    if (clickListener) window.google?.maps?.event.removeListener(clickListener)
    if (dragListener) window.google?.maps?.event.removeListener(dragListener)
    if (windowResizeHandler) {
      window.removeEventListener('resize', windowResizeHandler)
      windowResizeHandler = null
    }
    // Limpieza explicita de recursos creados para talleres.
    clearTallerMarkers()
    if (infoWindow) infoWindow.close()
    // Cierra modal de imagen si estaba abierto.
    closeImagePreview()

    // Retira referencia global para evitar fugas entre navegaciones.
    if (window.__openMapImagePreview) {
      delete window.__openMapImagePreview
    }

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