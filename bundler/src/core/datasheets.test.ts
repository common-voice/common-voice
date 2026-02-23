import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  fillTemplate,
  buildReplacementMap,
  sampleSentences,
  extractAutoStats,
} from './datasheets'
import { DatasheetLocalePayload, ValidatedSentence } from '../types'

// -- TSV serialisation helpers -----------------------------------------------

// Column order matches the actual validated_sentences.tsv layout.
// Derived from ValidatedSentence to stay in sync with the type definition.
const VALIDATED_SENTENCES_COLS: (keyof ValidatedSentence)[] = [
  'sentence_id',
  'sentence',
  'variant',
  'sentence_domain',
  'source',
  'is_used',
  'clips_count',
]

const toValidatedSentencesTsv = (rows: ValidatedSentence[]): string => {
  const header = VALIDATED_SENTENCES_COLS.join('\t')
  const dataRows = rows.map(row =>
    VALIDATED_SENTENCES_COLS.map(col => row[col]).join('\t'),
  )
  return [header, ...dataRows].join('\n')
}

// fillTemplate

describe('fillTemplate', () => {
  it('replaces inline {{KEY}} placeholders', () => {
    const template = '# {{NATIVE_NAME}} ({{LOCALE}})'
    const result = fillTemplate(template, {
      NATIVE_NAME: 'Deutsch',
      LOCALE: 'de',
    })
    expect(result).toBe('# Deutsch (de)\n')
  })

  it('replaces <!-- {{KEY}} --> comment-wrapped placeholders', () => {
    const template =
      '## Language\n\n<!-- {{LANGUAGE_DESCRIPTION}} -->\n\nNext section'
    const result = fillTemplate(template, {
      LANGUAGE_DESCRIPTION: 'German is a West Germanic language.',
    })
    expect(result).toContain('German is a West Germanic language.')
    expect(result).not.toContain('<!--')
    expect(result).not.toContain('-->')
  })

  it('strips remaining HTML comments (instructions, examples)', () => {
    const template = [
      '<!-- {{GENDER_TABLE}} -->',
      '<!-- @ AUTOMATICALLY GENERATED @ -->',
      '<!-- ',
      '| Gender | Frequency |',
      '| male | ? |',
      '-->',
    ].join('\n')
    const result = fillTemplate(template, {
      GENDER_TABLE: '| Gender | Frequency |\n|---|---|\n| Male | 50 (100%) |',
    })
    expect(result).toContain('| Male | 50 (100%) |')
    expect(result).not.toContain('AUTOMATICALLY GENERATED')
    expect(result).not.toContain('male | ?')
  })

  it('removes unfilled placeholders and their comments', () => {
    const template = [
      '## Variants',
      '',
      '<!-- {{VARIANT_DESCRIPTION}} -->',
      '<!-- @ OPTIONAL @ -->',
      '<!-- Describe the variants -->',
      '',
      '## Next',
    ].join('\n')
    const result = fillTemplate(template, {})
    expect(result).not.toContain('VARIANT_DESCRIPTION')
    expect(result).not.toContain('OPTIONAL')
    expect(result).not.toContain('Describe the variants')
    expect(result).toContain('## Variants')
    expect(result).toContain('## Next')
  })

  it('collapses excessive blank lines to 2 max', () => {
    const template = 'A\n\n\n\n\nB'
    const result = fillTemplate(template, {})
    expect(result).toBe('A\n\nB\n')
  })

  it('handles mixed inline and comment placeholders in same template', () => {
    const template = [
      '# {{NATIVE_NAME}} --{{ENGLISH_NAME}}',
      '',
      'Contains {{CLIPS}} clips from {{SPEAKERS}} speakers.',
      '',
      '<!-- {{LANGUAGE_DESCRIPTION}} -->',
    ].join('\n')
    const result = fillTemplate(template, {
      NATIVE_NAME: 'Deutsch',
      ENGLISH_NAME: 'German',
      CLIPS: '42',
      SPEAKERS: '5',
      LANGUAGE_DESCRIPTION: 'A language.',
    })
    expect(result).toContain('# Deutsch --German')
    expect(result).toContain('42 clips from 5 speakers')
    expect(result).toContain('A language.')
  })

  it('leaves unmatched inline placeholders as empty strings', () => {
    const template = 'Value: {{UNKNOWN_KEY}}'
    const result = fillTemplate(template, {})
    expect(result).toBe('Value:\n')
  })

  it('handles template with no placeholders', () => {
    const template = '# Just plain markdown\n\nSome text.'
    const result = fillTemplate(template, {})
    expect(result).toBe('# Just plain markdown\n\nSome text.\n')
  })
})

