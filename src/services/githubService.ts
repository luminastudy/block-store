/**
 * GitHub API service for fetching lumina.json files
 */

import { Octokit } from '@octokit/rest'
import type { LuminaJson, GitProviderError } from '../types.js'

/**
 * Fetches lumina.json from a GitHub repository
 *
 * @param organization - GitHub organization or user name
 * @param repository - Repository name
 * @param token - Optional GitHub personal access token for private repos
 * @returns Object containing the parsed lumina.json and commit SHA
 * @throws Error if the file doesn't exist or API call fails
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
    // Get the default branch first
    const { data: repoData } = await octokit.repos.get({
      owner: organization,
      repo: repository,
    })

    const defaultBranch = repoData.default_branch

    // Fetch lumina.json from the root of the repository
    const { data } = await octokit.repos.getContent({
      owner: organization,
      repo: repository,
      path: 'lumina.json',
      ref: defaultBranch,
    })

    // Ensure we got a file, not a directory
    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error('lumina.json is not a file')
    }

    // Get the latest commit SHA for this file
    const { data: commits } = await octokit.repos.listCommits({
      owner: organization,
      repo: repository,
      path: 'lumina.json',
      per_page: 1,
    })

    if (commits.length === 0) {
      throw new Error('No commits found for lumina.json')
    }

    const commitSha = commits[0].sha

    // Decode the base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const luminaJson = JSON.parse(content) as LuminaJson

    // Validate that it has the blocks array
    if (!luminaJson.blocks || !Array.isArray(luminaJson.blocks)) {
      throw new Error(
        'Invalid lumina.json format: missing or invalid blocks array'
      )
    }

    return { luminaJson, commitSha }
  } catch (error) {
    const gitError: GitProviderError = {
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error fetching from GitHub',
      status: (error as { status?: number }).status,
    }

    throw new Error(
      `Failed to fetch lumina.json from GitHub (${organization}/${repository}): ${gitError.message}`
    )
  }
}
