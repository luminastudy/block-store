/**
 * Tests for GitLab service
 */

import { describe, it, expect } from 'vitest'
import { fetchLuminaJsonFromGitLab } from './gitlabService.js'

describe('gitlabService', () => {
  it('should export fetchLuminaJsonFromGitLab function', () => {
    expect(fetchLuminaJsonFromGitLab).toBeDefined()
    expect(typeof fetchLuminaJsonFromGitLab).toBe('function')
  })
})
