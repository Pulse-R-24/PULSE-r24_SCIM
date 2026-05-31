import * as repo from '../repositories/searchRepository'
import type { GlobalSearchInput } from '../types'

export async function globalSearch(input: GlobalSearchInput) {
  return repo.globalSearch(input)
}
