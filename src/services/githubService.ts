/**
 * GitHub API service for fetching lumina.json files
 */

import { Octokit } from '@octokit/rest'
import type { LuminaJson } from '../types/LuminaJson.js'
import { GitProviderError } from '../errors/GitProviderError.js'
import { fetchConfigFile } from './helpers/fetchConfigFile.js'
import { decodeBase64Content } from './helpers/decodeBase64Content.js'
import { parseAndValidateLuminaJson } from './helpers/parseAndValidateLuminaJson.js'
import { validateFileData } from './helpers/validateFileData.js'
import { getCommitSha } from './helpers/getCommitSha.js'

/**
 * Fetches lumina.json from a GitHub repository
 *
 * @param organization - GitHub organization or user name
 * @param repository - Repository name
 * @param token - Optional GitHub personal access token for private repos
 * @returns Object containing the parsed lumina.json and commit SHA
 * @throws GitProviderError if the file doesn't exist or API call fails
 */
export async function fetchLuminaJsonFromGitHub(
  organization: string,
  repository: string,
  token?: string
): Promise<{ luminaJson: LuminaJson; commitSha: string }> {
  const octokit = new Octokit({
    auth: token,
  })

  try {
    const { data: repoData } = await octokit.repos.get({
      owner: organization,
      repo: repository,
    })

    const defaultBranch = repoData.default_branch

    const { data, filename } = await fetchConfigFile(
      octokit,
      organization,
      repository,
      defaultBranch,
      ['lumina.json']
    )

    const contentValue = validateFileData(data, filename)
    const commitSha = await getCommitSha(
      octokit,
      organization,
      repository,
      filename
    )
    const content = decodeBase64Content(contentValue)
    const luminaJson = parseAndValidateLuminaJson(content, filename)

    return { luminaJson, commitSha }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error fetching from GitHub'

    let status: number | undefined
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof error.status === 'number'
    ) {
      status = error.status
    }

    throw new GitProviderError(
      `Failed to fetch lumina.json from GitHub (${organization}/${repository}): ${message}`,
      status
    )
  }
}
