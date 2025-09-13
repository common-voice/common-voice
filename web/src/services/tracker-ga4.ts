type GA4Events =
  | 'about-menu-label-click'
  | 'bulk-submission-upload'
  | 'bulk-submission-file-drop'
  | 'datasets-table-row-click'
  | 'discard-ongoing'
  | 'download-dataset'
  | 'download-menu-label-click'
  | 'how-to-cite-toggle'
  | 'listen-clip'
  | 'listen-menu-label-click'
  | 'rejected-files-download'
  | 'record-clip'
  | 'rerecord-clip'
  | 'report-sentence'
  | 'report-clip'
  | 'request-language'
  | 'show-shortcuts-btn-click'
  | 'skip-clip'
  | 'skip-sentence'
  | 'skip-sentence-review'
  | 'speak-menu-label-click'
  | 'submit-clips'
  | 'vote-no'
  | 'vote-no-sentence'
  | 'vote-yes'
  | 'vote-yes-sentence'
  | 'what-needs-to-be-in-file-toggle'
  | 'write-menu-label-click'
  | 'write-sentence-submit'
  | 'join-mdc-announcement-button'
  | 'close-mdc-announcement-button'

export const trackGtag = (
  eventName: GA4Events,
  eventParams?: Record<
    string,
    string | number | boolean | Array<string | number>
  >
) => {
  gtag('event', eventName, eventParams)
}
