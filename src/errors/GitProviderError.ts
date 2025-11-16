/**
 * Error thrown when a Git provider operation fails
 */
export class GitProviderError extends Error {
  public readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'GitProviderError'
    this.status = status
    Object.setPrototypeOf(this, GitProviderError.prototype)
  }
}
