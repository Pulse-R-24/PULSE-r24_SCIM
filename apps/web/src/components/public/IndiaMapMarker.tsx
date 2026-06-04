import type { Marker } from 'maplibre-gl'
import type { IndiaCitySignal, IndiaSignalLevel } from '@/components/public/indiaMapSignals'

const levelClass: Record<IndiaSignalLevel, string> = {
  none: 'pulse-maplibre-marker-none',
  low: 'pulse-maplibre-marker-low',
  medium: 'pulse-maplibre-marker-medium',
  high: 'pulse-maplibre-marker-high',
}

export function createIndiaMapMarkerElement(signal: IndiaCitySignal) {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = `pulse-maplibre-marker ${levelClass[signal.level]}`
  element.setAttribute('aria-label', `${signal.city} published PULSE-R24 brief signal`)
  element.innerHTML = `
    <span class="pulse-maplibre-marker-pulse"></span>
    <span class="pulse-maplibre-marker-core">${signal.briefs.length}</span>
    <span class="pulse-maplibre-marker-label">${signal.city}</span>
  `
  return element
}

export function removeIndiaMapMarkers(markers: Marker[]) {
  markers.forEach((marker) => marker.remove())
}
