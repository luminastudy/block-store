/**
 * Async thunk for adding a lumina.json source
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AddLuminaJsonParams } from '../types/AddLuminaJsonParams.js'
import type { LuminaJsonSource } from '../types/LuminaJsonSource.js'
import { fetchLuminaJsonFromGitHub } from '../services/githubService.js'
import { fetchLuminaJsonFromGitLab } from '../services/gitlabService.js'
import { UnsupportedProviderError } from '../errors/UnsupportedProviderError.js'

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
        throw new UnsupportedProviderError(provider)
      }

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
