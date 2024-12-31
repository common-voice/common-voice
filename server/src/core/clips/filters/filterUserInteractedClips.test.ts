import { filterUserInteractedClips } from './filterUserInteractedClips'

describe('Test filtering user interacted clips', () => {
  test.each([
    {
      interactedClipIds: [1, 2, 3],
      clips: [
        {
          id: 1,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
        {
          id: 2,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
        {
          id: 4,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
      ],
      expected: [
        {
          id: 4,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
      ],
    },
    {
      interactedClipIds: [],
      clips: [
        {
          id: 1,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
        {
          id: 2,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
      ],
      expected: [
        {
          id: 1,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
        {
          id: 2,
          client_id: 'b',
          path: 'ad',
          sentence: 'asdv',
          original_sentence_id: 'afv',
        },
      ],
    },
    {
      interactedClipIds: [1, 2, 3],
      clips: [],
      expected: [],
    },
  ])(
    'should return correctly filtered list',
    ({ interactedClipIds, clips, expected }) => {
      expect(filterUserInteractedClips(interactedClipIds)(clips)).toStrictEqual(
        expected
      )
    }
  )
})
