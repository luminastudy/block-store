import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import luminaJsonReducer, {
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
} from './luminaJsonSlice.js'
import type { BlockStoreState, LuminaJsonSource } from '../types.js'

describe('luminaJsonSlice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        luminaJson: luminaJsonReducer,
      },
    })
  })

  describe('initial state', () => {
    it('should have empty sources, loading false, and no error', () => {
      const state = store.getState().luminaJson
      expect(state.sources).toEqual({})
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('removeLuminaJson action', () => {
    it('should remove a source by key', () => {
      // Manually set up state with a source
      const initialState: BlockStoreState = {
        sources: {
          'github:org:repo': {
            provider: 'github',
            organization: 'org',
            repository: 'repo',
            commitSha: 'abc123',
            luminaJson: { blocks: [] },
            addedAt: new Date().toISOString(),
          },
        },
        loading: false,
        error: null,
      }

      const newState = luminaJsonReducer(
        initialState,
        removeLuminaJson('github:org:repo')
      )

      expect(newState.sources).toEqual({})
    })

    it('should not error when removing non-existent source', () => {
      const state = luminaJsonReducer(
        undefined,
        removeLuminaJson('nonexistent')
      )
      expect(state.sources).toEqual({})
    })
  })

  describe('clearSources action', () => {
    it('should clear all sources and error', () => {
      const initialState: BlockStoreState = {
        sources: {
          'github:org:repo': {
            provider: 'github',
            organization: 'org',
            repository: 'repo',
            commitSha: 'abc123',
            luminaJson: { blocks: [] },
            addedAt: new Date().toISOString(),
          },
        },
        loading: false,
        error: 'Some error',
      }

      const newState = luminaJsonReducer(initialState, clearSources())

      expect(newState.sources).toEqual({})
      expect(newState.error).toBeNull()
    })
  })

  describe('clearError action', () => {
    it('should clear error state', () => {
      const initialState: BlockStoreState = {
        sources: {},
        loading: false,
        error: 'Some error',
      }

      const newState = luminaJsonReducer(initialState, clearError())

      expect(newState.error).toBeNull()
      expect(newState.sources).toEqual({})
    })
  })

  describe('selectors', () => {
    const mockSources: Record<string, LuminaJsonSource> = {
      'github:org1:repo1': {
        provider: 'github',
        organization: 'org1',
        repository: 'repo1',
        commitSha: 'sha1',
        luminaJson: {
          blocks: [
            {
              id: 'block-1',
              title: { he_text: 'בלוק 1', en_text: 'Block 1' },
              prerequisites: [],
              parents: [],
            },
            {
              id: 'block-2',
              title: { he_text: 'בלוק 2', en_text: 'Block 2' },
              prerequisites: ['block-1'],
              parents: [],
            },
          ],
        },
        addedAt: '2024-01-01T00:00:00.000Z',
      },
      'gitlab:org2:repo2': {
        provider: 'gitlab',
        organization: 'org2',
        repository: 'repo2',
        commitSha: 'sha2',
        luminaJson: {
          blocks: [
            {
              id: 'block-3',
              title: { he_text: 'בלוק 3', en_text: 'Block 3' },
              prerequisites: [],
              parents: [],
            },
          ],
        },
        addedAt: '2024-01-02T00:00:00.000Z',
      },
      'github:org3:repo3': {
        provider: 'github',
        organization: 'org3',
        repository: 'repo3',
        commitSha: 'sha3',
        luminaJson: {
          blocks: [],
        },
        addedAt: '2024-01-03T00:00:00.000Z',
      },
    }

    it('selectAllSources should return all sources as array', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const allSources = selectAllSources(state)
      expect(allSources).toHaveLength(3)
      expect(allSources).toEqual(Object.values(mockSources))
    })

    it('selectSourceByKey should return specific source', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const source = selectSourceByKey('github:org1:repo1')(state)
      expect(source).toEqual(mockSources['github:org1:repo1'])
    })

    it('selectSourcesByProvider should filter by GitHub', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const githubSources = selectSourcesByProvider('github')(state)
      expect(githubSources).toHaveLength(2)
      expect(githubSources.every(s => s.provider === 'github')).toBe(true)
    })

    it('selectSourcesByProvider should filter by GitLab', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const gitlabSources = selectSourcesByProvider('gitlab')(state)
      expect(gitlabSources).toHaveLength(1)
      expect(gitlabSources[0].provider).toBe('gitlab')
    })

    it('selectAllBlocks should return all blocks from all sources', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const allBlocks = selectAllBlocks(state)
      expect(allBlocks).toHaveLength(3)
      expect(allBlocks.map(b => b.id)).toEqual([
        'block-1',
        'block-2',
        'block-3',
      ])
    })

    it('selectBlocksFromSource should return blocks from specific source', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const blocks = selectBlocksFromSource('github:org1:repo1')(state)
      expect(blocks).toHaveLength(2)
      expect(blocks.map(b => b.id)).toEqual(['block-1', 'block-2'])
    })

    it('selectBlocksFromSource should return empty array for non-existent source', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const blocks = selectBlocksFromSource('github:nonexistent:repo')(state)
      expect(blocks).toEqual([])
    })

    it('selectBlockById should find block by ID across all sources', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const block = selectBlockById('block-2')(state)
      expect(block).toBeDefined()
      expect(block?.id).toBe('block-2')
      expect(block?.title.en_text).toBe('Block 2')
    })

    it('selectBlockById should return undefined for non-existent block', () => {
      const state = {
        luminaJson: {
          sources: mockSources,
          loading: false,
          error: null,
        },
      }

      const block = selectBlockById('nonexistent')(state)
      expect(block).toBeUndefined()
    })

    it('selectLoading should return loading state', () => {
      const state = {
        luminaJson: {
          sources: {},
          loading: true,
          error: null,
        },
      }

      expect(selectLoading(state)).toBe(true)
    })

    it('selectError should return error state', () => {
      const state = {
        luminaJson: {
          sources: {},
          loading: false,
          error: 'Test error',
        },
      }

      expect(selectError(state)).toBe('Test error')
    })
  })
})
