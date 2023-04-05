import { SentenceSubmissionError } from 'common';

export type WriteState = {
  sentence: string;
  citation: string;
  error: SentenceSubmissionError;
  confirmPublicDomain: boolean;
};

export enum WriteActionType {
  SET_PUBLIC_DOMAIN = 'SET_PUBLIC_DOMAIN',
  SET_SENTENCE = 'SET_SENTENCE',
  SET_CITATION = 'SET_CITATION',
  ADD_SENTENCE_SUCCESS = 'ADD_SENTENCE_SUCCESS',
  ADD_SENTENCE_ERROR = 'ADD_SENTENCE_ERROR',
}

type SetPublicDomainAction = {
  type: WriteActionType.SET_PUBLIC_DOMAIN;
};

type SetSentenceAction = {
  type: WriteActionType.SET_SENTENCE;
  payload: { sentence: string };
};

type SetCitationAction = {
  type: WriteActionType.SET_CITATION;
  payload: { citation: string };
};

type AddSentenceSuccessAction = {
  type: WriteActionType.ADD_SENTENCE_SUCCESS;
};

type AddSentenceErrorAction = {
  type: WriteActionType.ADD_SENTENCE_ERROR;
  payload: { error: SentenceSubmissionError };
};

type Action =
  | SetPublicDomainAction
  | SetSentenceAction
  | SetCitationAction
  | AddSentenceSuccessAction
  | AddSentenceErrorAction;

export const writeReducer = (state: WriteState, action: Action) => {
  switch (action.type) {
    case WriteActionType.SET_PUBLIC_DOMAIN:
      return {
        ...state,
        confirmPublicDomain: !state.confirmPublicDomain,
      };

    case WriteActionType.SET_SENTENCE:
      return {
        ...state,
        sentence: action.payload.sentence,
      };

    case WriteActionType.SET_CITATION:
      return {
        ...state,
        citation: action.payload.citation,
      };

    case WriteActionType.ADD_SENTENCE_SUCCESS:
      return {
        ...state,
        sentence: '',
        citation: '',
        confirmPublicDomain: false,
        error: undefined,
      };

    case WriteActionType.ADD_SENTENCE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
  }
};
