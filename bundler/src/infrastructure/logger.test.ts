/* eslint-disable @typescript-eslint/no-var-requires */
// Logger module reads process.env at import time (via config), so we use
// jest.isolateModules + require to get a fresh module per test.

type LoggerModule = typeof import('./logger')

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  jest.resetModules()
})

const loadLogger = (): LoggerModule => {
  let mod!: LoggerModule
  jest.isolateModules(() => {
    mod = require('./logger') as LoggerModule
  })
  return mod
}

describe('applyVerbosity', () => {
  beforeEach(() => {
    delete process.env.LOG_LEVEL
    delete process.env.ENVIRONMENT
  })

  it('defaults to normal verbosity', () => {
    const { getVerbosity } = loadLogger()
    expect(getVerbosity()).toBe('normal')
  })

  it('verbose sets verbosity to verbose', () => {
    const { applyVerbosity, getVerbosity } = loadLogger()
    applyVerbosity('verbose')
    expect(getVerbosity()).toBe('verbose')
  })

  it('debug sets verbosity to debug', () => {
    const { applyVerbosity, getVerbosity } = loadLogger()
    applyVerbosity('debug')
    expect(getVerbosity()).toBe('debug')
  })

  it('normal resets to environment default', () => {
    process.env.ENVIRONMENT = 'production'
    const { applyVerbosity, getVerbosity } = loadLogger()
    applyVerbosity('debug')
    expect(getVerbosity()).toBe('debug')
    applyVerbosity('normal')
    expect(getVerbosity()).toBe('normal')
  })

  it('quiet suppresses info output', () => {
    const { applyVerbosity, logger } = loadLogger()
    applyVerbosity('quiet')
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
    logger.info('TEST', 'should be suppressed')
    expect(writeSpy).not.toHaveBeenCalled()
    writeSpy.mockRestore()
  })

  it('quiet still allows warn output', () => {
    const { applyVerbosity, logger } = loadLogger()
    applyVerbosity('quiet')
    const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true)
    logger.warn('TEST', 'should appear')
    expect(writeSpy).toHaveBeenCalled()
    writeSpy.mockRestore()
  })

  it('verbose enables debug output', () => {
    const { applyVerbosity, logger } = loadLogger()
    applyVerbosity('verbose')
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
    logger.debug('TEST', 'should appear')
    expect(writeSpy).toHaveBeenCalled()
    writeSpy.mockRestore()
  })

  it('falls back to normal for invalid verbosity values', () => {
    const { applyVerbosity, getVerbosity, logger } = loadLogger()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyVerbosity('bogus' as any)
    expect(getVerbosity()).toBe('normal')
    // info should still work (normal -> env default info for local)
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
    logger.info('TEST', 'should appear')
    expect(writeSpy).toHaveBeenCalled()
    writeSpy.mockRestore()
  })
})
