import * as repo from '../repositories/dashboardRepository'

export async function getDashboardSummary(userId: string) {
  return repo.getDashboardSummary(userId)
}
