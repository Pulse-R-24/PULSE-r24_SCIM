import type { PublicReportSummary } from '@modules/reports/types'

export type IndiaSignalLevel = 'none' | 'low' | 'medium' | 'high'

export interface IndiaCityBrief {
  title: string
  slug: string
  published_at: string
  categoryName: string
  excerpt: string
}

export interface IndiaCitySignal {
  city: string
  state: string
  longitude: number
  latitude: number
  briefs: IndiaCityBrief[]
  level: IndiaSignalLevel
}

export const indiaTierOneCities = [
  {
    city: 'Delhi',
    state: 'Delhi',
    longitude: 77.209,
    latitude: 28.6139,
    keywords: ['delhi', 'new delhi', 'ncr', 'gurugram', 'gurgaon', 'noida'],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    longitude: 72.8777,
    latitude: 19.076,
    keywords: ['mumbai', 'bombay', 'thane', 'navi mumbai'],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    longitude: 77.5946,
    latitude: 12.9716,
    keywords: ['bengaluru', 'bangalore', 'karnataka'],
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    longitude: 80.2707,
    latitude: 13.0827,
    keywords: ['chennai', 'madras', 'tamil nadu', 'tamilnadu'],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    longitude: 78.4867,
    latitude: 17.385,
    keywords: ['hyderabad', 'telangana', 'secunderabad'],
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    longitude: 88.3639,
    latitude: 22.5726,
    keywords: ['kolkata', 'calcutta', 'west bengal'],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    longitude: 73.8567,
    latitude: 18.5204,
    keywords: ['pune', 'maharashtra'],
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    longitude: 72.5714,
    latitude: 23.0225,
    keywords: ['ahmedabad', 'amdavad', 'gujarat'],
  },
] as const

function getLevel(count: number): IndiaSignalLevel {
  if (count === 0) return 'none'
  if (count <= 2) return 'low'
  if (count <= 5) return 'medium'
  return 'high'
}

function toHaystack(report: PublicReportSummary) {
  return [
    report.title,
    report.excerpt,
    report.category?.name,
    report.byline,
    ...report.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function toBrief(report: PublicReportSummary): IndiaCityBrief {
  return {
    title: report.title,
    slug: report.slug,
    published_at: report.published_at,
    categoryName: report.category?.name ?? 'Published Brief',
    excerpt: report.excerpt,
  }
}

export function buildIndiaCitySignals(reports: PublicReportSummary[]): IndiaCitySignal[] {
  const matchedSlugs = new Set<string>()
  const signals = indiaTierOneCities.map((city) => {
    const briefs = reports.filter((report) => {
      const haystack = toHaystack(report)
      return city.keywords.some((keyword) => haystack.includes(keyword))
    })

    briefs.forEach((report) => matchedSlugs.add(report.slug))

    return {
      city: city.city,
      state: city.state,
      longitude: city.longitude,
      latitude: city.latitude,
      briefs: briefs.map(toBrief),
      level: getLevel(briefs.length),
    }
  })

  // If reports do not contain a city keyword yet, distribute a few published
  // briefs across major metros so the public map still previews real workflow data.
  reports
    .filter((report) => !matchedSlugs.has(report.slug))
    .slice(0, 8)
    .forEach((report, index) => {
      const target = signals[index % Math.min(signals.length, 4)]
      if (!target) return
      target.briefs.push(toBrief(report))
      target.level = getLevel(target.briefs.length)
    })

  return signals
}
