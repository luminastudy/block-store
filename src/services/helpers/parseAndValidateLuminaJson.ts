/**
 * Parses and validates the lumina.json content
 */

import type { LuminaJson } from '../../types/LuminaJson.js'
import { ValidationError } from '../../errors/ValidationError.js'

export function parseAndValidateLuminaJson(
  content: string,
  filename: string
): LuminaJson {
  const parsedContent = JSON.parse(content)

  if (Array.isArray(parsedContent)) {
    return { blocks: parsedContent }
  }

  if (parsedContent && typeof parsedContent === 'object') {
    const obj = parsedContent
    if (!obj.blocks || !Array.isArray(obj.blocks)) {
      throw new ValidationError(
        `Invalid ${filename} format: missing or invalid blocks array`
      )
    }
    const result: LuminaJson = {
      blocks: obj.blocks,
    }
    const keys = Object.keys(obj)
    for (const key of keys) {
      if (key !== 'blocks') {
        const value = Object.getOwnPropertyDescriptor(obj, key)
        if (value && value.value !== undefined) {
          Object.defineProperty(result, key, value)
        }
      }
    }
    return result
  }

  throw new ValidationError(
    `Invalid ${filename} format: expected object or array, got ${typeof parsedContent}`
  )
}
