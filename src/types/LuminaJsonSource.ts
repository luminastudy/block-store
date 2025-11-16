import type { GitProvider } from './GitProvider.js'
import type { LuminaJson } from './LuminaJson.js'

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
