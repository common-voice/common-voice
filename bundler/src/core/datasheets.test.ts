import {
  fillTemplate,
  buildReplacementMap,
  buildDataSplitsTable,
  buildVariantStatsTable,
  buildAccentStatsTable,
  buildTextCorpusStatsTable,
  buildSourcesStatsTable,
  buildTextDomainStatsTable,
} from './datasheets'
import { DatasheetLocalePayload } from '../types'
import type { Buckets, LocaleReleaseData } from './localeData'

// -- Test data factory -------------------------------------------------------

const makeLocaleData = (
  overrides: Partial<LocaleReleaseData> = {},
): LocaleReleaseData => ({
  clips: 100,
  speakers: 10,
  totalHrs: 1.5,
  validHrs: 1.2,
  genderCounts: { male_masculine: 60, female_feminine: 30, '': 10 },
  ageCounts: { twenties: 40, thirties: 30, '': 30 },
  domainCounts: {},
  variantCounts: {},
  accentCounts: {},
  buckets: { train: 50, dev: 15, test: 15, validated: 80, invalidated: 10, other: 0 },
  validatedSentences: 0,
  unvalidatedSentences: 0,
  rejectedSentences: 0,
  pendingSentences: 0,
  reportedSentences: 0,
  sourceCounts: {},
  sentenceVariantCounts: {},
  totalDurationMs: 5_400_000,
  avgDurationSecs: 54,
  validDurationSecs: 4320,
  sentencesSample: [],
  ...overrides,
})

// -- fillTemplate ------------------------------------------------------------

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

  it('injects DATA_SPLITS_TABLE after "## Data splits" header when no placeholder exists', () => {
    const template = '## Data splits for modelling\n\n## Text corpus'
    const result = fillTemplate(template, {
      DATA_SPLITS_TABLE: '| Split | Clips |\n|---|---|\n| Train | 30 |',
    })
    expect(result).toContain('## Data splits for modelling')
    expect(result).toContain('| Train | 30 |')
    expect(result).toContain('## Text corpus')
  })

  it('uses {{DATA_SPLITS_TABLE}} placeholder when it exists in template', () => {
    const template = '## Data splits\n\n{{DATA_SPLITS_TABLE}}\n\n## Next'
    const result = fillTemplate(template, {
      DATA_SPLITS_TABLE: '| Split | Clips |\n|---|---|\n| Train | 30 |',
    })
    expect(result).toContain('| Train | 30 |')
  })
})

