/**
 * GitLab API service for fetching lumina.json files
 */

import { Gitlab } from '@gitbeaker/rest'
import type { LuminaJson } from '../types/LuminaJson.js'
import { GitProviderError } from '../errors/GitProviderError.js'
import { ValidationError } from '../errors/ValidationError.js'
import { NotFoundError } from '../errors/NotFoundError.js'

/**
 * Fetches lumina.json from a GitLab repository
 *
 * @param organization - GitLab group or user name
 * @param repository - Repository (project) name
 * @param token - Optional GitLab personal access token for private repos
 * @returns Object containing the parsed lumina.json and commit SHA
 * @throws Error if the file doesn't exist or API call fails
 */
export async function fetchLuminaJsonFromGitLab(
  organization: string,
  repository: string,
  token?: string
): Promise<{ luminaJson: LuminaJson; commitSha: string }> {
  const gitlab = new Gitlab(
    token
      ? {
          token,
        }
      : {}
  )

  try {
    // Construct the project ID (group/repo format)
    const projectId = `${organization}/${repository}`

    // Fetch the file content from the repository
    const file = await gitlab.RepositoryFiles.show(
      projectId,
      'lumina.json',
      'HEAD'
    )

    const content = Buffer.from(file.content, 'base64').toString('utf-8')
    const parsedContent = JSON.parse(content)

    const isValidLuminaJson =
      parsedContent &&
      typeof parsedContent === 'object' &&
      'blocks' in parsedContent &&
      Array.isArray(parsedContent.blocks)

    if (!isValidLuminaJson) {
      throw new ValidationError(
        'Invalid lumina.json format: missing or invalid blocks array'
      )
    }

    const luminaJson: LuminaJson = parsedContent

    // Get the latest commit for this file
    const commits = await gitlab.Commits.all(projectId, {
      path: 'lumina.json',
      perPage: 1,
    })

    if (commits.length === 0) {
      throw new NotFoundError('No commits found for lumina.json')
    }

    const firstCommit = commits[0]
    const commitSha = firstCommit ? firstCommit.id : ''
    if (!commitSha) {
      throw new NotFoundError('Commit has no ID')
    }

    return { luminaJson, commitSha }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error fetching from GitLab'

    let status: number | undefined
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      typeof error.response.status === 'number'
    ) {
      status = error.response.status
    }

    throw new GitProviderError(
      `Failed to fetch lumina.json from GitLab (${organization}/${repository}): ${message}`,
      status
    )
  }
}
