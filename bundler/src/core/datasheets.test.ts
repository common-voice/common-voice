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
  genderSpeakers: { male_masculine: 6, female_feminine: 3, '': 1 },
  ageSpeakers: { twenties: 4, thirties: 3, '': 3 },
  domainSpeakers: {},
  variantSpeakers: {},
  accentSpeakers: {},
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
    const template = '# {{NATIVE_NAME}} ({{LOCALE}})\n\nSome body text.'
    const result = fillTemplate(template, {
      NATIVE_NAME: 'Deutsch',
      LOCALE: 'de',
    })
    expect(result).toBe('# Deutsch (de)\n\nSome body text.\n')
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

  it('removes unfilled placeholders, their comments, and the dangling header', () => {
    const template = [
      '## Variants',
      '',
      '<!-- {{VARIANT_DESCRIPTION}} -->',
      '<!-- @ OPTIONAL @ -->',
      '<!-- Describe the variants -->',
      '',
      '## Next',
      '',
      'Content here.',
    ].join('\n')
    const result = fillTemplate(template, {})
    expect(result).not.toContain('VARIANT_DESCRIPTION')
    expect(result).not.toContain('OPTIONAL')
    expect(result).not.toContain('Describe the variants')
    expect(result).not.toContain('## Variants')
    expect(result).toContain('## Next')
  })

  it('keeps header when at least one placeholder is filled', () => {
    const template = [
      '### Variants',
      '',
      '<!-- {{VARIANT_DESCRIPTION}} -->',
      '<!-- {{VARIANT_STATS}} -->',
      '',
      '### Next',
      '',
      'Content here.',
    ].join('\n')
    const result = fillTemplate(template, {
      VARIANT_STATS: '| Variant | Clips |\n|---|---|\n| Welsh | 50 |',
    })
    expect(result).toContain('### Variants')
    expect(result).toContain('| Welsh | 50 |')
    expect(result).toContain('### Next')
  })

  it('removes parent header when all sub-sections are stripped', () => {
    const template = [
      '## Text corpus',
      '',
      '### Sources',
      '',
      '<!-- {{SOURCES_STATS}} -->',
      '',
      '### Text domains',
      '',
      '<!-- {{TEXT_DOMAIN_STATS}} -->',
      '',
      '## Next section',
      '',
      'Some real content here.',
    ].join('\n')
    const result = fillTemplate(template, {})
    expect(result).not.toContain('## Text corpus')
    expect(result).not.toContain('### Sources')
    expect(result).not.toContain('### Text domains')
    expect(result).toContain('## Next section')
    expect(result).toContain('Some real content here.')
  })

  it('keeps parent header when at least one sub-section has content', () => {
    const template = [
      '## Text corpus',
      '',
      '### Sources',
      '',
      '<!-- {{SOURCES_STATS}} -->',
      '',
      '### Text domains',
      '',
      '<!-- {{TEXT_DOMAIN_STATS}} -->',
      '',
      '## Next section',
      '',
      'Content here.',
    ].join('\n')
    const result = fillTemplate(template, {
      SOURCES_STATS: '| Source | Sentences |\n|---|---|\n| Wikipedia | 100 |',
    })
    expect(result).toContain('## Text corpus')
    expect(result).toContain('### Sources')
    expect(result).toContain('| Wikipedia | 100 |')
    expect(result).not.toContain('### Text domains')
    expect(result).toContain('## Next section')
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
    const template = '## Data splits for modelling\n\n## Text corpus\n\nCorpus details here.'
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

  it('sets auto-generated clip stats', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['CLIPS']).toBe('100')
    expect(map['HOURS_RECORDED']).toBe('1.5')
    expect(map['HOURS_VALIDATED']).toBe('1.2')
    expect(map['SPEAKERS']).toBe('10')
    expect(map['VALIDATED_CLIPS']).toBe('80')
    expect(map['INVALIDATED_CLIPS']).toBe('10')
    expect(map['OTHER_CLIPS']).toBe('0')
    expect(map['AVG_DURATION_SECS']).toBe('54')
  })

  it('sets auto-generated sentence stats', () => {
    const data = makeLocaleData({
      validatedSentences: 200,
      unvalidatedSentences: 50,
      pendingSentences: 30,
      rejectedSentences: 20,
      reportedSentences: 5,
    })
    const map = buildReplacementMap(basePayload, data, 'de', 'cv-corpus-25.0')
    expect(map['TOTAL_SENTENCES']).toBe('250')
    expect(map['VALIDATED_SENTENCES']).toBe('200')
    expect(map['UNVALIDATED_SENTENCES']).toBe('50')
    expect(map['PENDING_SENTENCES']).toBe('30')
    expect(map['REJECTED_SENTENCES']).toBe('20')
    expect(map['REPORTED_SENTENCES']).toBe('5')
  })

  it('generates GENDER_TABLE with Code column, fixed order, and coverage', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['GENDER_TABLE']).toContain('| Code | Gender | Clips | Speakers |')
    // Code + label columns
    expect(map['GENDER_TABLE']).toContain('male_masculine')
    expect(map['GENDER_TABLE']).toContain('Male, masculine')
    expect(map['GENDER_TABLE']).toContain('60 (60.0%)')
    expect(map['GENDER_TABLE']).toContain('6 (60.0%)')
    // All rows shown including 0-count
    expect(map['GENDER_TABLE']).toContain('transgender')
    expect(map['GENDER_TABLE']).toContain('non-binary')
    expect(map['GENDER_TABLE']).toContain('do_not_wish_to_say')
    expect(map['GENDER_TABLE']).toContain('Unspecified')
    // Unspecified code shows '-'
    expect(map['GENDER_TABLE']).toContain('| - | Unspecified')
    // Coverage line
    expect(map['GENDER_TABLE']).toContain('Gender declared: 90 of 100 clips (90.0%)')
    expect(map['GENDER_TABLE']).toContain('9 of 10 speakers (90.0%)')
  })

  it('generates AGE_TABLE with Code column, fixed order, and coverage', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['AGE_TABLE']).toContain('| Code | Age | Clips | Speakers |')
    // Code + label columns
    expect(map['AGE_TABLE']).toContain('twenties')
    expect(map['AGE_TABLE']).toContain('Twenties')
    expect(map['AGE_TABLE']).toContain('4 (40.0%)')
    // All rows shown
    expect(map['AGE_TABLE']).toContain('teens')
    expect(map['AGE_TABLE']).toContain('fifties')
    expect(map['AGE_TABLE']).toContain('| - | Unspecified')
    // Coverage line
    expect(map['AGE_TABLE']).toContain('Age declared: 70 of 100 clips (70.0%)')
    expect(map['AGE_TABLE']).toContain('7 of 10 speakers (70.0%)')
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
      '1. *Hello world*\n2. *Good morning*\n3. *How are you*',
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

  it('generates DATA_SPLITS_TABLE with clip buckets and training splits', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    // Clip buckets: validated 80 of 100 total = 80.0%
    expect(map['DATA_SPLITS_TABLE']).toContain('**Clip buckets**')
    expect(map['DATA_SPLITS_TABLE']).toContain('Validated')
    expect(map['DATA_SPLITS_TABLE']).toContain('80 (80.0%)')
    // Training splits: train 50 of 80 validated = 62.5%
    expect(map['DATA_SPLITS_TABLE']).toContain('**Training splits**')
    expect(map['DATA_SPLITS_TABLE']).toContain('Train')
    expect(map['DATA_SPLITS_TABLE']).toContain('50 (62.5%)')
    // Coverage: (50+15+15)/80 = 100.0%
    expect(map['DATA_SPLITS_TABLE']).toContain('coverage')
  })

  it('includes new stats tables when data is present', () => {
    const data = makeLocaleData({
      variantCounts: { 'Southern Welsh': 20 },
      accentCounts: { 'Welsh English': 15 },
      domainCounts: { general: 80, healthcare: 20 },
      sourceCounts: { Wikipedia: 50, Tatoeba: 30 },
      variantSpeakers: { 'Southern Welsh': 5 },
      accentSpeakers: { 'Welsh English': 3 },
      domainSpeakers: { general: 8, healthcare: 4 },
      validatedSentences: 100,
      unvalidatedSentences: 20,
      pendingSentences: 15,
      rejectedSentences: 5,
      reportedSentences: 3,
    })
    const map = buildReplacementMap(basePayload, data, 'de', 'cv-corpus-25.0')
    expect(map['VARIANT_STATS']).toContain('Southern Welsh')
    expect(map['ACCENT_STATS']).toContain('Welsh English')
    expect(map['TEXT_CORPUS_STATS']).toContain('Validated sentences')
    expect(map['SOURCES_STATS']).toContain('Wikipedia')
    expect(map['TEXT_DOMAIN_STATS']).toContain('General')
  })

  it('omits stats tables when data is empty (no entries)', () => {
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['VARIANT_STATS']).toBeUndefined()
    expect(map['ACCENT_STATS']).toBeUndefined()
    expect(map['SOURCES_STATS']).toBeUndefined()
    expect(map['TEXT_DOMAIN_STATS']).toBeUndefined()
  })

  it('always generates TEXT_CORPUS_STATS with breakdown table', () => {
    // Even with all-zero sentences, the breakdown table is produced
    const map = buildReplacementMap(basePayload, baseData, 'de', 'cv-corpus-25.0')
    expect(map['TEXT_CORPUS_STATS']).toBeDefined()
    expect(map['TEXT_CORPUS_STATS']).toContain('| Category | Count |')
  })
})