// -- buildReplacementMap -----------------------------------------------------

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

  const baseData = makeLocaleData()

  it('sets metadata fields', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['NATIVE_NAME']).toBe('Deutsch')
    expect(map['ENGLISH_NAME']).toBe('German')
    expect(map['LOCALE']).toBe('de')
    expect(map['VERSION']).toBe('cv-corpus-25.0')
  })

  it('sets auto-generated stats', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['CLIPS']).toBe('100')
    expect(map['HOURS_RECORDED']).toBe('1.5')
    expect(map['HOURS_VALIDATED']).toBe('1.2')
    expect(map['SPEAKERS']).toBe('10')
  })

  it('generates GENDER_TABLE as markdown', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['GENDER_TABLE']).toContain('| Gender | Frequency |')
    expect(map['GENDER_TABLE']).toContain('Male, masculine')
    expect(map['GENDER_TABLE']).toContain('60.0%')
  })

  it('generates AGE_TABLE as markdown', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['AGE_TABLE']).toContain('| Age band | Frequency |')
    expect(map['AGE_TABLE']).toContain('Twenties')
  })

  it('includes non-empty community fields (uppercased)', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['LANGUAGE_DESCRIPTION']).toBe(
      'German is a West Germanic language.',
    )
  })

  it('does not include empty community fields', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['VARIANT_DESCRIPTION']).toBeUndefined()
    expect(map['FUNDING_DESCRIPTION']).toBeUndefined()
  })

  it('formats sentences sample as numbered list', () => {
    const data = makeLocaleData({
      sentencesSample: ['Hello world', 'Good morning', 'How are you'],
    })
    const map = buildReplacementMap(basePayload, data, 'de', 'cv-corpus-25.0')
    expect(map['SENTENCES_SAMPLE']).toBe(
      '1. Hello world\n2. Good morning\n3. How are you',
    )
  })

  it('does not set SENTENCES_SAMPLE when no sentences available', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['SENTENCES_SAMPLE']).toBeUndefined()
  })

  it('community fields override auto fields when key matches', () => {
    const payload: DatasheetLocalePayload = {
      ...basePayload,
      community_fields: {
        ...basePayload.community_fields,
        gender_table: '| Custom | Table |',
      },
    }
    const map = buildReplacementMap(payload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['GENDER_TABLE']).toBe('| Custom | Table |')
  })

  it('generates DATA_SPLITS_TABLE from buckets', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['DATA_SPLITS_TABLE']).toContain('Train')
    expect(map['DATA_SPLITS_TABLE']).toContain('50 (50.0%)')
  })

  it('includes new stats tables when data is present', () => {
    const data = makeLocaleData({
      variantCounts: { 'Southern Welsh': 20 },
      accentCounts: { 'Welsh English': 15 },
      domainCounts: { general: 80, healthcare: 20 },
      sourceCounts: { Wikipedia: 50, Tatoeba: 30 },
      validatedSentences: 100,
      unvalidatedSentences: 20,
      pendingSentences: 15,
      rejectedSentences: 5,
      reportedSentences: 3,
    })
    const map = buildReplacementMap(basePayload, data, 'de', 'cv-corpus-25.0')
    expect(map['VARIANT_STATS_TABLE']).toContain('Southern Welsh')
    expect(map['ACCENT_STATS_TABLE']).toContain('Welsh English')
    expect(map['TEXT_CORPUS_STATS_TABLE']).toContain('Validated sentences')
    expect(map['SOURCES_STATS_TABLE']).toContain('Wikipedia')
    expect(map['TEXT_DOMAIN_STATS_TABLE']).toContain('general')
  })

  it('omits new stats tables when data is empty', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['VARIANT_STATS_TABLE']).toBeUndefined()
    expect(map['ACCENT_STATS_TABLE']).toBeUndefined()
    expect(map['TEXT_CORPUS_STATS_TABLE']).toBeUndefined()
    expect(map['SOURCES_STATS_TABLE']).toBeUndefined()
    expect(map['TEXT_DOMAIN_STATS_TABLE']).toBeUndefined()
  })
})

// -- buildDataSplitsTable ----------------------------------------------------

describe('buildDataSplitsTable', () => {
  it('builds table from CC buckets', () => {
    const buckets: Buckets = {
      train: 30, dev: 10, test: 10,
      validated: 50, invalidated: 0, other: 50,
    }
    const result = buildDataSplitsTable(buckets, 100)
    expect(result).toContain('| Split | Clips |')
    expect(result).toContain('Train')
    expect(result).toContain('30 (30.0%)')
    expect(result).toContain('Dev')
    expect(result).toContain('Test')
    expect(result).toContain('Validated')
    expect(result).toContain('Other')
  })

  it('returns empty string when all buckets are zero', () => {
    const buckets: Buckets = {
      train: 0, dev: 0, test: 0,
      validated: 0, invalidated: 0, other: 0,
    }
    const result = buildDataSplitsTable(buckets, 100)
    expect(result).toBe('')
  })

  it('omits splits with 0 clips', () => {
    const buckets: Buckets = {
      train: 10, dev: 0, test: 0,
      validated: 0, invalidated: 0, other: 0,
    }
    const result = buildDataSplitsTable(buckets, 10)
    expect(result).toContain('Train')
    expect(result).not.toContain('Dev')
    expect(result).not.toContain('Invalidated')
  })
})

// -- buildVariantStatsTable --------------------------------------------------

