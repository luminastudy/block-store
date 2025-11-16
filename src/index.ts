/**
 * Main entry point for @lumina-study/block-store
 *
 * A Redux Toolkit store for managing lumina.json files from GitHub and GitLab repositories.
 * Block types are defined by @lumina-study/block-schema (single source of truth).
 */

export { createBlockStore } from './store/createBlockStore.js'
export type { BlockStore } from './store/BlockStore.js'
export type { RootState } from './store/RootState.js'
export type { AppDispatch } from './store/AppDispatch.js'

export { addLuminaJson } from './slices/addLuminaJson.js'
export { removeLuminaJson, clearSources, clearError } from './slices/actions.js'
export { default as luminaJsonReducer } from './slices/luminaJsonReducer.js'

export { selectAllSources } from './slices/selectors/selectAllSources.js'
export { selectSourceByKey } from './slices/selectors/selectSourceByKey.js'
export { selectSourcesByProvider } from './slices/selectors/selectSourcesByProvider.js'
export { selectAllBlocks } from './slices/selectors/selectAllBlocks.js'
export { selectBlocksFromSource } from './slices/selectors/selectBlocksFromSource.js'
export { selectBlockById } from './slices/selectors/selectBlockById.js'
export { selectLoading } from './slices/selectors/selectLoading.js'
export { selectError } from './slices/selectors/selectError.js'

export { default } from './slices/luminaJsonReducer.js'

export type { GitProvider } from './types/GitProvider.js'
export type { Block } from './types/Block.js'
export type { LuminaJson } from './types/LuminaJson.js'
export type { LuminaJsonSource } from './types/LuminaJsonSource.js'
export type { BlockStoreState } from './types/BlockStoreState.js'
export type { AddLuminaJsonParams } from './types/AddLuminaJsonParams.js'

export { generateSourceKey } from './utils/generateSourceKey.js'
export { parseSourceKey } from './utils/parseSourceKey.js'

export { fetchLuminaJsonFromGitHub } from './services/githubService.js'
export { fetchLuminaJsonFromGitLab } from './services/gitlabService.js'
