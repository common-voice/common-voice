type GA4Events =
  | 'bulk-submission-upload'
  | 'bulk-submission-file-drop'
  | 'datasets-table-row-click'
  | 'discard-ongoing'
  | 'download-dataset'
  | 'how-to-cite-toggle'
  | 'listen-clip'
  | 'rejected-files-download'
  | 'record-clip'
  | 'rerecord-clip'
  | 'report-sentence'
  | 'report-clip'
  | 'show-shortcuts-btn-click'
  | 'skip-clip'
  | 'skip-sentence'
  | 'skip-sentence-review'
  | 'submit-clips'
  | 'vote-no'
  | 'vote-no-sentence'
  | 'vote-yes'
  | 'vote-yes-sentence'
  | 'what-needs-to-be-in-file-toggle'
  | 'write-sentence-submit'

export const trackGtag = (
  eventName: GA4Events,
  eventParams?: Record<string, string | number | boolean>
) => {
  gtag('event', eventName, eventParams)
}