// buildReplacementMap

describe('buildReplacementMap', () => {
  const basePayload: DatasheetLocalePayload = {
    template: '',
    metadata: {
      native_name: 'Deutsch',
      english_name: 'German',
      template_language: 'en',
      funding: '',
      language_request_issue: '1234',
    },
    community_fields: {
      language_description: 'German is a West Germanic language.',
      variant_description: '',
      funding_description: '',
    },
  }

  const baseAutoStats = {
    clips: 100,
    speakers: 10,
    totalHrs: 1.5,
    validHrs: 1.2,
    genderCounts: { male_masculine: 60, female_feminine: 30, '': 10 },
    ageCounts: { twenties: 40, thirties: 30, '': 30 },
    validatedClips: 80,
  }

  it('sets metadata fields', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['NATIVE_NAME']).toBe('Deutsch')
    expect(map['ENGLISH_NAME']).toBe('German')
    expect(map['LOCALE']).toBe('de')
    expect(map['VERSION']).toBe('cv-corpus-25.0')
  })

  it('sets auto-generated stats', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['CLIPS']).toBe('100')
    expect(map['HOURS_RECORDED']).toBe('1.5')
    expect(map['HOURS_VALIDATED']).toBe('1.2')
    expect(map['SPEAKERS']).toBe('10')
  })

  it('generates GENDER_TABLE as markdown', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['GENDER_TABLE']).toContain('| Gender | Frequency |')
    expect(map['GENDER_TABLE']).toContain('Male, masculine')
    expect(map['GENDER_TABLE']).toContain('60.0%')
  })

  it('generates AGE_TABLE as markdown', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['AGE_TABLE']).toContain('| Age band | Frequency |')
    expect(map['AGE_TABLE']).toContain('Twenties')
  })

  it('includes non-empty community fields (uppercased)', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['LANGUAGE_DESCRIPTION']).toBe(
      'German is a West Germanic language.',
    )
  })

  it('does not include empty community fields', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['VARIANT_DESCRIPTION']).toBeUndefined()
    expect(map['FUNDING_DESCRIPTION']).toBeUndefined()
  })

  it('formats sentences sample as numbered list', () => {
    const sentences = ['Hello world', 'Good morning', 'How are you']
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      sentences,
    )
    expect(map['SENTENCES_SAMPLE']).toBe(
      '1. Hello world\n2. Good morning\n3. How are you',
    )
  })

  it('does not set SENTENCES_SAMPLE when no sentences available', () => {
    const map = buildReplacementMap(
      basePayload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    expect(map['SENTENCES_SAMPLE']).toBeUndefined()
  })

  it('community fields override auto fields when key matches', () => {
    const payload: DatasheetLocalePayload = {
      ...basePayload,
      community_fields: {
        ...basePayload.community_fields,
        // Pretend community provides a custom gender table
        gender_table: '| Custom | Table |',
      },
    }
    const map = buildReplacementMap(
      payload,
      baseAutoStats,
      'de',
      'cv-corpus-25.0',
      [],
    )
    // Community field has precedence (applied after auto)
    expect(map['GENDER_TABLE']).toBe('| Custom | Table |')
  })
})

// sampleSentences

