export type ClipRow = {
  id: string
  client_id: string
  path: string
  sentence: string
  up_votes: string
  down_votes: string
  age: string
  gender: string
  accents: string
  variant: string
  locale: string
  segment: string
}

export type ProcessLocaleJob = {
  locale: string
  isMinorityLanguage: boolean
}