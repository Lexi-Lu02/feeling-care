import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { MAPBOX_CONFIG } from '../config/mapbox.js'

// Enhanced Mapbox service with advanced features for BR (E.2)
export const mapboxService = {
  // Initialize map with advanced features
  initializeMap(containerId, options = {}) {
    const {
      center = MAPBOX_CONFIG.defaultCenter,
      zoom = MAPBOX_CONFIG.defaultZoom,
      style = MAPBOX_CONFIG.defaultStyle,
    } = options

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    const map = new mapboxgl.Map({
      container: containerId,
      style,
      center,
      zoom,
    })

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add geolocation control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right',
    )

    // Add scale control
    map.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left',
    )

    return map
  },

  // Add markers with popups
  addMarkers(map, associations) {
    const markers = []

    associations.forEach((association) => {
      // Create popup content
      const popupContent = this.createPopupContent(association)

      // Create marker
      const marker = new mapboxgl.Marker({
        color: this.getMarkerColor(association.focus),
      })
        .setLngLat(association.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map)

      markers.push(marker)
    })

    return markers
  },

  // Create popup content for markers
  createPopupContent(association) {
    return `
      <div class="mapbox-popup">
        <h5 class="popup-title">${association.name}</h5>
        <p class="popup-description">${association.description}</p>
        <div class="popup-details">
          <p><strong>Focus:</strong> ${association.focus}</p>
          <p><strong>Phone:</strong> ${association.phone}</p>
          <p><strong>Hours:</strong> ${association.hours}</p>
        </div>
        <div class="popup-actions">
          <button onclick="getDirections(${association.id})" class="btn btn-sm btn-primary">
            <i class="fas fa-directions me-1"></i>Get Directions
          </button>
          <a href="${association.website}" target="_blank" class="btn btn-sm btn-outline-primary">
            <i class="fas fa-external-link-alt me-1"></i>Website
          </a>
        </div>
      </div>
    `
  },

  // Get marker color based on focus area
  getMarkerColor(focus) {
    const colors = {
      Youth: '#1976d2',
      Crisis: '#d32f2f',
      Family: '#7b1fa2',
      'LGBTQ+': '#388e3c',
      Indigenous: '#f57c00',
      Workplace: '#00796b',
      Addiction: '#689f38',
      Trauma: '#ad1457',
      Depression: '#c2185b',
      General: '#616161',
    }
    return colors[focus] || '#616161'
  },

  // Geocoding - Search for places
  async geocode(query) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=AU&proximity=144.9631,-37.8136&limit=5`,
      )
      const data = await response.json()
      return data.features
    } catch (error) {
      console.error('Geocoding error:', error)
      return []
    }
  },

  // Reverse geocoding - Get address from coordinates
  async reverseGeocode(lng, lat) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_CONFIG.accessToken}&types=address`,
      )
      const data = await response.json()
      return data.features[0]?.place_name || 'Unknown location'
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return 'Unknown location'
    }
  },

  // Directions API - Get route between two points
  async getDirections(start, end) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${MAPBOX_CONFIG.accessToken}&geometries=geojson&overview=full&steps=true`,
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Directions error:', error)
      return null
    }
  },

  // Add route to map
  addRoute(map, route) {
    if (!route || !route.routes || route.routes.length === 0) return

    const routeData = route.routes[0]

    // Add route source
    if (map.getSource('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    }

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeData.geometry,
      },
    })

    // Add route layer
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8,
      },
    })

    // Fit map to route bounds
    const coordinates = routeData.geometry.coordinates
    const bounds = coordinates.reduce(
      (bounds, coord) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
    )

    map.fitBounds(bounds, { padding: 50 })
  },

  // Search nearby places
  async searchNearby(lng, lat, category = 'healthcare', radius = 5000) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?access_token=${MAPBOX_CONFIG.accessToken}&proximity=${lng},${lat}&radius=${radius}&types=poi&limit=10`,
      )
      const data = await response.json()
      return data.features
    } catch (error) {
      console.error('Nearby search error:', error)
      return []
    }
  },

  // Add search control
  addSearchControl(map, onResult) {
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_CONFIG.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for places...',
      proximity: MAPBOX_CONFIG.defaultCenter,
      countries: 'AU',
      types: 'place,locality,neighborhood,address,poi',
    })

    geocoder.on('result', (e) => {
      if (onResult) onResult(e.result)
    })

    map.addControl(geocoder, 'top-left')
    return geocoder
  },

  // Clear all markers
  clearMarkers(markers) {
    markers.forEach((marker) => marker.remove())
  },

  // Fit map to show all markers
  fitToMarkers(map, markers) {
    if (markers.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    markers.forEach((marker) => {
      bounds.extend(marker.getLngLat())
    })

    map.fitBounds(bounds, { padding: 50 })
  },
}
