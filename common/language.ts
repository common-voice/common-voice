// a single accent object
export type Accent = {
  id: number
  name: string
  token?: string
  clientId?: string
}

type SentenceCount = {
  currentCount: number
  targetSentenceCount: number
}

// a single language object
export type Language = {
  id: number
  name: string
  sentenceCount: SentenceCount
  target_sentence_count?: number
  is_contributable?: boolean
  is_translated?: boolean
  english_name?: string
  native_name: string
  text_direction: string
}

// single variant object
export type Variant = {
  id: number
  locale: string
  name: string
  tag: string
}

export type UserVariant = Variant & {
  is_preferred_option: boolean
}

/*
  an object storing all
  accent/locale/variant data for a user
*/
export type UserLanguage = {
  locale: string
  variant?: UserVariant
  accents?: Accent[]
}

// Combined Language Data
export type VariantData = {
  id: number
  code: string
  name: string
  type?: string
  locale_id: number
}
export type AccentData = {
  id: number
  code: string
  name: string
  locale_id: number
}
export type LanguageData = {
  id: number
  code: string
  target_sentence_count?: number
  english_name?: string
  native_name: string
  is_contributable?: number
  is_translated?: number
  text_direction: string
  variants: VariantData[]
  predefined_accents: AccentData[]
}

export type SPSLocalesResponse = {
  message: string
  locales: {
    ui: string[]
    contributable: string[]
  }
}

export type AvailableLanguages = {
  project: string
  availableLanguages: string[]
}
