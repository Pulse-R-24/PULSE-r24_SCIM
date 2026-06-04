import type * as Leaflet from 'leaflet'

export const indiaStateGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'India Intelligence Operating Area' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [68.1, 23.7],
            [69.6, 27.2],
            [73.1, 31.0],
            [77.0, 34.5],
            [80.8, 30.8],
            [88.3, 27.2],
            [94.6, 27.6],
            [95.2, 25.0],
            [92.8, 23.2],
            [88.1, 22.1],
            [86.2, 20.6],
            [84.0, 18.5],
            [82.0, 16.3],
            [80.4, 13.0],
            [78.1, 8.2],
            [76.2, 8.0],
            [74.2, 12.0],
            [72.9, 16.6],
            [72.4, 19.0],
            [70.2, 21.0],
            [68.1, 23.7],
          ],
        ],
      },
    },
  ],
} as GeoJSON.FeatureCollection

export function addIndiaStateLayer(map: Leaflet.Map, leaflet: typeof Leaflet) {
  return leaflet.geoJSON(indiaStateGeoJson, {
    style: {
      color: '#6b7280',
      weight: 1.5,
      opacity: 0.8,
      fillColor: '#111827',
      fillOpacity: 0.78,
    },
  }).addTo(map)
}
