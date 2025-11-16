/**
 * Redux slice for managing lumina.json sources
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  BlockStoreState,
  LuminaJsonSource,
  AddLuminaJsonParams,
  Block,
} from '../types.js'
import { fetchLuminaJsonFromGitHub } from '../services/githubService.js'
import { fetchLuminaJsonFromGitLab } from '../services/gitlabService.js'
import { generateSourceKey } from '../utils/sourceKey.js'

/**
 * Initial state for the block store
 */
const initialState: BlockStoreState = {
  sources: {},
  loading: false,
  error: null,
}

/**
 * Async thunk for adding a lumina.json source by fetching from a Git provider
 */
export const addLuminaJson = createAsyncThunk(
  'luminaJson/addSource',
  async (params: AddLuminaJsonParams, { rejectWithValue }) => {
    const { provider, organization, repository, token } = params

    try {
      let luminaJson
      let commitSha

      // Fetch from the appropriate provider
      if (provider === 'github') {
        const result = await fetchLuminaJsonFromGitHub(
          organization,
          repository,
          token
        )
        luminaJson = result.luminaJson
        commitSha = result.commitSha
      } else if (provider === 'gitlab') {
        const result = await fetchLuminaJsonFromGitLab(
          organization,
          repository,
          token
        )
        luminaJson = result.luminaJson
        commitSha = result.commitSha
      } else {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      // Create the source data
      const source: LuminaJsonSource = {
        provider,
        organization,
        repository,
        commitSha,
        luminaJson,
        addedAt: new Date().toISOString(),
      }

      return source
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

/**
 * Lumina JSON slice
 */
const luminaJsonSlice = createSlice({
  name: 'luminaJson',
  initialState,
  reducers: {
    /**
     * Remove a lumina.json source from the store
     */
    removeLuminaJson: (state, action: PayloadAction<string>) => {
      delete state.sources[action.payload]
    },

    /**
     * Clear all sources from the store
     */
    clearSources: state => {
      state.sources = {}
      state.error = null
    },

    /**
     * Clear any error state
     */
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // addLuminaJson pending
      .addCase(addLuminaJson.pending, state => {
        state.loading = true
        state.error = null
      })
      // addLuminaJson fulfilled
      .addCase(addLuminaJson.fulfilled, (state, action) => {
        state.loading = false
        const source = action.payload
        const key = generateSourceKey(
          source.provider,
          source.organization,
          source.repository
        )
        state.sources[key] = source
      })
      // addLuminaJson rejected
      .addCase(addLuminaJson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

/**
 * Export actions
 */
export const { removeLuminaJson, clearSources, clearError } =
  luminaJsonSlice.actions

/**
 * Export reducer
 */
export default luminaJsonSlice.reducer

/**
 * Selectors
 */

/**
 * Get all lumina.json sources
 */
export const selectAllSources = (state: { luminaJson: BlockStoreState }) =>
  Object.values(state.luminaJson.sources)

/**
 * Get a specific source by key
 */
export const selectSourceByKey =
  (key: string) => (state: { luminaJson: BlockStoreState }) =>
    state.luminaJson.sources[key]

/**
 * Get sources by provider
 */
export const selectSourcesByProvider =
  (provider: 'github' | 'gitlab') => (state: { luminaJson: BlockStoreState }) =>
    Object.values(state.luminaJson.sources).filter(
      source => source.provider === provider
    )

/**
 * Get all blocks from all sources
 */
export const selectAllBlocks = (state: {
  luminaJson: BlockStoreState
}): Block[] => {
  const sources = Object.values(state.luminaJson.sources)
  return sources.flatMap(source => source.luminaJson.blocks)
}

/**
 * Get blocks from a specific source
 */
export const selectBlocksFromSource =
  (sourceKey: string) =>
  (state: { luminaJson: BlockStoreState }): Block[] => {
    const source = state.luminaJson.sources[sourceKey]
    return source ? source.luminaJson.blocks : []
  }

/**
 * Get a block by ID across all sources
 */
export const selectBlockById =
  (blockId: string) =>
  (state: { luminaJson: BlockStoreState }): Block | undefined => {
    const allBlocks = selectAllBlocks(state)
    return allBlocks.find(block => block.id === blockId)
  }

/**
 * Get loading state
 */
export const selectLoading = (state: { luminaJson: BlockStoreState }) =>
  state.luminaJson.loading

/**
 * Get error state
 */
export const selectError = (state: { luminaJson: BlockStoreState }) =>
  state.luminaJson.error
