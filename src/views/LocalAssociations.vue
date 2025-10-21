<template>
  <div class="local-associations-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <h1 class="hero-title">Local Mental Health Associations</h1>
            <p class="hero-description">
              Discover mental health support services and associations in Melbourne. Find local
              resources, support groups, and professional services near you.
            </p>
          </div>
          <div class="col-12 col-lg-4">
            <div class="hero-icon">
              <img
                src="/images/icon/hospital.png"
                alt="Local Associations"
                class="hero-association-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="search-section">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search associations, locations, or focus areas..."
                class="search-input"
                @input="filterAssociations"
              />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="filter-controls">
              <select v-model="selectedFocus" @change="filterAssociations" class="filter-select">
                <option value="">All Focus Areas</option>
                <option value="Youth">Youth Mental Health</option>
                <option value="Depression">Depression & Anxiety</option>
                <option value="Crisis">Crisis Support</option>
                <option value="Family">Family Support</option>
                <option value="LGBTQ+">LGBTQ+ Support</option>
                <option value="Indigenous">Indigenous Mental Health</option>
                <option value="Workplace">Workplace Mental Health</option>
                <option value="Addiction">Addiction Support</option>
                <option value="Trauma">Trauma & PTSD</option>
                <option value="General">General Mental Health</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Controls Section -->
    <section class="map-controls-section">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8">
            <div class="map-controls-panel">
              <button @click="centerMapOnMelbourne" class="btn btn-primary">
                <i class="fas fa-crosshairs me-2"></i>
                Center on Melbourne
              </button>
              <button @click="showAllMarkers" class="btn btn-primary">
                <i class="fas fa-map-marker-alt me-2"></i>
                Show All Locations
              </button>
              <button @click="toggleRouteMode" class="btn btn-primary">
                <i class="fas fa-route me-2"></i>
                {{ routeMode ? 'Exit Route Mode' : 'Enable Route Mode' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map and Associations Section -->
    <section class="map-associations-section">
      <div class="container">
        <div class="row">
          <!-- Map Column -->
          <div class="col-12 col-lg-8">
            <div class="map-container">
              <div id="map" class="map"></div>
            </div>
          </div>

          <!-- Associations List Column -->
          <div class="col-12 col-lg-4">
            <div class="associations-sidebar">
              <div class="sidebar-header">
                <h3 class="sidebar-title">
                  <i class="fas fa-list me-2"></i>
                  Mental Health Services
                </h3>
                <div class="results-count">
                  <span class="count-badge">{{ filteredAssociations.length }}</span>
                  <span class="count-text">services found</span>
                </div>
              </div>

              <div class="associations-list">
                <!-- Associations list -->
                <div
                  v-for="association in filteredAssociations"
                  :key="association.id"
                  class="association-card"
                  @click="selectAssociation(association)"
                  :class="{ active: selectedAssociation?.id === association.id }"
                >
                  <div class="association-header">
                    <h4 class="association-name">{{ association.name }}</h4>
                    <span class="focus-badge" :class="getFocusBadgeClass(association.focus)">
                      {{ association.focus }}
                    </span>
                  </div>
                  <div class="association-details">
                    <div class="detail-item">
                      <i class="fas fa-map-marker-alt me-1"></i>
                      <span>{{ association.suburb }}, {{ association.region }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-phone me-1"></i>
                      <span>{{ association.phone }}</span>
                    </div>
                    <button
                      @click.stop="getDirections(association)"
                      class="btn btn-sm btn-primary directions-btn"
                    >
                      <i class="fas fa-directions me-1"></i>
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Association Details Modal -->
    <div v-if="selectedAssociation" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAssociation.name }}</h3>
          <button @click="closeModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 col-md-6">
              <h5>About</h5>
              <p>{{ selectedAssociation.fullDescription }}</p>

              <h5>Services</h5>
              <ul class="services-list">
                <li v-for="service in selectedAssociation.services" :key="service">
                  <i class="fas fa-check me-2"></i>{{ service }}
                </li>
              </ul>
            </div>
            <div class="col-12 col-md-6">
              <h5>Contact Information</h5>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  <div>
                    <strong>Address:</strong><br />
                    {{ selectedAssociation.address }}<br />
                    {{ selectedAssociation.suburb }}, {{ selectedAssociation.region }}
                    {{ selectedAssociation.postcode }}
                  </div>
                </div>
                <div class="contact-item">
                  <i class="fas fa-phone me-2"></i>
                  <div>
                    <strong>Phone:</strong><br />
                    {{ selectedAssociation.phone }}
                  </div>
                </div>
                <div class="contact-item">
                  <i class="fas fa-envelope me-2"></i>
                  <div>
                    <strong>Email:</strong><br />
                    <a :href="`mailto:${selectedAssociation.email}`">{{
                      selectedAssociation.email
                    }}</a>
                  </div>
                </div>
                <div class="contact-item">
                  <i class="fas fa-clock me-2"></i>
                  <div>
                    <strong>Hours:</strong><br />
                    {{ selectedAssociation.hours }}
                  </div>
                </div>
              </div>

              <div class="modal-actions">
                <button
                  @click="getDirections(selectedAssociation)"
                  class="btn btn-primary btn-sm modal-btn"
                >
                  <i class="fas fa-directions me-1"></i>
                  Directions
                </button>
                <a
                  :href="selectedAssociation.website"
                  target="_blank"
                  class="btn btn-outline-primary btn-sm modal-btn"
                >
                  <i class="fas fa-external-link-alt me-1"></i>
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import {
  getAllAssociations,
  initializeAssociationsListener,
  cleanupAssociationsListener,
} from '../services/firestoreAssociationsService'
import { mapboxService } from '../services/mapboxService'

// Reactive data
const searchQuery = ref('')
const selectedFocus = ref('')
const selectedAssociation = ref(null)
const associations = ref([])
const routeMode = ref(false)
const routeStart = ref(null)
const routeEnd = ref(null)

// Computed properties
const filteredAssociations = computed(() => {
  let filtered = associations.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (association) =>
        association.name.toLowerCase().includes(query) ||
        association.description.toLowerCase().includes(query) ||
        association.suburb.toLowerCase().includes(query) ||
        association.focus.toLowerCase().includes(query) ||
        association.services.some((service) => service.toLowerCase().includes(query)),
    )
  }

  if (selectedFocus.value) {
    filtered = filtered.filter((association) => association.focus === selectedFocus.value)
  }

  return filtered
})

