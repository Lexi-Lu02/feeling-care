import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '../config/mapbox.js'

export function useMapbox(
  containerId,
  center = MAPBOX_CONFIG.defaultCenter,
  zoom = MAPBOX_CONFIG.defaultZoom,
) {
  // Set Mapbox access token
  mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

  const map = new mapboxgl.Map({
    container: containerId,
    style: MAPBOX_CONFIG.defaultStyle,
    center,
    zoom,
  })

  // Add navigation & geolocation controls
  map.addControl(new mapboxgl.NavigationControl())
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }),
  )

  return map
}
