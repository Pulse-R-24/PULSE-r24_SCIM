'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type * as Leaflet from 'leaflet'
import type { PublicReportSummary } from '@modules/reports/types'
import { createCityNewsMarker } from '@/components/public/CityNewsMarker'
import { addIndiaStateLayer } from '@/components/public/IndiaStateLayer'
import { LiveNewsLegend } from '@/components/public/LiveNewsLegend'
import { LiveNewsPopup } from '@/components/public/LiveNewsPopup'
import { MapMobileSheet } from '@/components/public/MapMobileSheet'
import { buildCitySignals, type CitySignal } from '@/components/public/indiaSignalMapData'

export function IndiaLiveNewsMap({ reports, compact = false }: { reports: PublicReportSummary[]; compact?: boolean }) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const [selectedSignal, setSelectedSignal] = useState<CitySignal | null>(null)
  const signals = useMemo(() => buildCitySignals(reports), [reports])
  const activeSignals = signals.filter((signal) => signal.reports.length > 0)
  const totalBriefs = activeSignals.reduce((sum, signal) => sum + signal.reports.length, 0)

  useEffect(() => {
    let cancelled = false
    let localMap: Leaflet.Map | null = null

    async function mountMap() {
      if (!mapElementRef.current || mapRef.current) return
      const leaflet = await import('leaflet')
      if (cancelled || !mapElementRef.current) return

      localMap = leaflet.map(mapElementRef.current, {
        attributionControl: false,
        center: [22.8, 79.4],
        zoom: 4.35,
        zoomSnap: 0.1,
        minZoom: 3.6,
        maxZoom: 7,
        maxBounds: [
          [5.5, 66],
          [37.5, 98],
        ],
        maxBoundsViscosity: 0.8,
        scrollWheelZoom: false,
      })
      mapRef.current = localMap

      addIndiaStateLayer(localMap, leaflet)

      signals.forEach((signal) => {
        createCityNewsMarker({
          leaflet,
          signal,
          onSelect: setSelectedSignal,
        }).addTo(localMap!)
      })

      leaflet.control.attribution({ prefix: false }).addAttribution('Leaflet | India GeoJSON | Published reports only').addTo(localMap)
    }

    mountMap()

    return () => {
      cancelled = true
      if (localMap) {
        localMap.remove()
        mapRef.current = null
      }
    }
  }, [signals])

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#090b10] text-white shadow-2xl shadow-slate-950/20">
      <div className={`relative overflow-hidden rounded-2xl bg-[#0b1018] ${compact ? 'h-[380px] md:h-[500px]' : 'h-[360px] md:h-[480px]'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(139,0,0,0.2),transparent_30%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_100%,42px_42px,42px_42px]" />
        <div ref={mapElementRef} className="relative z-10 h-full w-full" aria-label="India city signal map using published PULSE-R24 briefs" />

        <div className="absolute left-4 top-4 z-[440] rounded-lg border border-slate-700/70 bg-slate-950/90 p-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            India City Signals
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase text-slate-500">
            {totalBriefs} Published PULSE-R24 Briefs
          </p>
        </div>

        <LiveNewsLegend />

        {selectedSignal && (
          <div className="absolute right-4 top-4 z-[450] hidden w-[24rem] md:block">
            <LiveNewsPopup signal={selectedSignal} />
          </div>
        )}
      </div>

      <MapMobileSheet signal={selectedSignal} onClose={() => setSelectedSignal(null)} />

      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          background: transparent;
          font-family: inherit;
          outline: none;
          overflow: hidden;
        }
        .leaflet-pane,
        .leaflet-tile,
        .leaflet-marker-icon,
        .leaflet-marker-shadow,
        .leaflet-tile-container,
        .leaflet-overlay-pane svg,
        .leaflet-overlay-pane,
        .leaflet-shadow-pane,
        .leaflet-marker-pane,
        .leaflet-tooltip-pane,
        .leaflet-popup-pane {
          position: absolute;
          left: 0;
          top: 0;
        }
        .leaflet-control-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 500;
        }
        .leaflet-control {
          pointer-events: auto;
        }
        .leaflet-control-zoom {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(2, 6, 23, 0.92);
        }
        .leaflet-control-zoom a {
          display: flex;
          height: 2rem;
          width: 2rem;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(148, 163, 184, 0.35);
          color: white;
          font-size: 1rem;
          font-weight: 900;
          text-decoration: none;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: 0;
        }
        .leaflet-control-attribution {
          position: absolute;
          bottom: 0.25rem;
          left: 0.5rem;
          border-radius: 0.2rem;
          background: rgba(255, 255, 255, 0.84);
          padding: 0.1rem 0.35rem;
          color: #334155;
          font-size: 0.55rem;
          font-weight: 700;
        }
        .pulse-map-marker-shell {
          background: transparent;
          border: 0;
        }
        .pulse-map-marker {
          position: relative;
          display: flex;
          height: 2.125rem;
          width: 2.125rem;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          cursor: pointer;
        }
        .pulse-map-marker-ping {
          position: absolute;
          inset: 0.2rem;
          border-radius: 9999px;
          opacity: 0.55;
          animation: pulse-city-marker 1.9s ease-out infinite;
        }
        .pulse-map-marker-dot {
          position: relative;
          z-index: 1;
          display: flex;
          height: 1.25rem;
          width: 1.25rem;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.82);
          color: white;
          font-size: 0.58rem;
          font-weight: 900;
          box-shadow: 0 0 24px rgba(225, 29, 72, 0.65);
        }
        .pulse-map-marker-none .pulse-map-marker-ping {
          display: none;
        }
        .pulse-map-marker-none .pulse-map-marker-dot {
          background: #64748b;
          box-shadow: 0 0 14px rgba(100, 116, 139, 0.45);
        }
        .pulse-map-marker-low .pulse-map-marker-ping,
        .pulse-map-marker-low .pulse-map-marker-dot {
          background: #10b981;
        }
        .pulse-map-marker-medium .pulse-map-marker-ping,
        .pulse-map-marker-medium .pulse-map-marker-dot {
          background: #f59e0b;
        }
        .pulse-map-marker-high .pulse-map-marker-ping,
        .pulse-map-marker-high .pulse-map-marker-dot {
          background: #8b0000;
        }
        @keyframes pulse-city-marker {
          0% {
            transform: scale(0.8);
            opacity: 0.75;
          }
          100% {
            transform: scale(2.45);
            opacity: 0;
          }
        }
        .pulse-map-popup-shell .leaflet-popup-content-wrapper {
          border: 1px solid rgba(15, 23, 42, 0.12);
          background: white;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.25);
        }
        .leaflet-popup {
          position: absolute;
          text-align: left;
        }
        .leaflet-popup-content-wrapper {
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          width: 360px;
        }
        .leaflet-popup-tip-container,
        .leaflet-popup-close-button {
          display: none;
        }
        .pulse-map-popup {
          background: #f8fafc;
          padding: 0.75rem;
          color: #0f172a;
        }
        .pulse-popup-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.7rem;
        }
        .pulse-popup-header p,
        .pulse-popup-label {
          color: #8b0000;
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .pulse-popup-header h3 {
          margin-top: 0.2rem;
          font-family: var(--font-editorial), Georgia, serif;
          font-size: 1.35rem;
          font-weight: 900;
          line-height: 1;
        }
        .pulse-popup-header span,
        .pulse-popup-meta {
          color: #64748b;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pulse-popup-header strong {
          border: 1px solid rgba(139, 0, 0, 0.15);
          padding: 0.25rem 0.45rem;
          color: #8b0000;
          text-align: center;
        }
        .pulse-popup-header small {
          display: block;
          color: #94a3b8;
          font-size: 0.48rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pulse-popup-list {
          margin-top: 0.7rem;
          display: grid;
          gap: 0.5rem;
        }
        .pulse-popup-card {
          display: grid;
          grid-template-columns: 4rem minmax(0, 1fr);
          gap: 0.65rem;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 0.45rem;
        }
        .pulse-popup-thumb {
          display: flex;
          min-height: 3.8rem;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(139, 0, 0, 0.2), transparent 58%), linear-gradient(135deg, #080d20, #172033);
          color: #fecdd3;
          font-size: 0.5rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .pulse-popup-card h4 {
          margin-top: 0.18rem;
          color: #0f172a;
          font-family: var(--font-editorial), Georgia, serif;
          font-size: 0.95rem;
          font-weight: 900;
          line-height: 1.05;
        }
        .pulse-popup-card a {
          margin-top: 0.35rem;
          display: inline-flex;
          color: #8b0000;
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .pulse-popup-empty {
          border: 1px dashed #cbd5e1;
          background: white;
          padding: 0.9rem;
          color: #64748b;
          font-size: 0.8rem;
          line-height: 1.5;
        }
      `}</style>
    </section>
  )
}
