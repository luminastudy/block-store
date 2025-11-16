import type { GitProvider } from './GitProvider.js'

/**
 * Parameters for adding a lumina.json source
 */
export interface AddLuminaJsonParams {
  provider: GitProvider
  organization: string
  repository: string
  /** Optional authentication token for private repos */
  token?: string
}
