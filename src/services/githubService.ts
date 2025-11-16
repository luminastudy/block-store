/**
 * GitHub API service for fetching lumina.json files
 */

import { Octokit } from '@octokit/rest'
import type { LuminaJson, GitProviderError } from '../types.js'

/**
 * Attempts to fetch a file from the repository, trying multiple filenames
 */
async function fetchConfigFile(
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
      // If it's a 404, try the next filename
      if ((error as { status?: number }).status === 404) {
        continue
      }
      // If it's another error, re-throw it as an Error object
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  throw new Error('lumina.json not found in repository')
}

/**
 * Decodes base64 content in a browser-compatible way
 */
function decodeBase64Content(content: string): string {
  return decodeURIComponent(
    atob(content)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}

/**
 * Parses and validates the lumina.json content
 */
function parseAndValidateLuminaJson(
  content: string,
  filename: string
): LuminaJson {
  const parsedContent = JSON.parse(content)

  // Handle both formats:
  // 1. Object with blocks property: { blocks: [...] }
  // 2. Array at root level: [...]
  if (Array.isArray(parsedContent)) {
    // If it's a plain array, wrap it as { blocks: array }
    return { blocks: parsedContent }
  }

  if (parsedContent && typeof parsedContent === 'object') {
    // If it's an object, ensure it has a blocks array
    if (!parsedContent.blocks || !Array.isArray(parsedContent.blocks)) {
      throw new Error(
        `Invalid ${filename} format: missing or invalid blocks array`
      )
    }
    return parsedContent as LuminaJson
  }

  throw new Error(
    `Invalid ${filename} format: expected object or array, got ${typeof parsedContent}`
  )
}

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

    // Try fetching lumina.json
    const filenames = ['lumina.json']
    const { data, filename } = await fetchConfigFile(
      octokit,
      organization,
      repository,
      defaultBranch,
      filenames
    )

    // Ensure we got a file, not a directory
    if (Array.isArray(data) || (data as { type?: string }).type !== 'file') {
      throw new Error(`${filename} is not a file`)
    }

    // Get the latest commit SHA for this file
    const { data: commits } = await octokit.repos.listCommits({
      owner: organization,
      repo: repository,
      path: filename,
      per_page: 1,
    })

    if (commits.length === 0) {
      throw new Error(`No commits found for ${filename}`)
    }

    const commitSha = commits[0].sha

    // Decode and parse the content
    const content = decodeBase64Content((data as { content: string }).content)
    const luminaJson = parseAndValidateLuminaJson(content, filename)

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
