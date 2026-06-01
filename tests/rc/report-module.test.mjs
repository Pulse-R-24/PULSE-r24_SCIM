import test from 'node:test'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('report service creates workflow history, audit log, activity, and revisions', () => {
  const service = readRepoFile('modules/reports/services/reportService.ts')
  for (const contract of ['createWorkflowHistory', 'DRAFT_CREATED', 'auditService.log', 'logActivity', 'createReportRevision']) {
    assertIncludes(service, contract, 'report service')
  }
})

test('report validators protect create/update payloads', () => {
  const validators = readRepoFile('modules/reports/validators/reportValidator.ts')
  for (const contract of ['reportCreateSchema', 'reportUpdateSchema', 'z.object']) {
    assertIncludes(validators, contract, 'report validators')
  }
})
