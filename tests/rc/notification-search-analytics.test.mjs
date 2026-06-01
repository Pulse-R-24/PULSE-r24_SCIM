import test from 'node:test'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('notifications are scoped to the logged-in user', () => {
  const route = readRepoFile('apps/web/src/app/api/notifications/route.ts')
  assertIncludes(route, 'getUserNotifications(session.user.id)', 'notifications API')
  assertIncludes(route, 'markNotificationAsRead(body.id, session.user.id)', 'notifications API')
  assertIncludes(route, 'markAllAsRead(session.user.id)', 'notifications API')
})

test('global search validates filters and searches all MVP result domains', () => {
  const route = readRepoFile('apps/web/src/app/api/search/route.ts')
  const repository = readRepoFile('modules/search/repositories/searchRepository.ts')

  assertIncludes(route, 'searchQuerySchema', 'search route')
  assertIncludes(route, "requirePermission(session, 'can_view_reports')", 'search route')
  for (const model of ['prisma.report.findMany', 'prisma.evidence.findMany', 'prisma.workflowHistory.findMany', 'prisma.activityFeed.findMany']) {
    assertIncludes(repository, model, 'search repository')
  }
})

test('analytics endpoint validates filters and enforces report visibility', () => {
  const route = readRepoFile('apps/web/src/app/api/analytics/route.ts')
  const repository = readRepoFile('modules/analytics/repositories/analyticsRepository.ts')

  assertIncludes(route, 'analyticsQuerySchema', 'analytics route')
  assertIncludes(route, "requirePermission(session, 'can_view_reports')", 'analytics route')
  for (const contract of ['reportsCreatedOverTime', 'reportsByWorkflowStatus', 'reviewOutcomes', 'evidenceByType', 'activityCountOverTime']) {
    assertIncludes(repository, contract, 'analytics repository')
  }
})
