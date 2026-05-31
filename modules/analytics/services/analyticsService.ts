import * as repo from '../repositories/analyticsRepository'
import type { AnalyticsFilters } from '../types'

export async function getAnalytics(filters: AnalyticsFilters) {
  return repo.getAnalytics(filters)
}
