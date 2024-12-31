export type TextDirection = 'LTR' | 'RTL' | 'TTB' | 'BTT'

export type Locale = {
  id: number
  name: string
  targetSentenceCount: number
  isContributable: boolean
  isTranslated: boolean
  textDirection: TextDirection
}
