/**
 * Attempts to fetch a file from the repository, trying multiple filenames
 */

import type { Octokit } from '@octokit/rest'
import { NotFoundError } from '../../errors/NotFoundError.js'

export async function fetchConfigFile(
  octokit: Octokit,
  organization: string,
  repository: string,
  defaultBranch: string,
  filenames: string[]
): Promise<{ data: unknown; filename: string }> {
  for (const tryFilename of filenames) {
    try {
      const response = await octokit.repos.getContent({
        owner: organization,
        repo: repository,
        path: tryFilename,
        ref: defaultBranch,
      })
      return { data: response.data, filename: tryFilename }
    } catch (error) {
      const errorWithStatus = error
      const hasStatus =
        errorWithStatus &&
        typeof errorWithStatus === 'object' &&
        'status' in errorWithStatus
      if (hasStatus && errorWithStatus.status === 404) {
        continue
      }
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  throw new NotFoundError('lumina.json not found in repository')
}