// -- buildDataSplitsTable ----------------------------------------------------

describe('buildDataSplitsTable', () => {
  it('builds clip buckets and training splits as two sections', () => {
    const buckets: Buckets = {
      train: 30, dev: 10, test: 10,
      validated: 50, invalidated: 0, other: 50,
    }
    const result = buildDataSplitsTable(buckets, 100)
    // Clip buckets section
    expect(result).toContain('**Clip buckets**')
    expect(result).toContain('| Bucket | Clips |')
    expect(result).toContain('Validated')
    expect(result).toContain('50 (50.0%)')
    expect(result).toContain('Other')
    expect(result).toContain('50 (50.0%)')
    // Training splits section
    expect(result).toContain('**Training splits**')
    expect(result).toContain('| Split | Clips |')
    expect(result).toContain('Train')
    // Training splits are % of validated (50), so 30/50 = 60.0%
    expect(result).toContain('30 (60.0%)')
    expect(result).toContain('Dev')
    expect(result).toContain('Test')
  })

  it('shows training split coverage', () => {
    const buckets: Buckets = {
      train: 300, dev: 100, test: 100,
      validated: 1000, invalidated: 100, other: 50,
    }
    const result = buildDataSplitsTable(buckets, 1150)
    expect(result).toContain('Training split coverage: 500 of 1,000 validated clips (50.0%)')
  })

  it('shows all 6 rows even when counts are zero', () => {
    const buckets: Buckets = {
      train: 0, dev: 0, test: 0,
      validated: 0, invalidated: 0, other: 0,
    }
    const result = buildDataSplitsTable(buckets, 100)
    expect(result).toContain('**Clip buckets**')
    expect(result).toContain('Validated')
    expect(result).toContain('Invalidated')
    expect(result).toContain('Other')
    expect(result).toContain('**Training splits**')
    expect(result).toContain('Train')
    expect(result).toContain('Dev')
    expect(result).toContain('Test')
  })

  it('shows zero-count buckets and splits', () => {
    const buckets: Buckets = {
      train: 10, dev: 0, test: 0,
      validated: 20, invalidated: 0, other: 0,
    }
    const result = buildDataSplitsTable(buckets, 20)
    expect(result).toContain('Validated')
    expect(result).toContain('Invalidated')
    expect(result).toContain('Train')
    expect(result).toContain('Dev')
    expect(result).toContain('Test')
  })

  it('always shows both sections', () => {
    const buckets: Buckets = {
      train: 0, dev: 0, test: 0,
      validated: 50, invalidated: 10, other: 40,
    }
    const result = buildDataSplitsTable(buckets, 100)
    expect(result).toContain('**Clip buckets**')
    expect(result).toContain('**Training splits**')
  })

  it('omits coverage line when validated is 0', () => {
    const buckets: Buckets = {
      train: 0, dev: 0, test: 0,
      validated: 0, invalidated: 50, other: 50,
    }
    const result = buildDataSplitsTable(buckets, 100)
    expect(result).not.toContain('coverage')
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

  it('shows zero-count variants', () => {
    const result = buildVariantStatsTable(
      { 'Southern Welsh': 0, 'Northern Welsh': 70 },
      100,
    )
    expect(result).toContain('Southern Welsh')
    expect(result).toContain('-')
    expect(result).toContain('Northern Welsh')
  })

  it('adds Code column when codeMap is provided', () => {
    const counts = { 'Southern Welsh': 30, 'Northern Welsh': 70 }
    const codeMap = {
      'Southern Welsh': 'southwes',
      'Northern Welsh': 'northwes',
    }
    const result = buildVariantStatsTable(
      counts, 100, 'en', undefined, undefined, codeMap,
    )
    expect(result).toContain('| Code |')
    expect(result).toContain('southwes')
    expect(result).toContain('northwes')
    expect(result).toContain('Southern Welsh')
  })

  it('shows "-" for missing variant codes', () => {
    const counts = { 'Southern Welsh': 30, 'No Code': 20 }
    const codeMap = { 'Southern Welsh': 'southwes' }
    const result = buildVariantStatsTable(
      counts, 100, 'en', undefined, undefined, codeMap,
    )
    expect(result).toContain('southwes')
    expect(result).toContain('| - | No Code')
  })

  it('omits Code column when no codeMap', () => {
    const result = buildVariantStatsTable(
      { 'Southern Welsh': 30 }, 100,
    )
    expect(result).not.toContain('Code')
    expect(result).toContain('| Variant | Clips |')
  })

  it('includes speakers column when speaker data provided', () => {
    const result = buildVariantStatsTable(
      { 'Southern Welsh': 30, 'Northern Welsh': 70 },
      100,
      'en',
      { 'Southern Welsh': 5, 'Northern Welsh': 8 },
      10,
    )
    expect(result).toContain('| Variant | Clips | Speakers |')
    expect(result).toContain('5 (50.0%)')
    expect(result).toContain('8 (80.0%)')
  })
})

// -- buildAccentStatsTable ---------------------------------------------------

describe('buildAccentStatsTable', () => {
  it('builds accent table with percentages (no code map)', () => {
    const result = buildAccentStatsTable({ 'Welsh English': 50 }, 100)
    expect(result).toContain('| Accent | Clips |')
    expect(result).not.toContain('Code')
    expect(result).toContain('Welsh English')
    expect(result).toContain('50.0%')
  })

  it('returns empty string for empty counts', () => {
    expect(buildAccentStatsTable({}, 100)).toBe('')
  })

  it('groups user-submitted accents under Other when predefinedNames given', () => {
    const counts = {
      'England English': 30,
      'İstanbul türkçesi': 20,
      'Welsh English': 10,
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined,
      ['England English', 'Welsh English'],
    )
    expect(result).toContain('England English')
    expect(result).toContain('Welsh English')
    expect(result).not.toContain('İstanbul')
    expect(result).toContain('Other')
    expect(result).toContain('20')
  })

  it('always shows Other row when predefinedNames given (even if 0)', () => {
    const counts = {
      'England English': 50,
      'Welsh English': 50,
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined,
      ['England English', 'Welsh English'],
    )
    expect(result).toContain('Other')
    expect(result).toContain('-')
  })

  it('groups individual user-submitted accents under Other', () => {
    const counts = {
      'England English': 25,
      'İstanbul türkçesi': 15,
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined,
      ['England English'],
    )
    expect(result).toContain('England English')
    expect(result).toContain('25')
    expect(result).toContain('Other')
    expect(result).toContain('15')
    expect(result).not.toContain('İstanbul')
  })

  it('does not filter when predefinedNames is undefined', () => {
    const counts = { 'İstanbul türkçesi': 20 }
    const result = buildAccentStatsTable(counts, 100)
    expect(result).toContain('İstanbul türkçesi')
    expect(result).not.toContain('Other')
  })

  it('shows all accents when predefinedNames is empty array', () => {
    const counts = { 'İstanbul türkçesi': 20, 'Custom accent': 10 }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined, [],
    )
    // Empty predefinedNames array → no filtering (no predefined accents exist)
    expect(result).toContain('İstanbul türkçesi')
    expect(result).toContain('Custom accent')
    expect(result).not.toContain('Other')
  })

  it('adds Code column when codeMap is provided', () => {
    const counts = { 'England English': 30, 'Welsh English': 20 }
    const codeMap = {
      'England English': 'england-english',
      'Welsh English': 'welsh-english',
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined, undefined, codeMap,
    )
    expect(result).toContain('| Code |')
    expect(result).toContain('england-english')
    expect(result).toContain('welsh-english')
    expect(result).toContain('England English')
  })

  it('looks up individual accent codes directly from codeMap', () => {
    const counts = { 'England English': 30, 'Welsh English': 20 }
    const codeMap = {
      'England English': 'england-english',
      'Welsh English': 'welsh-english',
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined, undefined, codeMap,
    )
    expect(result).toContain('england-english')
    expect(result).toContain('welsh-english')
  })

  it('shows "-" for empty or missing accent codes', () => {
    const counts = { 'England English': 30, 'User Accent': 20 }
    const codeMap: Record<string, string> = {
      'England English': 'england-english',
      'User Accent': '',
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined, undefined, codeMap,
    )
    expect(result).toContain('england-english')
    // Empty code → shows '-'
    expect(result).toContain('| - | User Accent')
  })

  it('shows "-" for Other row code when filtering with codeMap', () => {
    const counts = { 'England English': 30, 'User Accent': 20 }
    const codeMap = { 'England English': 'england-english' }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined,
      ['England English'], codeMap,
    )
    expect(result).toContain('england-english')
    expect(result).toContain('Other')
    // Other row should have '-' code
    expect(result).toContain('| - | Other')
  })

  it('sorts Other row last regardless of count', () => {
    const counts = {
      'England English': 10,
      'Welsh English': 5,
    }
    // İstanbul türkçesi (50 clips) is user-submitted → grouped under Other
    // Other has highest count (50) but should still appear last
    const allCounts = { ...counts, 'İstanbul türkçesi': 50 }
    const result = buildAccentStatsTable(
      allCounts, 100, 'en', undefined, undefined,
      ['England English', 'Welsh English'],
    )
    const lines = result.split('\n')
    const lastDataRow = lines[lines.length - 1]
    expect(lastDataRow).toContain('Other')
  })

  it('truncates long accent codes', () => {
    const counts = { 'Very Long Accent Name': 10 }
    const codeMap = {
      'Very Long Accent Name': 'this-is-a-very-long-accent-code-that-exceeds-limit',
    }
    const result = buildAccentStatsTable(
      counts, 100, 'en', undefined, undefined, undefined, codeMap,
    )
    expect(result).toContain('this-is-a-very-long-accen\u2026')
    expect(result).not.toContain('this-is-a-very-long-accent-code-that-exceeds-limit')
  })

  it('shows zero-count accents', () => {
    const counts = { 'England English': 0, 'Welsh English': 50 }
    const result = buildAccentStatsTable(counts, 100)
    expect(result).toContain('England English')
    expect(result).toContain('-')
  })
})

