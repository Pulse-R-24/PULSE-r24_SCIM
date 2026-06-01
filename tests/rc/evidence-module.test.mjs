import test from 'node:test'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('evidence APIs enforce evidence/report permissions', () => {
  const libraryRoute = readRepoFile('apps/web/src/app/api/evidence/route.ts')
  const reportRoute = readRepoFile('apps/web/src/app/api/reports/[id]/evidence/route.ts')
  assertIncludes(libraryRoute, "requirePermission(session, 'can_view_evidence')", 'evidence library route')
  assertIncludes(reportRoute, "requirePermission(session, 'can_edit_reports')", 'report evidence route')
})

test('upload flow validates signed URL payloads, MIME, magic bytes, and size', () => {
  const validator = readRepoFile('modules/uploads/validators/uploadValidator.ts')
  const service = readRepoFile('modules/uploads/services/uploadService.ts')
  const storage = readRepoFile('packages/storage/src/uploadService.ts')

  assertIncludes(validator, 'max(300)', 'upload validator')
  assertIncludes(service, 'validateMimeAndMagic', 'upload service')
  assertIncludes(service, 'buffer.length !== parsed.size', 'upload service')
  assertIncludes(storage, 'fileTypeFromBuffer', 'storage upload service')
})