describe('sampleSentences', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-test-'))
    fs.mkdirSync(path.join(tmpDir, 'en'), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  const makeRow = (i: number, isUsed: '0' | '1' = '1'): ValidatedSentence => ({
    sentence_id: `id${i}`,
    sentence: `Sentence ${i}`,
    variant: '',
    sentence_domain: 'general',
    source: 'wiki',
    is_used: isUsed,
    clips_count: '3',
  })

  const writeTsv = (tmpDir: string, rows: ValidatedSentence[]) =>
    fs.writeFileSync(
      path.join(tmpDir, 'en', 'validated_sentences.tsv'),
      toValidatedSentencesTsv(rows),
    )

  it('returns 5 sentences from a typical file', () => {
    writeTsv(tmpDir, Array.from({ length: 20 }, (_, i) => makeRow(i)))
    const result = sampleSentences(tmpDir, 'en', 5)
    expect(result).toHaveLength(5)
    result.forEach(s => expect(s).toMatch(/^Sentence \d+$/))
  })

  it('returns fewer than N when file has fewer eligible sentences', () => {
    writeTsv(tmpDir, [makeRow(1)])
    const result = sampleSentences(tmpDir, 'en', 5)
    expect(result).toEqual(['Sentence 1'])
  })

  it('excludes sentences where is_used is not "1"', () => {
    writeTsv(tmpDir, [
      makeRow(0, '1'), // eligible
      makeRow(1, '0'), // not eligible
      makeRow(2, '0'), // not eligible
      makeRow(3, '1'), // eligible
    ])
    const result = sampleSentences(tmpDir, 'en', 10)
    expect(result).toHaveLength(2)
    expect(result).toContain('Sentence 0')
    expect(result).toContain('Sentence 3')
    expect(result).not.toContain('Sentence 1')
    expect(result).not.toContain('Sentence 2')
  })

  it('includes all sentences when is_used column is absent', () => {
    // Write a minimal TSV without the is_used column
    fs.writeFileSync(
      path.join(tmpDir, 'en', 'validated_sentences.tsv'),
      ['sentence_id\tsentence', 'id1\tOnly one'].join('\n'),
    )
    const result = sampleSentences(tmpDir, 'en', 5)
    expect(result).toEqual(['Only one'])
  })

  it('returns empty array for missing file', () => {
    const result = sampleSentences(tmpDir, 'en', 5)
    expect(result).toEqual([])
  })

  it('returns empty array for header-only file', () => {
    writeTsv(tmpDir, [])
    const result = sampleSentences(tmpDir, 'en', 5)
    expect(result).toEqual([])
  })
})

// extractAutoStats

describe('extractAutoStats', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-stats-'))
    fs.mkdirSync(path.join(tmpDir, 'en'), { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  const writeClipsTsv = (rows: string[]) => {
    const header =
      'client_id\tpath\tsentence\tup_votes\tdown_votes\tage\tgender\taccents\tvariant\tlocale\tsegment\tsentence_domain'
    fs.writeFileSync(
      path.join(tmpDir, 'en', 'clips.tsv'),
      [header, ...rows].join('\n'),
    )
  }

  it('counts clips, speakers, and demographics', async () => {
    writeClipsTsv([
      'user1\tclip1.mp3\tHello\t2\t0\ttwenties\tmale_masculine\t\t\ten\t\tgeneral',
      'user1\tclip2.mp3\tWorld\t1\t0\ttwenties\tmale_masculine\t\t\ten\t\tgeneral',
      'user2\tclip3.mp3\tFoo\t1\t0\tthirties\tfemale_feminine\t\t\ten\t\tgeneral',
    ])

    const result = await extractAutoStats(
      path.join(tmpDir, 'en', 'clips.tsv'),
      3600000, // 1 hour
    )()

    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      const stats = result.right
      expect(stats.clips).toBe(3)
      expect(stats.speakers).toBe(2)
      expect(stats.totalHrs).toBe(1)
      expect(stats.genderCounts).toEqual({
        male_masculine: 2,
        female_feminine: 1,
      })
      expect(stats.ageCounts).toEqual({
        twenties: 2,
        thirties: 1,
      })
    }
  })

  it('returns error for missing clips.tsv', async () => {
    const result = await extractAutoStats(
      path.join(tmpDir, 'en', 'clips.tsv'),
      0,
    )()

    expect(result._tag).toBe('Left')
  })

  it('handles empty clips.tsv (header only)', async () => {
    writeClipsTsv([])

    const result = await extractAutoStats(
      path.join(tmpDir, 'en', 'clips.tsv'),
      0,
    )()

    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.clips).toBe(0)
      expect(result.right.speakers).toBe(0)
      expect(result.right.totalHrs).toBe(0)
    }
  })

  it('counts validated clips from validated.tsv when present', async () => {
    writeClipsTsv([
      'user1\tclip1.mp3\tHello\t2\t0\ttwenties\tmale_masculine\t\t\ten\t\tgeneral',
      'user1\tclip2.mp3\tWorld\t1\t0\ttwenties\tmale_masculine\t\t\ten\t\tgeneral',
    ])
    // Write validated.tsv with header + 1 data line
    fs.writeFileSync(
      path.join(tmpDir, 'en', 'validated.tsv'),
      'client_id\tpath\tsentence\n' + 'user1\tclip1.mp3\tHello\n',
    )

    const result = await extractAutoStats(
      path.join(tmpDir, 'en', 'clips.tsv'),
      7200000, // 2 hours
    )()

    expect(result._tag).toBe('Right')
    if (result._tag === 'Right') {
      expect(result.right.validatedClips).toBe(1)
      // validHrs should be based on 1 validated clip out of 2 total,
      // avgDuration = 2hrs/2clips = 1hr = 3600s, validDurationSecs = 3600,
      // validHrs = unitToHours(3600, 's', 2) = 1.0
      expect(result.right.validHrs).toBe(1)
    }
  })
})