// -- buildTextCorpusStatsTable -----------------------------------------------

describe('buildTextCorpusStatsTable', () => {
  it('shows validated sentences as headline plus breakdown table', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 100,
      unvalidatedSentences: 20,
      pendingSentences: 15,
      rejectedSentences: 5,
      reportedSentences: 3,
    })
    // Headline
    expect(result).toContain('**Validated sentences:** 100')
    // Breakdown table (validated not duplicated in table)
    expect(result).toContain('| Category | Count |')
    expect(result).toContain('Unvalidated sentences')
    expect(result).toContain('Rejected sentences')
    expect(result).toContain('5')
  })

  it('shows all breakdown rows even when zero (as "-")', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 50,
      unvalidatedSentences: 0,
      pendingSentences: 0,
      rejectedSentences: 0,
      reportedSentences: 0,
    })
    expect(result).toContain('**Validated sentences:** 50')
    expect(result).toContain('| Category | Count |')
    expect(result).toContain('Unvalidated sentences')
    expect(result).toContain('Pending sentences')
    expect(result).toContain('Rejected sentences')
    expect(result).toContain('Reported sentences')
    // Zero counts shown as '-'
    const lines = result.split('\n')
    const unvalLine = lines.find(l => l.includes('Unvalidated'))
    expect(unvalLine).toContain('| - |')
  })

  it('shows breakdown table even when all values are zero', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 0,
      unvalidatedSentences: 0,
      pendingSentences: 0,
      rejectedSentences: 0,
      reportedSentences: 0,
    })
    expect(result).toContain('| Category | Count |')
    expect(result).toContain('Unvalidated sentences')
  })

  it('shows breakdown table without headline when validated is 0', () => {
    const result = buildTextCorpusStatsTable({
      validatedSentences: 0,
      unvalidatedSentences: 10,
      pendingSentences: 5,
      rejectedSentences: 0,
      reportedSentences: 0,
    })
    expect(result).not.toContain('**Validated sentences:**')
    expect(result).toContain('Unvalidated sentences')
    expect(result).toContain('Pending sentences')
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

  it('shows zero-count sources', () => {
    const result = buildSourcesStatsTable({ Wikipedia: 0, Tatoeba: 50 })
    expect(result).toContain('Wikipedia')
    expect(result).toContain('Tatoeba')
  })
})

