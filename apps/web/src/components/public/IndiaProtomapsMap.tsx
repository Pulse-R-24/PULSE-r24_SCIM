'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as MapLibreMap, Marker, StyleSpecification } from 'maplibre-gl'
import type { PublicReportSummary } from '@modules/reports/types'
import { createIndiaCityMarkerElement, removeIndiaCityMarkers } from '@/components/public/IndiaCityMarker'
import { IndiaMapFallback } from '@/components/public/IndiaMapFallback'
import { IndiaMapLegend } from '@/components/public/IndiaMapLegend'
import { IndiaNewsPopup } from '@/components/public/IndiaNewsPopup'
import { buildIndiaCitySignals, type IndiaCitySignal } from '@/components/public/indiaMapSignals'

let pmtilesProtocolRegistered = false

const fallbackIndiaGeoJson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'India' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [68.1, 23.7],
            [69.6, 27.2],
            [73.1, 31],
            [77, 34.5],
            [80.8, 30.8],
            [88.3, 27.2],
            [94.6, 27.6],
            [95.2, 25],
            [92.8, 23.2],
            [88.1, 22.1],
            [86.2, 20.6],
            [84, 18.5],
            [82, 16.3],
            [80.4, 13],
            [78.1, 8.2],
            [76.2, 8],
            [74.2, 12],
            [72.9, 16.6],
            [72.4, 19],
            [70.2, 21],
            [68.1, 23.7],
          ],
        ],
      },
    },
  ],
}

function createStyle(pmtilesUrl?: string): StyleSpecification {
  if (pmtilesUrl) {
    return {
      version: 8,
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      sources: {
        protomaps: {
          type: 'vector',
          url: `pmtiles://${pmtilesUrl}`,
        },
      },
      layers: [
        { id: 'background', type: 'background', paint: { 'background-color': '#07101b' } },
        { id: 'earth', type: 'fill', source: 'protomaps', 'source-layer': 'earth', paint: { 'fill-color': '#0b1220' } },
        { id: 'land', type: 'fill', source: 'protomaps', 'source-layer': 'land', paint: { 'fill-color': '#111827' } },
        { id: 'water', type: 'fill', source: 'protomaps', 'source-layer': 'water', paint: { 'fill-color': '#061526' } },
        {
          id: 'boundaries',
          type: 'line',
          source: 'protomaps',
          'source-layer': 'boundaries',
          paint: { 'line-color': '#475569', 'line-width': 0.9, 'line-opacity': 0.65 },
        },
        {
          id: 'roads',
          type: 'line',
          source: 'protomaps',
          'source-layer': 'roads',
          paint: { 'line-color': '#334155', 'line-width': 0.45, 'line-opacity': 0.42 },
        },
        {
          id: 'places',
          type: 'symbol',
          source: 'protomaps',
          'source-layer': 'places',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 7, 13],
            'text-font': ['Noto Sans Regular'],
          },
          paint: { 'text-color': '#cbd5e1', 'text-halo-color': '#07101b', 'text-halo-width': 1.2 },
        },
      ],
    }
  }

  return {
    version: 8,
    sources: {
      india: { type: 'geojson', data: fallbackIndiaGeoJson },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#07101b' } },
      { id: 'india-fill', type: 'fill', source: 'india', paint: { 'fill-color': '#111827', 'fill-opacity': 0.94 } },
      { id: 'india-line', type: 'line', source: 'india', paint: { 'line-color': '#94a3b8', 'line-width': 1.7, 'line-opacity': 0.82 } },
    ],
  }
}

