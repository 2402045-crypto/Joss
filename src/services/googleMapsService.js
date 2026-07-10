export function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve()
      return
    }

    if (!apiKey) {
      reject(new Error('Falta VITE_GOOGLE_MAPS_API_KEY en tu .env'))
      return
    }

    const callbackName = '__gmapsInitMapSearch'
    window[callbackName] = () => {
      delete window[callbackName]
      resolve()
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}&loading=async`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'))
    document.head.appendChild(script)
  })
}

export function geocodificarInverso(lat, lng) {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('El SDK de Google Maps no está cargado'))
      return
    }

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ location: { lat, lng }, language: 'es' }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        resolve(results[0].formatted_address)
        return
      }

      if (status === 'ZERO_RESULTS') {
        reject(new Error('No se encontró dirección para ese punto'))
        return
      }

      reject(new Error(`Geocodificación fallida: ${status}`))
    })
  })
}

export function obtenerUbicacionActual() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      (err) => {
        const mensajes = {
          1: 'Permiso denegado',
          2: 'Posición no disponible',
          3: 'Tiempo agotado',
        }
        reject(new Error(mensajes[err.code] || 'Error de geolocalización'))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}