// -- buildTextDomainStatsTable -----------------------------------------------

describe('buildTextDomainStatsTable', () => {
  it('shows all 12 defined domains with Code + Label columns', () => {
    const result = buildTextDomainStatsTable(
      { general: 80, healthcare: 20 },
      100,
    )
    expect(result).toContain('| Code | Domain | Clips |')
    // Code + human-readable label
    expect(result).toContain('general')
    expect(result).toContain('General')
    expect(result).toContain('80 (80.0%)')
    expect(result).toContain('healthcare')
    expect(result).toContain('Healthcare')
    expect(result).toContain('20 (20.0%)')
    // All 12 domains present (empty ones show '-')
    expect(result).toContain('agriculture_food')
    expect(result).toContain('Agriculture and Food')
    expect(result).toContain('finance')
    expect(result).toContain('Finance')
    expect(result).toContain('technology_robotics')
    expect(result).toContain('Technology and Robotics')
    expect(result).toContain('language_fundamentals')
    expect(result).toContain('Language Fundamentals')
  })

  it('preserves definition order (General first)', () => {
    const result = buildTextDomainStatsTable(
      { healthcare: 50, general: 50 },
      100,
    )
    expect(result.indexOf('General')).toBeLessThan(
      result.indexOf('Healthcare'),
    )
  })

  it('returns empty string when no domain has data', () => {
    expect(buildTextDomainStatsTable({}, 100)).toBe('')
  })

  it('shows "-" for zero-count domains', () => {
    const result = buildTextDomainStatsTable(
      { general: 50 },
      100,
    )
    expect(result).toContain('General')
    expect(result).toContain('50 (50.0%)')
    // Healthcare and others show '-'
    const lines = result.split('\n')
    const healthcareLine = lines.find(l => l.includes('Healthcare'))
    expect(healthcareLine).toContain('-')
  })

  it('includes speakers column when speaker data provided', () => {
    const result = buildTextDomainStatsTable(
      { general: 80, healthcare: 20 },
      100,
      'en',
      { general: 8, healthcare: 4 },
      10,
    )
    expect(result).toContain('| Code | Domain | Clips | Speakers |')
    expect(result).toContain('8 (80.0%)')
    expect(result).toContain('4 (40.0%)')
  })

  it('appends extra domains not in the predefined list', () => {
    const result = buildTextDomainStatsTable(
      { general: 50, custom_domain: 30 },
      100,
    )
    expect(result).toContain('General')
    expect(result).toContain('custom_domain')
    expect(result).toContain('30 (30.0%)')
    // custom_domain appears after all defined domains
    expect(result.indexOf('Language Fundamentals')).toBeLessThan(
      result.indexOf('custom_domain'),
    )
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
      genderSpeakers: { male_masculine: 30, female_feminine: 20 },
      ageSpeakers: { twenties: 25, thirties: 25 },
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
    // Auto demographics (Code + label + clips + speakers)
    expect(result).toContain('| Code | Gender | Clips | Speakers |')
    expect(result).toContain('male_masculine')
    expect(result).toContain('Male, masculine')
    expect(result).toContain('600 (60.0%)')
    expect(result).toContain('30 (60.0%)')
    // All gender rows shown (Unspecified with 0)
    expect(result).toContain('Unspecified')
    // Coverage lines
    expect(result).toContain('Gender declared:')
    expect(result).toContain('Age declared:')
    // No remaining HTML comments
    expect(result).not.toContain('<!--')
    expect(result).not.toContain('AUTOMATICALLY GENERATED')
    expect(result).not.toContain('OPTIONAL')
    // Unfilled optional section stripped
    expect(result).not.toContain('FUNDING_DESCRIPTION')
  })
})
