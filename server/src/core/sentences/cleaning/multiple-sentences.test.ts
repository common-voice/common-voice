import { cleanRawMultipleSentencesInput } from './multiple-sentences'

describe('clean raw multiple sentences input', () => {
  it('should clean and split multiple sentences with newlines and multiple spaces', () => {
    const input = `This is the first   sentence.

    This  is the second sentence with    extra spaces.

Another sentence on a new line.

    Last    sentence  with mixed     spacing.`

    const expected = [
      'This is the first sentence.',
      'This is the second sentence with extra spaces.',
      'Another sentence on a new line.',
      'Last sentence with mixed spacing.',
    ]

    const result = cleanRawMultipleSentencesInput(input)

    expect(result).toEqual(expected)
  })

  it('should handle empty lines and lines with only spaces', () => {
    const input = `First sentence.


Second sentence.

Third sentence.`

    const expected = ['First sentence.', 'Second sentence.', 'Third sentence.']

    const result = cleanRawMultipleSentencesInput(input)

    expect(result).toEqual(expected)
  })

  it('should return an empty array for an empty string', () => {
    const input = ''
    const result = cleanRawMultipleSentencesInput(input)
    expect(result).toEqual([])
  })

  it('should handle a string with only whitespace', () => {
    const input = '    \n   \t   \n  '
    const result = cleanRawMultipleSentencesInput(input)
    expect(result).toEqual([])
  })

  it('should clean multiple occurrences of extra spaces within a single sentence', () => {
    const input = 'This   sentence   has   multiple   spaces   between   words.'
    const expected = ['This sentence has multiple spaces between words.']

    const result = cleanRawMultipleSentencesInput(input)

    expect(result).toEqual(expected)
  })
})
