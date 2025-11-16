/**
 * Utility functions for block key generation
 */

import type { GitProvider } from '../types.js'

/**
 * Generates a unique key for a block
 *
 * @param provider - Git provider
 * @param organization - Organization name
 * @param repository - Repository name
 * @returns Unique key in format "provider:organization:repository"
 */
export function generateBlockKey(
  provider: GitProvider,
  organization: string,
  repository: string
): string {
  return `${provider}:${organization}:${repository}`
}

/**
 * Parses a block key into its components
 *
 * @param key - Block key in format "provider:organization:repository"
 * @returns Object with provider, organization, and repository
 * @throws Error if the key format is invalid
 */
export function parseBlockKey(key: string): {
  provider: GitProvider
  organization: string
  repository: string
} {
  const parts = key.split(':')
  if (parts.length !== 3) {
    throw new Error(`Invalid block key format: ${key}`)
  }

  const [provider, organization, repository] = parts

  if (provider !== 'github' && provider !== 'gitlab') {
    throw new Error(`Invalid provider in block key: ${provider}`)
  }

  return {
    provider,
    organization,
    repository,
  }
}
