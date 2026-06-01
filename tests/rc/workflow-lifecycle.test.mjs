import test from 'node:test'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('workflow service covers the full report lifecycle', () => {
  const service = readRepoFile('modules/workflow/services/workflowService.ts')

  for (const contract of [
    'SUBMIT_FOR_REVIEW',
    'APPROVE',
    'REJECT',
    'REQUEST_CHANGES',
    'PUBLISH',
    'ARCHIVE',
    'sendNotification',
    'logActivity',
    'completeActiveReviewAssignments'
  ]) {
    assertIncludes(service, contract, 'workflow service')
  }
})

test('workflow API routes enforce action-specific permissions', () => {
  const approve = readRepoFile('apps/web/src/app/api/reports/workflow/approve/route.ts')
  const reject = readRepoFile('apps/web/src/app/api/reports/workflow/reject/route.ts')
  const changes = readRepoFile('apps/web/src/app/api/reports/workflow/request-changes/route.ts')
  const publish = readRepoFile('apps/web/src/app/api/reports/workflow/publish/route.ts')
  const archive = readRepoFile('apps/web/src/app/api/reports/workflow/archive/route.ts')

  assertIncludes(approve, "requirePermission(session, 'can_approve_reports')", 'approve route')
  assertIncludes(reject, "requirePermission(session, 'can_review_reports')", 'reject route')
  assertIncludes(changes, "requirePermission(session, 'can_review_reports')", 'request changes route')
  assertIncludes(publish, "requirePermission(session, 'can_publish_reports')", 'publish route')
  assertIncludes(archive, "requirePermission(session, 'can_archive_reports')", 'archive route')
})
