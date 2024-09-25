import {
  SentenceWriteActions,
  SentenceWriteActionType,
  SentenceWriteState,
} from './types'

export const sentenceWriteReducer = (
  state: SentenceWriteState,
  action: SentenceWriteActions
) => {
  switch (action.type) {
    case SentenceWriteActionType.SET_PUBLIC_DOMAIN:
      return {
        ...state,
        confirmPublicDomain: !state.confirmPublicDomain,
      }

    case SentenceWriteActionType.SET_SENTENCE:
      return {
        ...state,
        sentence: action.payload.sentence,
      }

    case SentenceWriteActionType.SET_CITATION:
      return {
        ...state,
        citation: action.payload.citation,
      }

    case SentenceWriteActionType.SET_DOMAIN:
      return {
        ...state,
        sentenceDomains: [...action.payload.sentenceDomains],
      }

    case SentenceWriteActionType.SET_VARIANT:
      return {
        ...state,
        sentenceVariant: action.payload.sentenceVariant,
      }

    case SentenceWriteActionType.ADD_SENTENCE_SUCCESS:
      return {
        ...state,
        sentence: '',
        citation: '',
        confirmPublicDomain: false,
        sentenceDomains: [],
        sentenceVariant: '',
        error: undefined,
      }

    case SentenceWriteActionType.ADD_SENTENCE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      }
  }
}
