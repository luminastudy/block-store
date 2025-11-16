/**
 * GitLab API service for fetching lumina.json
 */

import { Gitlab } from '@gitbeaker/rest'
import type { LuminaConfig, GitProviderError } from '../types.js'

/**
 * Fetches lumina.json from a GitLab repository
 *
 * @param organization - GitLab group or user name
 * @param repository - Repository (project) name
 * @param token - Optional GitLab personal access token for private repos
 * @returns Object containing the config and commit SHA
 * @throws Error if the file doesn't exist or API call fails
 */
export async function fetchLuminaConfigFromGitLab(
  organization: string,
  repository: string,
  token?: string
): Promise<{ config: LuminaConfig; commitSha: string }> {
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

    // Decode the base64 content
    const content = Buffer.from(file.content, 'base64').toString('utf-8')
    const config = JSON.parse(content) as LuminaConfig

    // Get the latest commit for this file
    const commits = await gitlab.Commits.all(projectId, {
      path: 'lumina.json',
      perPage: 1,
    })

    if (commits.length === 0) {
      throw new Error('No commits found for lumina.json')
    }

    const commitSha = commits[0].id

    return { config, commitSha }
  } catch (error) {
    const gitError: GitProviderError = {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error fetching from GitLab',
      status: (error as { response?: { status?: number } }).response?.status,
    }

    throw new Error(
      `Failed to fetch lumina.json from GitLab (${organization}/${repository}): ${gitError.message}`
    )
  }
}
