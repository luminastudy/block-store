/**
 * Main entry point for @lumina-study/block-store
 *
 * A Redux Toolkit store for managing lumina.json configurations
 * from GitHub and GitLab repositories.
 */

// Export store factory and types
export { createBlockStore } from './store.js'
export type { BlockStore, RootState, AppDispatch } from './store.js'

// Export slice actions and selectors
export {
  addBlock,
  removeBlock,
  clearBlocks,
  clearError,
  selectAllBlocks,
  selectBlockByKey,
  selectBlocksByProvider,
  selectLoading,
  selectError,
} from './slices/blockSlice.js'

// Export types
export type {
  GitProvider,
  LuminaConfig,
  BlockData,
  BlockIdentifier,
  BlockStoreState,
  AddBlockParams,
} from './types.js'

// Export utilities
export { generateBlockKey, parseBlockKey } from './utils/blockKey.js'

// Export services (for advanced use cases)
export { fetchLuminaConfigFromGitHub } from './services/githubService.js'
export { fetchLuminaConfigFromGitLab } from './services/gitlabService.js'
