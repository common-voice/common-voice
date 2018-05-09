import { Action as ReduxAction, Dispatch } from 'redux';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import StateTree from './tree';
import { User } from './user';

const MIN_CACHE_SIZE = 2;

export namespace Clips {
  export interface Clip {
    id: string;
    glob: string;
    sentence: string;
    audioSrc: string;
  }

  export interface State {
    [locale: string]: {
      cache: Clip[];
      next?: Clip;
      loadError: boolean;
    };
  }

  const localeClips = ({ locale, clips }: StateTree) => clips[locale];

  export const selectors = { localeClips };

  enum ActionType {
    REFILL_CACHE = 'REFILL_CLIPS_CACHE',
    NEXT_CLIP = 'NEXT_CLIP',
  }

  interface RefillCacheAction extends ReduxAction {
    type: ActionType.REFILL_CACHE;
    clips?: Clip;
  }

  interface NewClipAction extends ReduxAction {
    type: ActionType.NEXT_CLIP;
  }

  export type Action = RefillCacheAction | NewClipAction;

  const preloadClip = (clip: any) =>
    new Promise(resolve => {
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
      const state = getState();
      if (localeClips(state).cache.length > MIN_CACHE_SIZE) {
        return;
      }

      try {
        const clips = await state.api.fetchRandomClips(MIN_CACHE_SIZE);
        dispatch({
          type: ActionType.REFILL_CACHE,
          clips: clips.map(clip => ({
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
      dispatch: Dispatch<NewClipAction | RefillCacheAction>,
      getState: () => StateTree
    ) => {
      const state = getState();
      const { id } = localeClips(state).next;
      await state.api.saveVote(id, isValid);
      dispatch(User.actions.tallyVerification());
      dispatch({ type: ActionType.NEXT_CLIP });
      actions.refillCache()(dispatch, getState);
    },
  };

  export function reducer(
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: {
          cache: [],
          next: null,
          loadError: false,
        },
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.REFILL_CACHE: {
        const { clips } = action;
        const cache = clips
          ? localeState.cache.concat(clips)
          : localeState.cache;
        const next = localeState.next || cache.shift();
        return {
          ...state,
          [locale]: {
            cache,
            loadError: !next,
            next,
          },
        };
      }

      case ActionType.NEXT_CLIP: {
        const cache = localeState.cache.slice();
        const next = cache.pop();
        return { ...state, [locale]: { ...localeState, cache, next } };
      }

      default:
        return state;
    }
  }
}
