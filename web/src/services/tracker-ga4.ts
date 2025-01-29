type GA4Events =
  | 'record-clip'
  | 'rerecord-clip'
  | 'submit-clips'
  | 'discard-ongoing'
  | 'listen-clip'
  | 'vote-yes'
  | 'vote-no'
  | 'write-sentence-submit'
  | 'report-sentence'
  | 'report-clip'
  | 'skip-clip'
  | 'skip-sentence'
  | 'how-to-cite-toggle'

export const trackGtag = (
  eventName: GA4Events,
  eventParams?: Record<string, string | number | boolean>
) => {
  gtag('event', eventName, eventParams)
}
