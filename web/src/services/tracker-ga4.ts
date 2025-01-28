type GA4Events =
  | 'record-clip'
  | 'rerecord-clip'
  | 'submit-clips'
  | 'discard-ongoing'
  | 'listen-clip'
  | 'vote-yes'
  | 'vote-no'

export const trackGtag = (
  eventName: GA4Events,
  eventParams?: Record<string, string | number | boolean>
) => {
  gtag('event', eventName, eventParams)
}
