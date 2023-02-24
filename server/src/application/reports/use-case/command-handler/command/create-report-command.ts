export const reportKinds = ['clip', 'sentence', 'pending_sentence'] as const
export type ReportKind = typeof reportKinds[number]

export type CreateReportCommand = {
  clientId: string
  kind: ReportKind
  id: string
  reasons: string[]
}
