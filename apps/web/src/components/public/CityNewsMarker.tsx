import type * as Leaflet from 'leaflet'
import type { CitySignal, SignalIntensity } from '@/components/public/indiaSignalMapData'

const intensityClass: Record<SignalIntensity, string> = {
  none: 'pulse-map-marker-none',
  low: 'pulse-map-marker-low',
  medium: 'pulse-map-marker-medium',
  high: 'pulse-map-marker-high',
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function createCityNewsMarker({
  leaflet,
  signal,
  onSelect,
}: {
  leaflet: typeof Leaflet
  signal: CitySignal
  onSelect: (signal: CitySignal) => void
}) {
  const count = signal.reports.length
  const icon = leaflet.divIcon({
    className: 'pulse-map-marker-shell',
    html: `
      <button class="pulse-map-marker ${intensityClass[signal.intensity]}" aria-label="${escapeHtml(signal.city)} published brief signal">
        <span class="pulse-map-marker-ping"></span>
        <span class="pulse-map-marker-dot">${count}</span>
      </button>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })

  const marker = leaflet.marker([signal.coordinates[0], signal.coordinates[1]], { icon, keyboard: true })
  marker.on('mouseover', () => onSelect(signal))
  marker.on('click', () => {
    onSelect(signal)
  })

  return marker
}