// Integration: fillTemplate with buildReplacementMap

describe('fillTemplate + buildReplacementMap integration', () => {
  it('produces a realistic filled datasheet', () => {
    const template = [
      '# *{{NATIVE_NAME}}* &mdash; {{ENGLISH_NAME}} (`{{LOCALE}}`)',
      '',
      'Version {{VERSION}}. Contains {{CLIPS}} clips, {{HOURS_RECORDED}} hours recorded',
      '({{HOURS_VALIDATED}} hours validated) from {{SPEAKERS}} speakers.',
      '',
      '## Language',
      '',
      '<!-- {{LANGUAGE_DESCRIPTION}} -->',
      '<!-- Provide a description -->',
      '',
      '### Gender',
      '',
      '<!-- {{GENDER_TABLE}} -->',
      '<!-- @ AUTOMATICALLY GENERATED @ -->',
      '<!-- ',
      '| Gender | Frequency |',
      '| male | ? |',
      '-->',
      '',
      '### Age',
      '',
      '<!-- {{AGE_TABLE}} -->',
      '<!-- @ AUTOMATICALLY GENERATED @ -->',
      '',
      '## Funding',
      '',
      '<!-- {{FUNDING_DESCRIPTION}} -->',
      '<!-- @ OPTIONAL @ -->',
    ].join('\n')

    const payload: DatasheetLocalePayload = {
      template,
      metadata: {
        native_name: 'Deutsch',
        english_name: 'German',
        template_language: 'en',
      },
      community_fields: {
        language_description:
          'German is spoken in Germany, Austria, and Switzerland.',
        funding_description: '',
      },
    }

    const autoStats = {
      clips: 1000,
      speakers: 50,
      totalHrs: 12.5,
      validHrs: 10.3,
      genderCounts: { male_masculine: 600, female_feminine: 400 },
      ageCounts: { twenties: 500, thirties: 500 },
      validatedClips: 800,
    }

    const replacements = buildReplacementMap(
      payload,
      autoStats,
      'de',
      'cv-corpus-25.0',
      ['Hello', 'World'],
    )
    const result = fillTemplate(template, replacements)

    // Header
    expect(result).toContain('# *Deutsch* &mdash; German (`de`)')
    // Stats
    expect(result).toContain('1000 clips')
    expect(result).toContain('12.5 hours recorded')
    expect(result).toContain('10.3 hours validated')
    expect(result).toContain('50 speakers')
    // Community field filled
    expect(result).toContain(
      'German is spoken in Germany, Austria, and Switzerland.',
    )
    // Auto demographics
    expect(result).toContain('Male, masculine')
    expect(result).toContain('60.0%')
    // No remaining HTML comments
    expect(result).not.toContain('<!--')
    expect(result).not.toContain('AUTOMATICALLY GENERATED')
    expect(result).not.toContain('OPTIONAL')
    // Unfilled optional section stripped
    expect(result).not.toContain('FUNDING_DESCRIPTION')
  })
})
