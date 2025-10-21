// Mapbox Configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN || 'your_token_here',
  defaultStyle: 'mapbox://styles/mapbox/streets-v11',
  defaultCenter: [144.9631, -37.8136], // Melbourne coordinates
  defaultZoom: 10,
}
