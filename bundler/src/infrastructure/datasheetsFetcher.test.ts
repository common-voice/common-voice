import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { fetchDatasheetsPayloads, DatasheetsJson } from './datasheetsFetcher'

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const makeJson = (overrides: Partial<DatasheetsJson> = {}): DatasheetsJson => ({
  schema_version: '1',
  generated_at: '2026-01-01T00:00:00Z',
  templates: {
    scs: {
      en: '# {{NATIVE_NAME}} ({{LOCALE}})',
      fr: '# {{NATIVE_NAME}} ({{LOCALE}}) — Français',
    },
    sps: {
      fr: '# {{NATIVE_NAME}} ({{LOCALE}}) — SPS',
    },
  },
  locales: {
    scs: {
      en: {
        template_language: 'en',
        metadata: { native_name: 'English' },
        community_fields: { contact: 'team@example.com' },
      },
      de: {
        // No 'de' key in templates.scs → this locale must be skipped
        template_language: 'de',
        metadata: { native_name: 'Deutsch' },
        community_fields: {},
      },
    },
    sps: {
      fr: {
        template_language: 'fr',
        metadata: { native_name: 'Français' },
        community_fields: {},
      },
    },
  },
  ...overrides,
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fetcher-test-'))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

const writeJson = (obj: object, filename = 'datasheets.json'): string => {
  const filepath = path.join(tmpDir, filename)
  fs.writeFileSync(filepath, JSON.stringify(obj))
  return filepath
}

// ---------------------------------------------------------------------------
// No file provided
// ---------------------------------------------------------------------------

describe('fetchDatasheetsPayloads — no file provided', () => {
  it('returns an empty Map without error', async () => {
    const result = await fetchDatasheetsPayloads('scripted')()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.size).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Local file loading
// ---------------------------------------------------------------------------

describe('fetchDatasheetsPayloads — local absolute path', () => {
  it('loads payloads from an absolute path', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.has('en')).toBe(true)
      expect(result.right.size).toBe(1) // de has no template → skipped
    }
  })

  it('loads payloads from a file:// URI', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads(
      'scripted',
      `file://${filepath}`,
    )()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.has('en')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Payload shape
// ---------------------------------------------------------------------------

describe('fetchDatasheetsPayloads — payload structure', () => {
  it('exposes the template string', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.get('en')!.template).toContain('{{NATIVE_NAME}}')
    }
  })

  it('includes community_fields', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.get('en')!.community_fields['contact']).toBe(
        'team@example.com',
      )
    }
  })

  it('merges template_language into metadata', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.get('en')!.metadata['template_language']).toBe('en')
      expect(result.right.get('en')!.metadata['native_name']).toBe('English')
    }
  })

  it('skips a locale whose template_language has no matching template', async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.has('de')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Modality key mapping  (scripted → scs, spontaneous → sps)
// ---------------------------------------------------------------------------

describe('fetchDatasheetsPayloads — modality key mapping', () => {
  it("maps 'scripted' to the 'scs' key in the JSON", async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.has('en')).toBe(true) // scs has 'en'
      expect(result.right.has('fr')).toBe(false) // sps 'fr' is not included
    }
  })

  it("maps 'spontaneous' to the 'sps' key in the JSON", async () => {
    const filepath = writeJson(makeJson())
    const result = await fetchDatasheetsPayloads('spontaneous', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.has('fr')).toBe(true) // sps has 'fr'
      expect(result.right.has('en')).toBe(false) // scs 'en' is not included
    }
  })
})

// ---------------------------------------------------------------------------
// Error recovery
// ---------------------------------------------------------------------------

describe('fetchDatasheetsPayloads — error recovery', () => {
  it('returns an empty Map when the file is missing', async () => {
    const result = await fetchDatasheetsPayloads(
      'scripted',
      '/nonexistent/path/datasheets.json',
    )()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.size).toBe(0)
  })

  it('returns an empty Map when the file contains malformed JSON', async () => {
    const filepath = path.join(tmpDir, 'bad.json')
    fs.writeFileSync(filepath, 'NOT_VALID_JSON{{{')
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.size).toBe(0)
  })

  it('returns an empty Map when templates section is absent for the modality', async () => {
    const json = makeJson()
    delete (json.templates as Record<string, unknown>)['scs']
    const filepath = writeJson(json)
    const result = await fetchDatasheetsPayloads('scripted', filepath)()
    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') expect(result.right.size).toBe(0)
  })
})
