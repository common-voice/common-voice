type GA4Events = 'record-clip' | 'rerecord-clip' | 'submit-clip'

export const trackGtag = (
  eventName: GA4Events,
  eventParams?: Record<string, string | number | boolean>
) => {
  gtag('event', eventName, eventParams)
}
