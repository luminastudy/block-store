/**
 * Structure of a lumina.json file
 * Contains an array of blocks following the block-schema specification
 */
export interface LuminaJson {
  /** Array of blocks defined in this lumina.json */
  blocks: Array<{
    id: string
    title: {
      he_text: string
      en_text: string
    }
    prerequisites: string[]
    parents: string[]
    [key: string]: unknown
  }>
  /** Optional metadata or additional fields */
  [key: string]: unknown
}
