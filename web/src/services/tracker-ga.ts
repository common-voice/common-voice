export const trackGtag = (
  eventCategory: string, // TODO: this should be an enum of events
  eventParams: Record<string, string | number | boolean>
) => {
  gtag('event', eventCategory, eventParams)
}
