/**
 * Utility function for generating source keys
 */

import type { GitProvider } from '../types/GitProvider.js'

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
