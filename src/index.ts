/**
 * Main entry point for @lumina-study/block-store
 *
 * A Redux Toolkit store for managing lumina.json files from GitHub and GitLab repositories.
 * Block types are defined by @lumina-study/block-schema (single source of truth).
 */

// Export store factory and types
export { createBlockStore } from './store.js'
export type { BlockStore, RootState, AppDispatch } from './store.js'

// Export slice actions and selectors
export {
  addLuminaJson,
  removeLuminaJson,
  clearSources,
  clearError,
  selectAllSources,
  selectSourceByKey,
  selectSourcesByProvider,
  selectAllBlocks,
  selectBlocksFromSource,
  selectBlockById,
  selectLoading,
  selectError,
} from './slices/luminaJsonSlice.js'

// Export types
export type {
  GitProvider,
  Block,
  LuminaJson,
  LuminaJsonSource,
  BlockStoreState,
  AddLuminaJsonParams,
} from './types.js'

// Export utilities
export { generateSourceKey, parseSourceKey } from './utils/sourceKey.js'

// Export services (for advanced use cases)
export { fetchLuminaJsonFromGitHub } from './services/githubService.js'
export { fetchLuminaJsonFromGitLab } from './services/gitlabService.js'
