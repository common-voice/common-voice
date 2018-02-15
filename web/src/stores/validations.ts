import { Action as ReduxAction, Dispatch } from 'redux';
import StateTree from './tree';
import { User } from './user';

const MIN_CACHE_SIZE = 2;

export namespace Validations {
  export interface Validation {
    id: string;
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
    validations?: Validation;
  }

  interface NewValidationAction extends ReduxAction {
    type: ActionType.NEXT_VALIDATION;
  }

  export type Action = RefillCacheAction | NewValidationAction;

  const preloadClip = (clip: any) => new Promise(resolve => {
    const audioElement = document.createElement('audio');
    audioElement.addEventListener('canplaythrough', () => {
      audioElement.remove();
      resolve();
    });
    audioElement.setAttribute('src', clip.sound);
  });

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
        const clips = await api.fetchRandomClips(MIN_CACHE_SIZE);
        dispatch({
          type: ActionType.REFILL_CACHE,
          validations: clips.map(clip => ({
            id: clip.id,
            glob: clip.glob,
            sentence: decodeURIComponent(clip.text),
            audioSrc: clip.sound,
          })),
        });
        await Promise.all(clips.map(preloadClip));
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
      const { id } = validations.next;
      await api.saveVote(id, isValid);
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
        const { validations } = action;
        const cache = validations ? state.cache.concat(validations) : state.cache;
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