// Methods
const filterAssociations = () => {
  // This will trigger the computed property automatically
}

const selectAssociation = (association) => {
  selectedAssociation.value = association
  // Center map on selected association
  if (map) {
    map.flyTo({
      center: association.coordinates,
      zoom: 15,
      essential: true,
    })
  }
}

const closeModal = () => {
  selectedAssociation.value = null
}

const getFocusBadgeClass = (focus) => {
  const classes = {
    Youth: 'badge-youth',
    Depression: 'badge-depression',
    Crisis: 'badge-crisis',
    Family: 'badge-family',
    'LGBTQ+': 'badge-lgbtq',
    Indigenous: 'badge-indigenous',
    Workplace: 'badge-workplace',
    Addiction: 'badge-addiction',
    Trauma: 'badge-trauma',
    General: 'badge-general',
  }
  return classes[focus] || 'badge-general'
}

const getDirections = (association) => {
  const address = encodeURIComponent(
    `${association.address}, ${association.suburb}, ${association.region} ${association.postcode}`,
  )
  const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`
  window.open(url, '_blank')
}

const centerMapOnMelbourne = () => {
  if (map) {
    map.flyTo({
      center: [144.9631, -37.8136], // [lng, lat]
      zoom: 11,
      essential: true,
    })
  }
}

const showAllMarkers = () => {
  if (map && markers) {
    mapboxService.fitToMarkers(map, markers)
  }
}

const toggleRouteMode = () => {
  routeMode.value = !routeMode.value
  routeStart.value = null
  routeEnd.value = null

  if (routeMode.value) {
    // Add click handler for route selection
    map.on('click', handleRouteClick)
    map.getCanvas().style.cursor = 'crosshair'
  } else {
    // Remove click handler and route
    map.off('click', handleRouteClick)
    map.getCanvas().style.cursor = ''
    if (map.getSource('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    }
  }
}

const handleRouteClick = async (e) => {
  if (!routeStart.value) {
    routeStart.value = [e.lngLat.lng, e.lngLat.lat]
    alert('Start point selected. Click on destination.')
  } else if (!routeEnd.value) {
    routeEnd.value = [e.lngLat.lng, e.lngLat.lat]

    // Get directions
    const route = await mapboxService.getDirections(routeStart.value, routeEnd.value)
    if (route) {
      mapboxService.addRoute(map, route)
      alert('Route calculated!')
    } else {
      alert('Could not calculate route.')
    }

    // Reset for next route
    routeStart.value = null
    routeEnd.value = null
  }
}

// Map instance
let map = null
let markers = []

// Initialize map
const initializeMap = () => {
  // Initialize Mapbox map
  map = mapboxService.initializeMap('map', {
    center: [144.9631, -37.8136], // Melbourne coordinates [lng, lat]
    zoom: 11,
  })

  // Wait for map to load
  map.on('load', () => {
    // Add markers for each association
    markers = mapboxService.addMarkers(map, associations.value)

    // Add click handlers to markers
    markers.forEach((marker, index) => {
      marker.getElement().addEventListener('click', () => {
        selectAssociation(associations.value[index])
      })
    })

    // Add search control
    mapboxService.addSearchControl(map, (result) => {
      // Center map on search result
      map.flyTo({
        center: result.center,
        zoom: 15,
        essential: true,
      })
    })
  })
}

// Load associations from Firestore
const loadAssociations = async () => {
  try {
    const firestoreAssociations = await getAllAssociations()
    associations.value = firestoreAssociations
  } catch (error) {
    console.error('Error loading associations:', error)
    // Fallback to empty array if Firestore fails
    associations.value = []
  }
}

// Lifecycle
onMounted(async () => {
  // Load associations from Firestore
  await loadAssociations()

  // Initialize real-time listener
  initializeAssociationsListener()

  // Initialize map after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeMap()
  }, 100)
})

onUnmounted(() => {
  // Clean up real-time listener
  cleanupAssociationsListener()
})
</script>

<style scoped>
@import '../assets/local-associations.css';
</style>
