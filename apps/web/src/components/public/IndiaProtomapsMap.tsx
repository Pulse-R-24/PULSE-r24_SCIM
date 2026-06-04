'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as MapLibreMap, Marker, StyleSpecification } from 'maplibre-gl'
import type { PublicReportSummary } from '@modules/reports/types'
import { createIndiaMapMarkerElement, removeIndiaMapMarkers } from '@/components/public/IndiaMapMarker'
import { IndiaMapControls } from '@/components/public/IndiaMapControls'
import { IndiaMapFallback } from '@/components/public/IndiaMapFallback'
import { IndiaMapLegend } from '@/components/public/IndiaMapLegend'
import { IndiaMapMobileSheet } from '@/components/public/IndiaMapMobileSheet'
import { IndiaMapPopup } from '@/components/public/IndiaMapPopup'
import { buildIndiaCitySignals, type IndiaCitySignal } from '@/components/public/indiaMapSignals'
import { IndiaMapLoading } from '@/components/public/IndiaMapLoading'

let pmtilesProtocolRegistered = false

const INDIA_CENTER: [number, number] = [78.6569, 22.9734]
const INDIA_ZOOM = 3.45

function createProtomapsStyle(pmtilesUrl: string): StyleSpecification {
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
      { id: 'background', type: 'background', paint: { 'background-color': '#06111d' } },
      { id: 'earth', type: 'fill', source: 'protomaps', 'source-layer': 'earth', paint: { 'fill-color': '#07101b' } },
      { id: 'land', type: 'fill', source: 'protomaps', 'source-layer': 'land', paint: { 'fill-color': '#101827' } },
      { id: 'water', type: 'fill', source: 'protomaps', 'source-layer': 'water', paint: { 'fill-color': '#03111f' } },
      {
        id: 'boundaries',
        type: 'line',
        source: 'protomaps',
        'source-layer': 'boundaries',
        paint: { 'line-color': '#64748b', 'line-width': 0.9, 'line-opacity': 0.72 },
      },
      {
        id: 'roads',
        type: 'line',
        source: 'protomaps',
        'source-layer': 'roads',
        paint: { 'line-color': '#334155', 'line-width': 0.45, 'line-opacity': 0.36 },
      },
      {
        id: 'places',
        type: 'symbol',
        source: 'protomaps',
        'source-layer': 'places',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9, 6, 12],
          'text-font': ['Noto Sans Regular'],
        },
        paint: { 'text-color': '#cbd5e1', 'text-halo-color': '#06111d', 'text-halo-width': 1.2 },
      },
    ],
  }
}

export function IndiaProtomapsMap({ reports }: { reports: PublicReportSummary[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker[]>([])
  const [selectedSignal, setSelectedSignal] = useState<IndiaCitySignal | null>(null)
  const [mounted, setMounted] = useState(false)
  const pmtilesUrl = process.env.NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL?.trim()
  const signals = useMemo(() => buildIndiaCitySignals(reports), [reports])
  const activeCount = signals.reduce((sum, signal) => sum + signal.briefs.length, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !pmtilesUrl) return
    const sourceUrl = pmtilesUrl

    let cancelled = false
    let map: MapLibreMap | null = null

    async function mountMap() {
      if (!mapContainerRef.current || mapRef.current) return
      const [{ default: maplibregl }, { Protocol }] = await Promise.all([import('maplibre-gl'), import('pmtiles')])
      if (cancelled || !mapContainerRef.current) return

      if (!pmtilesProtocolRegistered) {
        const protocol = new Protocol()
        maplibregl.addProtocol('pmtiles', protocol.tile)
        pmtilesProtocolRegistered = true
      }

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: createProtomapsStyle(sourceUrl),
        center: INDIA_CENTER,
        zoom: INDIA_ZOOM,
        pitch: 0,
        bearing: 0,
        minZoom: 2.8,
        maxZoom: 8,
        maxBounds: [
          [62, 4],
          [100, 39],
        ],
        attributionControl: false,
      })
      mapRef.current = map
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: 'Protomaps PMTiles / MapLibre / Published reports only',
        }),
        'bottom-left',
      )

      markerRef.current = signals.map((signal) => {
        const element = createIndiaMapMarkerElement(signal)
        element.addEventListener('mouseenter', () => setSelectedSignal(signal))
        element.addEventListener('click', () => setSelectedSignal(signal))
        return new maplibregl.Marker({ element, anchor: 'center' }).setLngLat([signal.longitude, signal.latitude]).addTo(map!)
      })
    }

    mountMap()

    return () => {
      cancelled = true
      removeIndiaMapMarkers(markerRef.current)
      markerRef.current = []
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [mounted, pmtilesUrl, signals])

  if (!mounted) {
    return <IndiaMapLoading />
  }

  if (!pmtilesUrl) {
    return <IndiaMapFallback activeCount={activeCount} />
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#06111d] shadow-2xl shadow-slate-950/20">
      <div ref={mapContainerRef} className="h-full w-full" aria-label="PULSE-R24 India Protomaps city signal map" />

      <IndiaMapControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onReset={() => mapRef.current?.easeTo({ center: INDIA_CENTER, zoom: INDIA_ZOOM, pitch: 0, bearing: 0 })}
        onSet2d={() => mapRef.current?.easeTo({ pitch: 0, bearing: 0 })}
        onSet3d={() => mapRef.current?.easeTo({ pitch: 35, bearing: 0 })}
      />

      <IndiaMapLegend />

      {selectedSignal && (
        <>
          <div className="absolute right-4 top-20 z-30 hidden md:block">
            <IndiaMapPopup signal={selectedSignal} />
          </div>
          <IndiaMapMobileSheet signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
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
        .maplibregl-ctrl-bottom-left {
          z-index: 20;
        }
        .maplibregl-ctrl-attrib {
          border: 1px solid rgba(148, 163, 184, 0.35) !important;
          background: rgba(2, 6, 23, 0.9) !important;
          color: #cbd5e1 !important;
          box-shadow: none !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #e2e8f0 !important;
        }
        .map-control-mode,
        .map-control-icon {
          display: inline-flex;
          height: 1.75rem;
          min-width: 1.75rem;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(15, 23, 42, 0.76);
          padding: 0 0.45rem;
          color: #e2e8f0;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          transition: background 160ms ease;
        }
        .map-control-mode:hover,
        .map-control-icon:hover {
          background: rgba(139, 0, 0, 0.55);
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
