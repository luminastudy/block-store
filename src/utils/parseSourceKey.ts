/**
 * Utility function for parsing source keys
 */

import type { GitProvider } from '../types/GitProvider.js'
import { ValidationError } from '../errors/ValidationError.js'

/**
 * Parses a source key into its components
 *
 * @param key - Source key in format "provider:organization:repository"
 * @returns Object with provider, organization, and repository
 * @throws ValidationError if the key format is invalid
 */
export function parseSourceKey(key: string): {
  provider: GitProvider
  organization: string
  repository: string
} {
  const parts = key.split(':')
  if (parts.length !== 3) {
    throw new ValidationError(`Invalid source key format: ${key}`)
  }

  const [provider, organization, repository] = parts

  if (provider !== 'github' && provider !== 'gitlab') {
    throw new ValidationError(`Invalid provider in source key: ${provider}`)
  }

  return {
    provider,
    organization,
    repository,
  }
}
