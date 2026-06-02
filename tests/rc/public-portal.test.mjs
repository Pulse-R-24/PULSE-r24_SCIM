import assert from 'node:assert/strict'
import test from 'node:test'
import { assertIncludes, readRepoFile } from './helpers.mjs'

test('public report repository exposes only published non-deleted reports', () => {
  const repository = readRepoFile('modules/reports/repositories/reportRepository.ts')

  for (const contract of [
    'listPublishedReportsForPublic',
    "deleted_at: null",
    "status: { key: 'PUBLISHED' }",
    'findPublishedReportBySlug'
  ]) {
    assertIncludes(repository, contract, 'public report repository')
  }

  const publicSection = repository.slice(repository.indexOf('const publicReportInclude'))
  for (const privateRelation of ['evidence:', 'assignments:', 'comments:', 'audit']) {
    assert.equal(
      publicSection.includes(privateRelation),
      false,
      `public report include must not expose ${privateRelation}`
    )
  }
})

test('public routes use public report services instead of authenticated dashboard services', () => {
  const routeFiles = [
    'apps/web/src/app/page.tsx',
    'apps/web/src/app/news/page.tsx',
    'apps/web/src/app/news/[slug]/page.tsx',
    'apps/web/src/app/category/[slug]/page.tsx',
    'apps/web/src/app/latest/page.tsx',
    'apps/web/src/app/public-search/page.tsx'
  ]

  for (const routeFile of routeFiles) {
    const source = readRepoFile(routeFile)
    assertIncludes(source, '@modules/reports/services/reportService', routeFile)
    assert.equal(source.includes('getServerSession'), false, `${routeFile} should not require auth`)
    assert.equal(source.includes('@/auth'), false, `${routeFile} should not import private auth helpers`)
  }
})
