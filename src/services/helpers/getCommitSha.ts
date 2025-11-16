/**
 * Gets the latest commit SHA for a file
 */

import type { Octokit } from '@octokit/rest'
import { NotFoundError } from '../../errors/NotFoundError.js'

export async function getCommitSha(
  octokit: Octokit,
  organization: string,
  repository: string,
  filename: string
): Promise<string> {
  const { data: commits } = await octokit.repos.listCommits({
    owner: organization,
    repo: repository,
    path: filename,
    per_page: 1,
  })

  if (commits.length === 0) {
    throw new NotFoundError(`No commits found for ${filename}`)
  }

  return commits[0].sha
}
