import { filterUserInteractedSentences } from './filterUserInteractedSentences'

describe('Test filtering user interacted sentences', () => {
  test.each([
    {
      interactedSentenceIds: ['1', '2', '3'],
      sentences: [
        {
          id: '1',
          text: 'asdv',
        },
        {
          id: '2',
          text: 'asdv',
        },
        {
          id: '4',
          text: 'asdv',
        },
      ],
      expected: [
        {
          id: '4',
          text: 'asdv',
        },
      ],
    },
    {
      interactedSentenceIds: [],
      sentences: [
        {
          id: '1',
          text: 'asdv',
        },
        {
          id: '2',
          text: 'asdv',
        },
      ],
      expected: [
        {
          id: '1',
          text: 'asdv',
        },
        {
          id: '2',
          text: 'asdv',
        },
      ],
    },
    {
      interactedSentenceIds: ['1', '2', '3'],
      sentences: [],
      expected: [],
    },
  ])(
    'should return correctly filtered list',
    ({ interactedSentenceIds, sentences, expected }) => {
      expect(
        filterUserInteractedSentences(interactedSentenceIds)(sentences)
      ).toStrictEqual(expected)
    }
  )
})
