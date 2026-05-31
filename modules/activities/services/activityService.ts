import * as repo from '../repositories/activityRepository'

export async function logActivity(actorId: string | undefined, action: string, entityType: string, entityId?: string, meta?: Record<string, unknown>) {
  return repo.createActivityRecord({ actorId, action, entityType, entityId, meta })
}

export async function getActivityFeed(opts?: repo.ActivityFeedFilters) {
  return repo.findActivityFeed(opts)
}
