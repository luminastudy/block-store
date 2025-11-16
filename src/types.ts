/**
 * Type definitions for block-store
 */

/**
 * Supported Git providers
 */
export type GitProvider = 'github' | 'gitlab'

/**
 * Configuration data from lumina.json
 */
export interface LuminaConfig {
  [key: string]: unknown
}

/**
 * Block data stored in the Redux store
 */
export interface BlockData {
  /** Git provider (github or gitlab) */
  provider: GitProvider
  /** Organization or user name */
  organization: string
  /** Repository name */
  repository: string
  /** Git commit SHA */
  commitSha: string
  /** The lumina.json configuration data */
  config: LuminaConfig
  /** Timestamp when the block was added */
  addedAt: string
}

/**
 * Unique identifier for a block
 */
export interface BlockIdentifier {
  provider: GitProvider
  organization: string
  repository: string
}

/**
 * Redux state shape
 */
export interface BlockStoreState {
  /** Map of blocks keyed by "provider:organization:repository" */
  blocks: Record<string, BlockData>
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
}

/**
 * Parameters for adding a block
 */
export interface AddBlockParams {
  provider: GitProvider
  organization: string
  repository: string
  /** Optional authentication token for private repos */
  token?: string
}

/**
 * Error response from Git providers
 */
export interface GitProviderError {
  message: string
  status?: number
}
