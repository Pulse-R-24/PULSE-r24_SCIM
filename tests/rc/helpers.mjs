import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))

export function readRepoFile(path) {
  return readFileSync(resolve(root, path), 'utf8')
}

export function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label || 'source'} is missing expected contract: ${expected}`)
  }
}
