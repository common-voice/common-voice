import { redisKeys } from './redisKeys'

describe('redisKeys', () => {
  const RELEASE = 'cv-corpus-25.0-2026-03-06'

  it.each(Object.keys(redisKeys) as (keyof typeof redisKeys)[])(
    '%s returns a string starting with scripted:',
    key => {
      expect(redisKeys[key](RELEASE)).toMatch(/^scripted:/)
    },
  )

  it('problemClips includes release name', () => {
    expect(redisKeys.problemClips(RELEASE)).toBe(
      `scripted:log:problem-clips:${RELEASE}`,
    )
  })

  it('processLog includes release name', () => {
    expect(redisKeys.processLog(RELEASE)).toBe(
      `scripted:log:process:${RELEASE}`,
    )
  })

  it('localeCount includes release name', () => {
    expect(redisKeys.localeCount(RELEASE)).toBe(
      `scripted:jobs:count:${RELEASE}`,
    )
  })

  it('localeTotal includes release name', () => {
    expect(redisKeys.localeTotal(RELEASE)).toBe(
      `scripted:jobs:total:${RELEASE}`,
    )
  })

  it('clipsCount includes release name', () => {
    expect(redisKeys.clipsCount(RELEASE)).toBe(
      `scripted:clips:count:${RELEASE}`,
    )
  })

  it('clipsTotal includes release name', () => {
    expect(redisKeys.clipsTotal(RELEASE)).toBe(
      `scripted:clips:total:${RELEASE}`,
    )
  })

  it('timeStart includes release name', () => {
    expect(redisKeys.timeStart(RELEASE)).toBe(
      `scripted:time:start:${RELEASE}`,
    )
  })

  it('done includes release name', () => {
    expect(redisKeys.done(RELEASE)).toBe(`scripted:done:${RELEASE}`)
  })

  it('processing includes release name', () => {
    expect(redisKeys.processing(RELEASE)).toBe(
      `scripted:processing:${RELEASE}`,
    )
  })

  it('lastFlush includes release name', () => {
    expect(redisKeys.lastFlush(RELEASE)).toBe(
      `scripted:log:last-flush:${RELEASE}`,
    )
  })

  it('pendingGroups includes base release name', () => {
    expect(redisKeys.pendingGroups(RELEASE)).toBe(
      `scripted:pending-groups:${RELEASE}`,
    )
  })

  it('each key builder produces a unique key for the same release', () => {
    const keys = Object.values(redisKeys).map(fn => fn(RELEASE))
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('different release names produce different keys', () => {
    const a = redisKeys.done('release-a')
    const b = redisKeys.done('release-b')
    expect(a).not.toBe(b)
  })
})
