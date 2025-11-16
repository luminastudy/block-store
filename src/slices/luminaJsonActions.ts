/**
 * Actions for lumina.json slice
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BlockStoreState } from '../types/BlockStoreState.js'
import { generateSourceKey } from '../utils/generateSourceKey.js'
import { addLuminaJson } from './addLuminaJson.js'

const initialState: BlockStoreState = {
  sources: {},
  loading: false,
  error: null,
}

const luminaJsonSlice = createSlice({
  name: 'luminaJson',
  initialState,
  reducers: {
    removeLuminaJson: (state, action: PayloadAction<string>) => {
      const newSources: Record<string, (typeof state.sources)[string]> = {}
      const keys = Object.keys(state.sources)
      for (const key of keys) {
        if (key !== action.payload) {
          const source = Object.getOwnPropertyDescriptor(state.sources, key)
          if (source && source.value) {
            Object.defineProperty(newSources, key, source)
          }
        }
      }
      state.sources = newSources
    },
    clearSources: state => {
      state.sources = {}
      state.error = null
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addLuminaJson.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(addLuminaJson.fulfilled, (state, action) => {
        state.loading = false
        const source = action.payload
        const key = generateSourceKey(
          source.provider,
          source.organization,
          source.repository
        )
        const newSources = { ...state.sources }
        Object.defineProperty(newSources, key, {
          value: source,
          writable: true,
          enumerable: true,
          configurable: true,
        })
        state.sources = newSources
      })
      .addCase(addLuminaJson.rejected, (state, action) => {
        state.loading = false
        const errorMessage = action.payload
        if (typeof errorMessage === 'string') {
          state.error = errorMessage
        } else {
          state.error = 'Unknown error'
        }
      })
  },
})

export const luminaJsonActions = luminaJsonSlice.actions
