import { createLineStream } from './lineStream'

describe('createLineStream', () => {
  it('emits complete lines from a single chunk', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('line1\nline2\n'))
    expect(lines).toEqual(['line1', 'line2'])
  })

  it('buffers partial lines across chunks', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('hel'))
    expect(lines).toEqual([])
    ls.feed(Buffer.from('lo world\n'))
    expect(lines).toEqual(['hello world'])
  })

  it('flushes remaining partial line', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('partial'))
    expect(lines).toEqual([])
    ls.flush()
    expect(lines).toEqual(['partial'])
  })

  it('flush is a no-op when buffer is empty', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.flush()
    expect(lines).toEqual([])
  })

  it('flush is a no-op when buffer is only whitespace', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('  \n'))
    ls.flush()
    expect(lines).toEqual([])
  })

  it('trims whitespace from lines', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('  padded  \n'))
    expect(lines).toEqual(['padded'])
  })

  it('skips empty lines', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed(Buffer.from('a\n\n\nb\n'))
    expect(lines).toEqual(['a', 'b'])
  })

  it('handles string input', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed('hello\nworld\n')
    expect(lines).toEqual(['hello', 'world'])
  })

  it('handles multiple partial chunks joining into one line', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed('a')
    ls.feed('b')
    ls.feed('c\n')
    expect(lines).toEqual(['abc'])
  })

  it('resets buffer after flush', () => {
    const lines: string[] = []
    const ls = createLineStream(line => lines.push(line))
    ls.feed('first')
    ls.flush()
    ls.feed('second')
    ls.flush()
    expect(lines).toEqual(['first', 'second'])
  })
})
