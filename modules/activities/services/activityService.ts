import * as repo from '../repositories/activityRepository'

export async function logActivity(actorId: string | undefined, action: string, entityType: string, entityId?: string, meta?: any) {
  return repo.createActivityRecord({ actorId, action, entityType, entityId, meta })
}

export async function getActivityFeed(opts?: { take?: number; skip?: number }) {
  return repo.findActivityFeed(opts)
}
