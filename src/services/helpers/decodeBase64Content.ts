/**
 * Decodes base64 content in a browser-compatible way
 */
export function decodeBase64Content(content: string): string {
  return decodeURIComponent(
    atob(content)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}
