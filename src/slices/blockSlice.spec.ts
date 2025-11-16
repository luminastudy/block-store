import { describe, it, expect, beforeEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import blockReducer, {
  removeBlock,
  clearBlocks,
  clearError,
  selectAllBlocks,
  selectBlockByKey,
  selectBlocksByProvider,
  selectLoading,
  selectError,
} from './blockSlice.js'
import type { BlockStoreState, BlockData } from '../types.js'

describe('blockSlice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        blocks: blockReducer,
      },
    })
  })

  describe('initial state', () => {
    it('should have empty blocks, loading false, and no error', () => {
      const state = store.getState().blocks
      expect(state.blocks).toEqual({})
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('removeBlock action', () => {
    it('should remove a block by key', () => {
      // Manually set up state with a block
      const initialState: BlockStoreState = {
        blocks: {
          'github:org:repo': {
            provider: 'github',
            organization: 'org',
            repository: 'repo',
            commitSha: 'abc123',
            config: { test: true },
            addedAt: new Date().toISOString(),
          },
        },
        loading: false,
        error: null,
      }

      const newState = blockReducer(
        initialState,
        removeBlock('github:org:repo')
      )

      expect(newState.blocks).toEqual({})
    })

    it('should not error when removing non-existent block', () => {
      const state = blockReducer(undefined, removeBlock('nonexistent'))
      expect(state.blocks).toEqual({})
    })
  })

  describe('clearBlocks action', () => {
    it('should clear all blocks and error', () => {
      const initialState: BlockStoreState = {
        blocks: {
          'github:org:repo': {
            provider: 'github',
            organization: 'org',
            repository: 'repo',
            commitSha: 'abc123',
            config: { test: true },
            addedAt: new Date().toISOString(),
          },
        },
        loading: false,
        error: 'Some error',
      }

      const newState = blockReducer(initialState, clearBlocks())

      expect(newState.blocks).toEqual({})
      expect(newState.error).toBeNull()
    })
  })

  describe('clearError action', () => {
    it('should clear error state', () => {
      const initialState: BlockStoreState = {
        blocks: {},
        loading: false,
        error: 'Some error',
      }

      const newState = blockReducer(initialState, clearError())

      expect(newState.error).toBeNull()
      expect(newState.blocks).toEqual({})
    })
  })

  describe('selectors', () => {
    const mockBlocks: Record<string, BlockData> = {
      'github:org1:repo1': {
        provider: 'github',
        organization: 'org1',
        repository: 'repo1',
        commitSha: 'sha1',
        config: { name: 'test1' },
        addedAt: '2024-01-01T00:00:00.000Z',
      },
      'gitlab:org2:repo2': {
        provider: 'gitlab',
        organization: 'org2',
        repository: 'repo2',
        commitSha: 'sha2',
        config: { name: 'test2' },
        addedAt: '2024-01-02T00:00:00.000Z',
      },
      'github:org3:repo3': {
        provider: 'github',
        organization: 'org3',
        repository: 'repo3',
        commitSha: 'sha3',
        config: { name: 'test3' },
        addedAt: '2024-01-03T00:00:00.000Z',
      },
    }

    it('selectAllBlocks should return all blocks as array', () => {
      const state = {
        blocks: {
          blocks: mockBlocks,
          loading: false,
          error: null,
        },
      }

      const allBlocks = selectAllBlocks(state)
      expect(allBlocks).toHaveLength(3)
      expect(allBlocks).toEqual(Object.values(mockBlocks))
    })

    it('selectBlockByKey should return specific block', () => {
      const state = {
        blocks: {
          blocks: mockBlocks,
          loading: false,
          error: null,
        },
      }

      const block = selectBlockByKey('github:org1:repo1')(state)
      expect(block).toEqual(mockBlocks['github:org1:repo1'])
    })

    it('selectBlocksByProvider should filter by GitHub', () => {
      const state = {
        blocks: {
          blocks: mockBlocks,
          loading: false,
          error: null,
        },
      }

      const githubBlocks = selectBlocksByProvider('github')(state)
      expect(githubBlocks).toHaveLength(2)
      expect(githubBlocks.every(b => b.provider === 'github')).toBe(true)
    })

    it('selectBlocksByProvider should filter by GitLab', () => {
      const state = {
        blocks: {
          blocks: mockBlocks,
          loading: false,
          error: null,
        },
      }

      const gitlabBlocks = selectBlocksByProvider('gitlab')(state)
      expect(gitlabBlocks).toHaveLength(1)
      expect(gitlabBlocks[0].provider).toBe('gitlab')
    })

    it('selectLoading should return loading state', () => {
      const state = {
        blocks: {
          blocks: {},
          loading: true,
          error: null,
        },
      }

      expect(selectLoading(state)).toBe(true)
    })

    it('selectError should return error state', () => {
      const state = {
        blocks: {
          blocks: {},
          loading: false,
          error: 'Test error',
        },
      }

      expect(selectError(state)).toBe('Test error')
    })
  })
})
