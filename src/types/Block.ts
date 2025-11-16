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
