export type TaxonomyToken = 'singlewordBenchmark' | 'covid19Spotter'

export type TaxonomyType = {
  name: string
  source: string
  locales: string[]
}

export const taxonomies: { [key in TaxonomyToken]: TaxonomyType } = {
  singlewordBenchmark: {
    name: 'Benchmark',
    source: 'singleword-benchmark',
    locales: [
      'ab',
      'cs',
      'cv',
      'da',
      'ka',
      'kab',
      'ky',
      'or',
      'rw',
      'sv',
      'zh-CN',
      'zh-HK',
    ],
  },
  covid19Spotter: {
    name: 'Covid-19 Keyword Spotter',
    source: 'du-covid-keywords',
    locales: ['rw'],
  },
}

export const sentenceDomains = [
  'general',
  'agriculture',
  'automotive',
  'finance',
  'food_service_retail',
  'healthcare',
  'history_law_government',
  'language_fundamentals',
  'media_entertainment',
  'nature_environment',
  'news_current_affairs',
  'technology_robotics',
] as const

export type SentenceDomain = typeof sentenceDomains[number]
