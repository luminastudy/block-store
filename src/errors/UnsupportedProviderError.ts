/**
 * Error thrown when an unsupported provider is specified
 */
export class UnsupportedProviderError extends Error {
  constructor(provider: string) {
    super(`Unsupported provider: ${provider}`)
    this.name = 'UnsupportedProviderError'
    Object.setPrototypeOf(this, UnsupportedProviderError.prototype)
  }
}
