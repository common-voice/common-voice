import * as crypto from 'node:crypto'

jest.mock('../infrastructure/redis')
jest.mock('../infrastructure/queue')
jest.mock('../infrastructure/storage')
jest.mock('../infrastructure/database')

import { TSV_COLUMNS, logError } from './clips'
import { hashClientId } from './clients'

// ---------------------------------------------------------------------------
// TSV_COLUMNS
// ---------------------------------------------------------------------------

describe('TSV_COLUMNS', () => {
  it('is an array of 13 column names', () => {
    expect(TSV_COLUMNS).toHaveLength(13)
  })

  it('starts with client_id', () => {
    expect(TSV_COLUMNS[0]).toBe('client_id')
  })

  it('includes path', () => {
    expect(TSV_COLUMNS).toContain('path')
  })

  it('includes all expected columns', () => {
    const expected = [
      'client_id', 'path', 'sentence_id', 'sentence', 'sentence_domain',
      'up_votes', 'down_votes', 'age', 'gender', 'accents', 'variant',
      'locale', 'segment',
    ]
    expect([...TSV_COLUMNS]).toEqual(expected)
  })

  it('has no duplicates', () => {
    expect(new Set(TSV_COLUMNS).size).toBe(TSV_COLUMNS.length)
  })
})

// ---------------------------------------------------------------------------
// hashClientId
// ---------------------------------------------------------------------------

describe('hashClientId', () => {
  it('returns a hex string', () => {
    expect(hashClientId('user123')).toMatch(/^[0-9a-f]+$/)
  })

  it('returns a sha512 hash (128 hex chars)', () => {
    expect(hashClientId('user123')).toHaveLength(128)
  })

  it('is deterministic', () => {
    expect(hashClientId('user123')).toBe(hashClientId('user123'))
  })

  it('different inputs produce different hashes', () => {
    expect(hashClientId('user1')).not.toBe(hashClientId('user2'))
  })

  it('matches Node crypto directly', () => {
    const expected = crypto.createHash('sha512').update('test').digest('hex')
    expect(hashClientId('test')).toBe(expected)
  })
})

// ---------------------------------------------------------------------------
// logError
// ---------------------------------------------------------------------------

describe('logError', () => {
  it('returns an Error instance', () => {
    expect(logError('something broke')).toBeInstanceOf(Error)
  })

  it('preserves the message from a string', () => {
    expect(logError('fail').message).toBe('fail')
  })

  it('stringifies non-Error objects', () => {
    expect(logError(42).message).toBe('42')
  })

  it('stringifies Error objects', () => {
    const err = new Error('original')
    expect(logError(err).message).toBe('Error: original')
  })
})
