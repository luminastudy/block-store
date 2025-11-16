/**
 * Validates that the data is a file and extracts content
 */

import { ValidationError } from '../../errors/ValidationError.js'

export function validateFileData(data: unknown, filename: string): string {
  const isFile =
    data && typeof data === 'object' && 'type' in data && data.type === 'file'

  if (!isFile) {
    throw new ValidationError(`${filename} is not a file`)
  }

  const fileData = data
  const hasContent =
    fileData && typeof fileData === 'object' && 'content' in fileData
  if (!hasContent) {
    throw new ValidationError('File has no content')
  }

  const contentValue = fileData.content
  if (typeof contentValue !== 'string') {
    throw new ValidationError('File content is not a string')
  }

  return contentValue
}
