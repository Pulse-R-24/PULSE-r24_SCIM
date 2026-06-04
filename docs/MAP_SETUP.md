# PULSE-R24 Protomaps / MapLibre India Map Setup

The public homepage India map uses MapLibre GL JS with PMTiles protocol support.
PULSE-R24 report data still comes only from existing public-safe `PUBLISHED` reports.

No external live news APIs are used.
No RSS, AI, OSINT automation, realtime feed, threat correlation, Redis, or risk scoring is used.

## Runtime Source

Set this public environment variable when a Protomaps-compatible PMTiles file is available:

```env
NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL=https://your-host.example/maps/india.pmtiles
```

The value is public because browser-side MapLibre reads the PMTiles file directly.
Do not put secrets or API keys in this value.

## Local PMTiles Option

Large PMTiles files must not be committed to this repository.

For local development, place a generated India PMTiles file in a public/static hosting location, for example:

```text
apps/web/public/maps/india.pmtiles
```

Then set:

```env
NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL=/maps/india.pmtiles
```

Only use this for reasonably sized local/demo files. For production, host the file in object storage or CDN with HTTP range-request support.

## Generate Or Extract India PMTiles

Recommended Protomaps workflow:

1. Obtain or generate a Protomaps-compatible PMTiles basemap.
2. Clip/extract the India region using Protomaps tooling or a compatible tile build workflow.
3. Host the `.pmtiles` file somewhere browser-accessible.
4. Confirm the host supports HTTP range requests.
5. Set `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL`.

Reference documentation:

- Protomaps PMTiles for MapLibre: `https://docs.protomaps.com/pmtiles/maplibre`
- PMTiles concepts: `https://docs.protomaps.com/pmtiles/`
- MapLibre GL JS: `https://maplibre.org/maplibre-gl-js/docs/`

## Fallback Behavior

If `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` is not set, the homepage still renders a MapLibre-based India fallback layer with:

- dark India-focused background
- India outline
- Tier-1 city markers
- published PULSE-R24 brief popups

The fallback is intended for local demos only and clearly indicates that the Protomaps PMTiles URL should be configured for the full basemap.

## Data Safety

The map markers use only sanitized public report DTO fields:

- title
- slug
- excerpt
- published date
- category name
- tags
- byline/read-time metadata already exposed publicly

The map never receives:

- private evidence
- workflow comments
- review assignments
- audit logs
- notifications
- activity metadata
- internal user IDs
- unpublished reports

## City Signal Mapping

The current Phase 1 mapping uses simple keyword matching over public report title, excerpt, category, tags, and byline.

Target cities:

- Delhi
- Mumbai
- Bengaluru
- Chennai
- Hyderabad
- Kolkata
- Pune
- Ahmedabad

Marker levels:

- no published briefs: muted/grey
- 1-2 briefs: low
- 3-5 briefs: medium
- 6+ briefs: high
