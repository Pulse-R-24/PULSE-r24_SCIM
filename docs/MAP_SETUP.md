# PULSE-R24 Protomaps / MapLibre India Map Setup

The public homepage India map uses MapLibre GL JS with PMTiles protocol support.
PULSE-R24 report data still comes only from existing public-safe `PUBLISHED` reports.

No external live news APIs are used.
No RSS, AI, OSINT automation, realtime feed, threat correlation, Redis, or risk scoring is used.

## Runtime Source

Set this public environment variable when a Protomaps-compatible PMTiles file is available:

```env
NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL=https://your-host.example/maps/india_z7.pmtiles
```

The value is public because browser-side MapLibre reads the PMTiles file directly.
Do not put secrets or API keys in this value.

## Supabase Storage Option

For the current PULSE-R24 setup, the recommended demo path is a separate public Supabase Storage bucket named `maps`.

Do not upload map files to the private `evidence` bucket. Evidence storage remains private. The `maps` bucket is intentionally public because browser-side MapLibre must fetch the PMTiles file directly.

Step 1: create a public bucket.

```text
Supabase Dashboard -> Storage -> New bucket -> maps -> Public
```

Step 2: upload the generated map file.

```text
india_z7.pmtiles
```

Step 3: copy the public URL.

It should look like:

```text
https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/maps/india_z7.pmtiles
```

Step 4: add the URL to `.env`.

```env
NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL="https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/maps/india_z7.pmtiles"
```

Step 5: restart the dev server so Next.js reloads the public environment variable.

```bash
npm run dev
```

## Local PMTiles Option

Large PMTiles files must not be committed to this repository.

For local development, place a generated India PMTiles file in a public/static hosting location, for example:

```text
apps/web/public/maps/india_z7.pmtiles
```

Then set:

```env
NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL=/maps/india_z7.pmtiles
```

Only use this for reasonably sized local/demo files. For production, host the file in object storage or CDN with HTTP range-request support.

## Generate Or Extract India PMTiles

Recommended Protomaps workflow:

1. Obtain or generate a Protomaps-compatible PMTiles basemap.
2. Clip/extract the India region using Protomaps tooling or a compatible tile build workflow.
3. Host the `.pmtiles` file somewhere browser-accessible.
4. Confirm the host supports HTTP range requests.
5. Set `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL`.

Approximate India bounds:

```text
68.0,6.0,98.0,38.0
```

Example extraction command:

```bash
pmtiles extract world.pmtiles india_z7.pmtiles --bounds "68.0,6.0,98.0,38.0" --maxzoom=7
```

Do not commit `.pmtiles` files. They are intentionally ignored by `.gitignore`.

Reference documentation:

- Protomaps PMTiles for MapLibre: `https://docs.protomaps.com/pmtiles/maplibre`
- PMTiles concepts: `https://docs.protomaps.com/pmtiles/`
- MapLibre GL JS: `https://maplibre.org/maplibre-gl-js/docs/`

## Fallback Behavior

If `NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL` is not set, the homepage does not draw a fake India map, SVG map, or abstract radar surface.

Instead, it shows a professional configuration fallback:

- `Map tiles are not configured.`
- `Set NEXT_PUBLIC_PROTOMAPS_PM_TILES_URL to enable the live India map.`
- count of public-safe published PULSE-R24 briefs ready for marker display
- reminder that no external news feeds or paid API keys are used

This keeps the public homepage honest until a Protomaps-compatible PMTiles file is available.

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
