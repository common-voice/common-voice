import { StringDecoder } from 'node:string_decoder'

/**
 * Buffers partial lines from subprocess `data` events and emits complete,
 * trimmed lines to a callback. Handles the common case where a `data` chunk
 * splits in the middle of a line or delivers multiple lines at once.
 *
 * Uses StringDecoder internally so multibyte UTF-8 characters that are
 * split across chunk boundaries are decoded correctly.
 *
 * Usage:
 *   const ls = createLineStream(line => logger.debug('TAG', line))
 *   proc.stderr.on('data', (data: Buffer) => ls.feed(data))
 *   proc.on('close', () => { ls.flush(); ... })
 */
export type LineStream = {
  /** Feed a raw chunk from a subprocess data event. */
  feed: (data: Buffer | string) => void
  /** Flush any remaining partial line (call in the close handler). */
  flush: () => void
}

export const createLineStream = (
  onLine: (line: string) => void,
): LineStream => {
  const decoder = new StringDecoder('utf8')
  let partial = ''
  return {
    feed: (data: Buffer | string) => {
      const text = typeof data === 'string' ? data : decoder.write(data)
      const combined = partial + text
      const lines = combined.split('\n')
      partial = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed) onLine(trimmed)
      }
    },
    flush: () => {
      // Flush any remaining bytes from the decoder, then the partial line.
      partial += decoder.end()
      const trimmed = partial.trim()
      if (trimmed) onLine(trimmed)
      partial = ''
    },
  }
}
