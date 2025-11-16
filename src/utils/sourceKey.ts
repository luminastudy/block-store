/**
 * Utility functions for source key generation
 */

import type { GitProvider } from '../types.js'

/**
 * Generates a unique key for a lumina.json source
 *
 * @param provider - Git provider
 * @param organization - Organization name
 * @param repository - Repository name
 * @returns Unique key in format "provider:organization:repository"
 */
export function generateSourceKey(
  provider: GitProvider,
  organization: string,
  repository: string
): string {
  return `${provider}:${organization}:${repository}`
}

/**
 * Parses a source key into its components
 *
 * @param key - Source key in format "provider:organization:repository"
 * @returns Object with provider, organization, and repository
 * @throws Error if the key format is invalid
 */
export function parseSourceKey(key: string): {
  provider: GitProvider
  organization: string
  repository: string
} {
  const parts = key.split(':')
  if (parts.length !== 3) {
    throw new Error(`Invalid source key format: ${key}`)
  }

  const [provider, organization, repository] = parts

  if (provider !== 'github' && provider !== 'gitlab') {
    throw new Error(`Invalid provider in source key: ${provider}`)
  }

  return {
    provider,
    organization,
    repository,
  }
}
