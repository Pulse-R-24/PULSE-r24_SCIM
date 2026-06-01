import test from 'node:test'
import assert from 'node:assert/strict'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('RBAC roles include demo workflow permissions', () => {
  const rbac = readRepoFile('packages/auth/src/rbac.ts')
  for (const permission of [
    'can_view_reports',
    'can_create_reports',
    'can_edit_reports',
    'can_submit_reports',
    'can_review_reports',
    'can_approve_reports',
    'can_publish_reports',
    'can_archive_reports',
    'can_view_evidence',
    'can_upload_evidence'
  ]) {
    assertIncludes(rbac, permission, 'RBAC')
  }

  assert.match(rbac, /\[RoleName\.SUPER_ADMIN\][\s\S]*can_archive_reports/)
  assert.match(rbac, /\[RoleName\.FACT_CHECKER\][\s\S]*can_review_reports/)
  assert.match(rbac, /\[RoleName\.PUBLISHER\][\s\S]*can_publish_reports/)
})

test('report list/detail API requires authentication and report view permission', () => {
  const route = readRepoFile('apps/web/src/app/api/reports/route.ts')
  assertIncludes(route, 'getServerSessionFromRequest(req)', 'reports API')
  assertIncludes(route, "requirePermission(session, 'can_view_reports')", 'reports API')
})
