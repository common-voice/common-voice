import { createBulkSubmissionFilepath } from '../../../core/bulk-submissions/bulk-submissions'

describe('Bulk submission module', () => {
  it('should return correct filepath', () => {
    const locale = 'en'
    const data = 'Sentence\tSource\nHi, how are you?\tself\n'

    const result = createBulkSubmissionFilepath(locale, data)
    const expected = 'en/bulk_submission_1664b29821df5b0925f9645c028bbf44.tsv'

    expect(result).toBe(expected)
  })
})
