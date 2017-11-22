import { Action as ReduxAction, Dispatch } from 'redux';
import StateTree from './tree';
import { User } from './user';

const MIN_CACHE_SIZE = 2;

export namespace Validations {
  export interface Validation {
    glob: string;
    sentence: string;
    audioSrc: string;
  }

  export interface State {
    cache: Validation[];
    next?: Validation;
    loadError: boolean;
  }

  enum ActionType {
    REFILL_CACHE = 'REFILL_VALIDATIONS_CACHE',
    NEXT_VALIDATION = 'NEXT_VALIDATION',
  }

  interface RefillCacheAction extends ReduxAction {
    type: ActionType.REFILL_CACHE;
    validation?: Validation;
  }

  interface NewValidationAction extends ReduxAction {
    type: ActionType.NEXT_VALIDATION;
  }

  export type Action = RefillCacheAction | NewValidationAction;

  export const actions = {
    refillCache: () => async (
      dispatch: Dispatch<RefillCacheAction>,
      getState: () => StateTree
    ) => {
      const { api, validations } = getState();
      if (validations.cache.length > MIN_CACHE_SIZE) {
        return;
      }

      try {
        for (let i = 0; i < MIN_CACHE_SIZE * 2; i++) {
          const clip = await api.getRandomClip();
          dispatch({
            type: ActionType.REFILL_CACHE,
            validation: {
              glob: clip.glob,
              sentence: decodeURIComponent(clip.text),
              audioSrc: clip.sound,
            },
          });
          await new Promise(resolve => {
            const audioElement = document.createElement('audio');
            audioElement.addEventListener('canplaythrough', () => {
              audioElement.remove();
              resolve();
            });
            audioElement.setAttribute('src', clip.sound);
          });
        }
      } catch (err) {
        if (err instanceof XMLHttpRequest) {
          dispatch({ type: ActionType.REFILL_CACHE });
        } else {
          throw err;
        }
      }
    },

    vote: (isValid: boolean) => async (
      dispatch: Dispatch<NewValidationAction | RefillCacheAction>,
      getState: () => StateTree
    ) => {
      const { api, validations } = getState();
      await api.castVote(validations.next.glob, isValid);
      dispatch(User.actions.tallyVerification());
      dispatch({ type: ActionType.NEXT_VALIDATION });
      actions.refillCache()(dispatch, getState);
    },
  };

  export function reducer(
    state: State = {
      cache: [],
      next: null,
      loadError: false,
    },
    action: Action
  ): State {
    switch (action.type) {
      case ActionType.REFILL_CACHE: {
        const { validation } = action;
        const cache = validation ? state.cache.concat(validation) : state.cache;
        const next = state.next || cache.shift();
        return {
          ...state,
          cache,
          loadError: !next,
          next,
        };
      }

      case ActionType.NEXT_VALIDATION: {
        const cache = state.cache.slice();
        const next = cache.pop();
        return { ...state, cache, next };
      }

      default:
        return state;
    }
  }
}
