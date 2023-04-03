export const REPORTED_CLIP = 'clip'
export const REPORTED_SENTENCE = 'sentence'

export const REPORT_KINDS = [
  REPORTED_CLIP,
  REPORTED_SENTENCE,
] as const

export type ReportKind = typeof REPORT_KINDS[number]

export type CreateReportCommand = {
  clientId: string
  kind: ReportKind
  id: string
  reasons: string[]
}