export function IndiaProtomapsMap({ reports }: { reports: PublicReportSummary[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker[]>([])
  const [selectedSignal, setSelectedSignal] = useState<IndiaCitySignal | null>(null)
  const pmtilesUrl = process.env.NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL?.trim()
  const signals = useMemo(() => buildIndiaCitySignals(reports), [reports])
  const activeCount = signals.reduce((sum, signal) => sum + signal.briefs.length, 0)

  useEffect(() => {
    let cancelled = false
    let map: MapLibreMap | null = null

    async function mountMap() {
      if (!mapContainerRef.current || mapRef.current) return
      const [{ default: maplibregl }, { Protocol }] = await Promise.all([
        import('maplibre-gl'),
        import('pmtiles'),
      ])
      if (cancelled || !mapContainerRef.current) return

      if (!pmtilesProtocolRegistered) {
        const protocol = new Protocol()
        maplibregl.addProtocol('pmtiles', protocol.tile)
        pmtilesProtocolRegistered = true
      }

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: createStyle(pmtilesUrl),
        center: [78.6569, 22.9734],
        zoom: 3.05,
        minZoom: 2.8,
        maxZoom: 7,
        maxBounds: [
          [66, 5.5],
          [98, 37.5],
        ],
        attributionControl: false,
      })
      mapRef.current = map
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
      map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Protomaps PMTiles / MapLibre / Published reports only' }), 'bottom-left')

      markerRef.current = signals.map((signal) => {
        const element = createIndiaCityMarkerElement(signal)
        element.addEventListener('mouseenter', () => setSelectedSignal(signal))
        element.addEventListener('click', () => setSelectedSignal(signal))
        return new maplibregl.Marker({ element, anchor: 'center' })
          .setLngLat([signal.longitude, signal.latitude])
          .addTo(map!)
      })
    }

    mountMap()

    return () => {
      cancelled = true
      removeIndiaCityMarkers(markerRef.current)
      markerRef.current = []
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [pmtilesUrl, signals])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#07101b] shadow-2xl shadow-slate-950/20">
      <IndiaMapFallback pmtilesUrl={pmtilesUrl} />
      <div ref={mapContainerRef} className="relative z-[2] h-full w-full" aria-label="India Protomaps city signal map" />

      <div className="absolute left-4 top-4 z-10 rounded-lg border border-slate-700/70 bg-slate-950/90 p-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          India City Signals
        </div>
        <p className="mt-1 text-[10px] font-semibold uppercase text-slate-500">
          {activeCount} Published PULSE-R24 Briefs
        </p>
      </div>

      <IndiaMapLegend />

      {selectedSignal && (
        <>
          <div className="absolute right-4 top-4 z-20 hidden md:block">
            <IndiaNewsPopup signal={selectedSignal} />
          </div>
          <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-slate-200 bg-white p-4 shadow-[0_-18px_50px_rgba(15,23,42,0.22)] md:hidden">
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200" />
            <IndiaNewsPopup signal={selectedSignal} onClose={() => setSelectedSignal(null)} compact />
          </div>
        </>
      )}

      <style jsx global>{`
        .maplibregl-map {
          font-family: inherit;
        }
        .maplibregl-canvas {
          outline: none;
        }
        .maplibregl-marker {
          position: absolute;
          left: 0;
          top: 0;
          will-change: transform;
        }
        .maplibregl-ctrl-bottom-left,
        .maplibregl-ctrl-bottom-right {
          z-index: 10;
        }
        .maplibregl-ctrl-attrib,
        .maplibregl-ctrl-group {
          border: 1px solid rgba(148, 163, 184, 0.35) !important;
          background: rgba(2, 6, 23, 0.9) !important;
          color: #cbd5e1 !important;
          box-shadow: none !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #e2e8f0 !important;
        }
        .maplibregl-ctrl button {
          filter: invert(1);
        }
        .pulse-maplibre-marker {
          position: absolute;
          display: flex;
          height: 2.2rem;
          width: 2.2rem;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          cursor: pointer;
        }
        .pulse-maplibre-marker-pulse {
          position: absolute;
          inset: 0.25rem;
          border-radius: 999px;
          opacity: 0.55;
          animation: pulse-maplibre-marker 1.9s ease-out infinite;
        }
        .pulse-maplibre-marker-core {
          position: relative;
          z-index: 1;
          display: flex;
          height: 1.35rem;
          width: 1.35rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.85);
          color: white;
          font-size: 0.58rem;
          font-weight: 900;
          box-shadow: 0 0 24px rgba(225, 29, 72, 0.65);
        }
        .pulse-maplibre-marker-label {
          position: absolute;
          left: 1.8rem;
          top: 50%;
          z-index: 1;
          transform: translateY(-50%);
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(2, 6, 23, 0.88);
          padding: 0.25rem 0.45rem;
          color: #e2e8f0;
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          opacity: 0;
          text-transform: uppercase;
          transition: opacity 160ms ease;
        }
        .pulse-maplibre-marker:hover .pulse-maplibre-marker-label {
          opacity: 1;
        }
        .pulse-maplibre-marker-none .pulse-maplibre-marker-pulse {
          display: none;
        }
        .pulse-maplibre-marker-none .pulse-maplibre-marker-core {
          background: #64748b;
          box-shadow: 0 0 14px rgba(100, 116, 139, 0.45);
        }
        .pulse-maplibre-marker-low .pulse-maplibre-marker-core,
        .pulse-maplibre-marker-low .pulse-maplibre-marker-pulse {
          background: #10b981;
        }
        .pulse-maplibre-marker-medium .pulse-maplibre-marker-core,
        .pulse-maplibre-marker-medium .pulse-maplibre-marker-pulse {
          background: #f59e0b;
        }
        .pulse-maplibre-marker-high .pulse-maplibre-marker-core,
        .pulse-maplibre-marker-high .pulse-maplibre-marker-pulse {
          background: #8b0000;
        }
        @keyframes pulse-maplibre-marker {
          0% {
            transform: scale(0.78);
            opacity: 0.76;
          }
          100% {
            transform: scale(2.55);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