describe('buildVariantStatsTable', () => {
  it('builds variant table sorted by count', () => {
    const result = buildVariantStatsTable(
      { 'Southern Welsh': 30, 'Northern Welsh': 70 },
      100,
    )
    expect(result).toContain('| Variant | Clips |')
    expect(result).toContain('Northern Welsh')
    expect(result).toContain('70 (70.0%)')
    expect(result).toContain('Southern Welsh')
    // Northern should come first (sorted descending)
    expect(result.indexOf('Northern Welsh')).toBeLessThan(
      result.indexOf('Southern Welsh'),
    )
  })

  it('returns empty string for empty counts', () => {
    expect(buildVariantStatsTable({}, 100)).toBe('')
  })
})

// -- buildAccentStatsTable ---------------------------------------------------

describe('buildAccentStatsTable', () => {
  it('builds accent table with percentages', () => {
    const result = buildAccentStatsTable({ 'Welsh English': 50 }, 100)
    expect(result).toContain('| Accent | Clips |')
    expect(result).toContain('Welsh English')
    expect(result).toContain('50.0%')
  })

  it('returns empty string for empty counts', () => {
    expect(buildAccentStatsTable({}, 100)).toBe('')
  })
})

// -- buildTextCorpusStatsTable -----------------------------------------------

describe('buildTextCorpusStatsTable', () => {
  it('builds corpus stats table with non-zero rows', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 100,
      unvalidatedSentences: 20,
      pendingSentences: 15,
      rejectedSentences: 5,
      reportedSentences: 3,
    })
    expect(result).toContain('| Category | Count |')
    expect(result).toContain('Validated sentences')
    expect(result).toContain('100')
    expect(result).toContain('Rejected sentences')
    expect(result).toContain('5')
  })

  it('omits zero-count categories', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 50,
      unvalidatedSentences: 0,
      pendingSentences: 0,
      rejectedSentences: 0,
      reportedSentences: 0,
    })
    expect(result).toContain('Validated sentences')
    expect(result).not.toContain('Unvalidated')
    expect(result).not.toContain('Rejected')
  })

  it('returns empty string when all are zero', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 0,
      unvalidatedSentences: 0,
      pendingSentences: 0,
      rejectedSentences: 0,
      reportedSentences: 0,
    })
    expect(result).toBe('')
  })
})

// -- buildSourcesStatsTable --------------------------------------------------

describe('buildSourcesStatsTable', () => {
  it('builds sources table with percentage of total sentences', () => {
    const result = buildSourcesStatsTable({ Wikipedia: 60, Tatoeba: 40 })
    expect(result).toContain('| Source | Sentences |')
    expect(result).toContain('Wikipedia')
    expect(result).toContain('60.0%')
    expect(result).toContain('Tatoeba')
    expect(result).toContain('40.0%')
  })

  it('returns empty string for empty counts', () => {
    expect(buildSourcesStatsTable({})).toBe('')
  })
})

// -- buildTextDomainStatsTable -----------------------------------------------

describe('buildTextDomainStatsTable', () => {
  it('builds domain table with percentages of total clips', () => {
    const result = buildTextDomainStatsTable(
      { general: 80, healthcare: 20 },
      100,
    )
    expect(result).toContain('| Domain | Clips |')
    expect(result).toContain('general')
    expect(result).toContain('80 (80.0%)')
    expect(result).toContain('healthcare')
    expect(result).toContain('20 (20.0%)')
  })

  it('returns empty string for empty counts', () => {
    expect(buildTextDomainStatsTable({}, 100)).toBe('')
  })
})

// -- Integration: fillTemplate + buildReplacementMap -------------------------

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

    const data = makeLocaleData({
      clips: 1000,
      speakers: 50,
      totalHrs: 12.5,
      validHrs: 10.3,
      genderCounts: { male_masculine: 600, female_feminine: 400 },
      ageCounts: { twenties: 500, thirties: 500 },
    })

    const replacements = buildReplacementMap(payload, data, 'de', 'cv-corpus-25.0')
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
