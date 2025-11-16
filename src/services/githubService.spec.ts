/**
 * Tests for GitHub service
 */

import { describe, it, expect } from 'vitest'
import { fetchLuminaJsonFromGitHub } from './githubService.js'

describe('githubService', () => {
  it('should export fetchLuminaJsonFromGitHub function', () => {
    expect(fetchLuminaJsonFromGitHub).toBeDefined()
    expect(typeof fetchLuminaJsonFromGitHub).toBe('function')
  })
})
