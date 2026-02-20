import {
  sanitizeLicenseName,
  generateTarFilename,
  pathsFilter,
} from './compress'

describe('sanitizeLicenseName', () => {
  it('passes through simple names unchanged', () => {
    expect(sanitizeLicenseName('CC0-1.0')).toBe('CC0-1.0')
  })

  it('replaces spaces with underscores', () => {
    expect(sanitizeLicenseName('CC BY SA')).toBe('CC_BY_SA')
  })

  it('replaces slashes with underscores', () => {
    expect(sanitizeLicenseName('CC-BY/NC')).toBe('CC-BY_NC')
  })

  it('replaces backslashes with underscores', () => {
    expect(sanitizeLicenseName('CC\\BY')).toBe('CC_BY')
  })

  it('replaces colons with underscores', () => {
    expect(sanitizeLicenseName('License:V2')).toBe('License_V2')
  })

  it('replaces multiple special characters', () => {
    expect(sanitizeLicenseName('CC BY-SA/4.0:final')).toBe('CC_BY-SA_4.0_final')
  })

  it('handles empty string', () => {
    expect(sanitizeLicenseName('')).toBe('')
  })
})

describe('generateTarFilename', () => {
  it('generates unlicensed filename', () => {
    expect(generateTarFilename('en', 'cv-19.0')).toBe('cv-19.0-en.tar.gz')
  })

  it('generates licensed filename with sanitized license', () => {
    expect(generateTarFilename('en', 'cv-19.0-licensed', 'CC-BY-SA-4.0')).toBe(
      'cv-19.0-licensed-en-CC-BY-SA-4.0.tar.gz',
    )
  })

  it('sanitizes license with special characters in filename', () => {
    expect(generateTarFilename('fr', 'cv-19.0-licensed', 'CC BY/NC')).toBe(
      'cv-19.0-licensed-fr-CC_BY_NC.tar.gz',
    )
  })

  it('generates delta unlicensed filename', () => {
    expect(generateTarFilename('en', 'cv-19.0-delta')).toBe(
      'cv-19.0-delta-en.tar.gz',
    )
  })

  it('generates delta licensed filename', () => {
    expect(
      generateTarFilename('en', 'cv-19.0-delta-licensed', 'CC0-1.0'),
    ).toBe('cv-19.0-delta-licensed-en-CC0-1.0.tar.gz')
  })
})

describe('pathsFilter', () => {
  describe('full release', () => {
    const filter = pathsFilter('full')

    it('excludes clips.tsv', () => {
      expect(filter('clips.tsv')).toBe(false)
    })

    it('includes CorporaCreator split files', () => {
      expect(filter('dev.tsv')).toBe(true)
      expect(filter('test.tsv')).toBe(true)
      expect(filter('train.tsv')).toBe(true)
    })

    it('includes other CorporaCreator files', () => {
      expect(filter('validated.tsv')).toBe(true)
      expect(filter('invalidated.tsv')).toBe(true)
      expect(filter('other.tsv')).toBe(true)
    })

    it('includes sentence files', () => {
      expect(filter('reported.tsv')).toBe(true)
      expect(filter('validated_sentences.tsv')).toBe(true)
      expect(filter('unvalidated_sentences.tsv')).toBe(true)
    })

    it('includes clip_durations.tsv', () => {
      expect(filter('clip_durations.tsv')).toBe(true)
    })

    it('includes clips directory', () => {
      expect(filter('clips')).toBe(true)
    })
  })

  describe('delta release', () => {
    const filter = pathsFilter('delta')

    it('excludes clips.tsv', () => {
      expect(filter('clips.tsv')).toBe(false)
    })

    it('excludes CorporaCreator split files', () => {
      expect(filter('dev.tsv')).toBe(false)
      expect(filter('test.tsv')).toBe(false)
      expect(filter('train.tsv')).toBe(false)
    })

    it('includes other CorporaCreator files', () => {
      expect(filter('validated.tsv')).toBe(true)
      expect(filter('invalidated.tsv')).toBe(true)
      expect(filter('other.tsv')).toBe(true)
    })

    it('includes sentence and reporting files', () => {
      expect(filter('reported.tsv')).toBe(true)
      expect(filter('validated_sentences.tsv')).toBe(true)
    })

    it('includes clips directory', () => {
      expect(filter('clips')).toBe(true)
    })
  })

  it('works with full path (uses basename)', () => {
    const filter = pathsFilter('full')
    expect(filter('/some/path/to/clips.tsv')).toBe(false)
    expect(filter('/some/path/to/validated.tsv')).toBe(true)
  })
})
