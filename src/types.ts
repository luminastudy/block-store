/**
 * Type definitions for block-store
 *
 * This package manages lumina.json files from Git repositories.
 * Block types are defined by @lumina-study/block-schema (single source of truth).
 */

/**
 * Supported Git providers
 */
export type GitProvider = 'github' | 'gitlab'

/**
 * Block object as defined by @lumina-study/block-schema v0.1
 * This is the single source of truth for block structure.
 */
export interface Block {
  /** Unique identifier for the block (UUID) */
  id: string
  /** Block title in Hebrew and English */
  title: {
    /** Hebrew text for the title */
    he_text: string
    /** English text for the title */
    en_text: string
  }
  /** Array of prerequisite block IDs (UUIDs) */
  prerequisites: string[]
  /** Array of parent block IDs (UUIDs) */
  parents: string[]
  /** Additional properties allowed by schema */
  [key: string]: unknown
}

/**
 * Structure of a lumina.json file
 * Contains an array of blocks following the block-schema specification
 */
export interface LuminaJson {
  /** Array of blocks defined in this lumina.json */
  blocks: Block[]
  /** Optional metadata or additional fields */
  [key: string]: unknown
}

/**
 * Source information for a lumina.json file
 * Tracks where the file came from and its content
 */
export interface LuminaJsonSource {
  /** Git provider (github or gitlab) */
  provider: GitProvider
  /** Organization or user name */
  organization: string
  /** Repository name */
  repository: string
  /** Git commit SHA when the file was fetched */
  commitSha: string
  /** The parsed lumina.json content */
  luminaJson: LuminaJson
  /** Timestamp when the source was added */
  addedAt: string
}

/**
 * Redux state shape
 */
export interface BlockStoreState {
  /** Map of lumina.json sources keyed by "provider:organization:repository" */
  sources: Record<string, LuminaJsonSource>
  /** Loading state */
  loading: boolean
  /** Error message if any */
  error: string | null
}

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

/**
 * Error response from Git providers
 */
export interface GitProviderError {
  message: string
  status?: number
}
