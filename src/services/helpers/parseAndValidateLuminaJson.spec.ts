import { describe, it, expect } from 'vitest'
import { parseAndValidateLuminaJson } from './parseAndValidateLuminaJson.js'

describe('parseAndValidateLuminaJson', () => {
  it('should parse valid lumina.json object format', () => {
    const content = JSON.stringify({ blocks: [] })
    const result = parseAndValidateLuminaJson(content, 'lumina.json')
    expect(result.blocks).toEqual([])
  })

  it('should parse valid lumina.json array format', () => {
    const content = JSON.stringify([])
    const result = parseAndValidateLuminaJson(content, 'lumina.json')
    expect(result.blocks).toEqual([])
  })
})
