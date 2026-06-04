import type { PublicReportSummary } from '@modules/reports/types'

export type SignalIntensity = 'none' | 'low' | 'medium' | 'high'

export interface CitySignalReport {
  title: string
  slug: string
  excerpt: string
  published_at: string
  categoryName: string
  tags: string[]
  byline: string
  readTime: string
}

export interface CitySignal {
  city: string
  state: string
  coordinates: readonly [number, number]
  reports: CitySignalReport[]
  intensity: SignalIntensity
}

export const tierOneCities = [
  {
    city: 'Delhi',
    state: 'Delhi',
    coordinates: [28.6139, 77.209],
    keywords: ['delhi', 'new delhi', 'ncr', 'gurugram', 'gurgaon', 'noida'],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [19.076, 72.8777],
    keywords: ['mumbai', 'bombay', 'thane', 'navi mumbai'],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: [12.9716, 77.5946],
    keywords: ['bengaluru', 'bangalore', 'karnataka'],
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [13.0827, 80.2707],
    keywords: ['chennai', 'madras', 'tamil nadu', 'tamilnadu'],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    coordinates: [17.385, 78.4867],
    keywords: ['hyderabad', 'telangana', 'secunderabad'],
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    coordinates: [22.5726, 88.3639],
    keywords: ['kolkata', 'calcutta', 'west bengal'],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    coordinates: [18.5204, 73.8567],
    keywords: ['pune', 'maharashtra'],
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    coordinates: [23.0225, 72.5714],
    keywords: ['ahmedabad', 'amdavad', 'gujarat'],
  },
] as const

function getIntensity(count: number): SignalIntensity {
  if (count === 0) return 'none'
  if (count >= 4) return 'high'
  if (count >= 2) return 'medium'
  return 'low'
}

function toHaystack(report: PublicReportSummary) {
  return [
    report.title,
    report.excerpt,
    report.category?.name,
    report.byline,
    report.readTime,
    ...report.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function toSignalReport(report: PublicReportSummary): CitySignalReport {
  return {
    title: report.title,
    slug: report.slug,
    excerpt: report.excerpt,
    published_at: report.published_at,
    categoryName: report.category?.name ?? 'Published Brief',
    tags: report.tags,
    byline: report.byline,
    readTime: report.readTime,
  }
}

export function buildCitySignals(reports: PublicReportSummary[]): CitySignal[] {
  const usedSlugs = new Set<string>()
  const signals = tierOneCities.map((city) => {
    const cityReports = reports.filter((report) => {
      const haystack = toHaystack(report)
      return city.keywords.some((keyword) => haystack.includes(keyword))
    })

    cityReports.forEach((report) => usedSlugs.add(report.slug))

    return {
      city: city.city,
      state: city.state,
      coordinates: city.coordinates,
      reports: cityReports.map(toSignalReport),
      intensity: getIntensity(cityReports.length),
    }
  })

  const unmatched = reports.filter((report) => !usedSlugs.has(report.slug))
  if (unmatched.length > 0) {
    const fallbackCities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai']
    unmatched.slice(0, 8).forEach((report, index) => {
      const targetCity = fallbackCities[index % fallbackCities.length]
      const signal = signals.find((item) => item.city === targetCity)
      if (!signal) return
      signal.reports.push(toSignalReport(report))
      signal.intensity = getIntensity(signal.reports.length)
    })
  }

  return signals
}
