/**
 * Redux slice for managing blocks
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BlockStoreState, BlockData, AddBlockParams } from '../types.js'
import { fetchLuminaConfigFromGitHub } from '../services/githubService.js'
import { fetchLuminaConfigFromGitLab } from '../services/gitlabService.js'
import { generateBlockKey } from '../utils/blockKey.js'

/**
 * Initial state for the block store
 */
const initialState: BlockStoreState = {
  blocks: {},
  loading: false,
  error: null,
}

/**
 * Async thunk for adding a block by fetching lumina.json from a Git provider
 */
export const addBlock = createAsyncThunk(
  'blocks/addBlock',
  async (params: AddBlockParams, { rejectWithValue }) => {
    const { provider, organization, repository, token } = params

    try {
      let config
      let commitSha

      // Fetch from the appropriate provider
      if (provider === 'github') {
        const result = await fetchLuminaConfigFromGitHub(
          organization,
          repository,
          token
        )
        config = result.config
        commitSha = result.commitSha
      } else if (provider === 'gitlab') {
        const result = await fetchLuminaConfigFromGitLab(
          organization,
          repository,
          token
        )
        config = result.config
        commitSha = result.commitSha
      } else {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      // Create the block data
      const blockData: BlockData = {
        provider,
        organization,
        repository,
        commitSha,
        config,
        addedAt: new Date().toISOString(),
      }

      return blockData
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
)

/**
 * Block slice
 */
const blockSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    /**
     * Remove a block from the store
     */
    removeBlock: (state, action: PayloadAction<string>) => {
      delete state.blocks[action.payload]
    },

    /**
     * Clear all blocks from the store
     */
    clearBlocks: state => {
      state.blocks = {}
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
      // addBlock pending
      .addCase(addBlock.pending, state => {
        state.loading = true
        state.error = null
      })
      // addBlock fulfilled
      .addCase(addBlock.fulfilled, (state, action) => {
        state.loading = false
        const blockData = action.payload
        const key = generateBlockKey(
          blockData.provider,
          blockData.organization,
          blockData.repository
        )
        state.blocks[key] = blockData
      })
      // addBlock rejected
      .addCase(addBlock.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

/**
 * Export actions
 */
export const { removeBlock, clearBlocks, clearError } = blockSlice.actions

/**
 * Export reducer
 */
export default blockSlice.reducer

/**
 * Selectors
 */

/**
 * Get all blocks
 */
export const selectAllBlocks = (state: { blocks: BlockStoreState }) =>
  Object.values(state.blocks.blocks)

/**
 * Get a specific block by key
 */
export const selectBlockByKey =
  (key: string) => (state: { blocks: BlockStoreState }) =>
    state.blocks.blocks[key]

/**
 * Get blocks by provider
 */
export const selectBlocksByProvider =
  (provider: 'github' | 'gitlab') => (state: { blocks: BlockStoreState }) =>
    Object.values(state.blocks.blocks).filter(
      block => block.provider === provider
    )

/**
 * Get loading state
 */
export const selectLoading = (state: { blocks: BlockStoreState }) =>
  state.blocks.loading

/**
 * Get error state
 */
export const selectError = (state: { blocks: BlockStoreState }) =>
  state.blocks.error
