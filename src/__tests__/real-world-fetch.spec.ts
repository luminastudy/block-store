/**
 * Real-world integration test for fetching the-open-university-combinatorics lumina.json
 */

import { describe, it, expect } from 'vitest'
import { fetchLuminaJsonFromGitHub } from '../services/githubService.js'

describe('Real-world GitHub fetch', () => {
  it('should fetch and parse lumina.json from the-open-university-combinatorics repository', async () => {
    const result = await fetchLuminaJsonFromGitHub(
      'luminastudy',
      'the-open-university-combinatorics',
      undefined // No token needed for public repos
    )

    // Verify we got the data
    expect(result).toBeDefined()
    expect(result.luminaJson).toBeDefined()
    expect(result.commitSha).toBeDefined()

    // Verify the structure matches the expected lumina.json format
    expect(result.luminaJson).toHaveProperty('blocks')
    expect(Array.isArray(result.luminaJson.blocks)).toBe(true)
    expect(result.luminaJson.blocks.length).toBeGreaterThan(0)

    // Check first block structure
    const firstBlock = result.luminaJson.blocks[0]
    expect(firstBlock).toHaveProperty('id')
    expect(firstBlock).toHaveProperty('title')
    expect(firstBlock.title).toHaveProperty('he_text')
    expect(firstBlock.title).toHaveProperty('en_text')
    expect(firstBlock).toHaveProperty('prerequisites')
    expect(firstBlock).toHaveProperty('parents')

    // Verify the expected first block content
    expect(firstBlock.title.en_text).toBe('Combinatorics - The Open University')
    expect(firstBlock.title.he_text).toBe('קומבינטוריקה - האוניברסיטה הפתוחה')

    // Log the content for visual verification
    console.log('\n📚 Fetched lumina.json content:')
    console.log(`  Total blocks: ${result.luminaJson.blocks.length}`)
    console.log(`  Commit SHA: ${result.commitSha}`)
    console.log('\n  First 3 blocks:')
    result.luminaJson.blocks.slice(0, 3).forEach((block, index) => {
      console.log(`    ${index + 1}. ${block.title.en_text}`)
      console.log(`       (${block.title.he_text})`)
    })
  }, 10000) // 10 second timeout for network request
})
