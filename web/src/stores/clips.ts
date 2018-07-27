import { Action as ReduxAction, Dispatch } from 'redux';
const contributableLocales = require('../../../locales/contributable.json') as string[];
import StateTree from './tree';
import { User } from './user';

const MIN_CACHE_SIZE = 10;

export namespace Clips {
  export interface Clip {
    id: string;
    glob: string;
    sentence: string;
    audioSrc: string;
  }

  export interface State {
    [locale: string]: {
      clips: Clip[];
      isLoading: boolean;
      next?: Clip;
    };
  }

  const localeClips = ({ locale, clips }: StateTree) => clips[locale];

  export const selectors = { localeClips };

  enum ActionType {
    REFILL_CACHE = 'REFILL_CLIPS_CACHE',
    REMOVE_CLIP = 'REMOVE_CLIP',
    LOAD = 'LOAD_CLIPS',
  }

  interface LoadAction extends ReduxAction {
    type: ActionType.LOAD;
  }

  interface RefillCacheAction extends ReduxAction {
    type: ActionType.REFILL_CACHE;
    clips?: Clip[];
  }

  interface RemoveClipAction extends ReduxAction {
    type: ActionType.REMOVE_CLIP;
    clipId: string;
  }

  export type Action = LoadAction | RefillCacheAction | RemoveClipAction;

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
      dispatch: Dispatch<RefillCacheAction | LoadAction>,
      getState: () => StateTree
    ) => {
      const state = getState();
      if (localeClips(state).clips.length > MIN_CACHE_SIZE) {
        return;
      }

      try {
        dispatch({ type: ActionType.LOAD });
        const clips = await state.api.fetchRandomClips(MIN_CACHE_SIZE);
        dispatch({
          type: ActionType.REFILL_CACHE,
          clips: clips.map(clip => {
            let sentence;
            try {
              sentence = decodeURIComponent(clip.text);
            } catch (e) {
              if (e.name !== 'URIError') {
                throw e;
              }
              sentence = clip.text;
            }

            return {
              id: clip.id,
              glob: clip.glob,
              sentence,
              audioSrc: clip.sound,
            };
          }),
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

    vote: (isValid: boolean, clipId?: string) => async (
      dispatch: Dispatch<Action | User.Action>,
      getState: () => StateTree
    ) => {
      const state = getState();
      const id = clipId || localeClips(state).next.id;
      await state.api.saveVote(id, isValid);
      dispatch(User.actions.tallyVerification());
      dispatch({ type: ActionType.REMOVE_CLIP, clipId: id });
      actions.refillCache()(dispatch, getState);
    },

    remove: (clipId: string) => async (
      dispatch: Dispatch<Action>,
      getState: () => StateTree
    ) => {
      dispatch({ type: ActionType.REMOVE_CLIP, clipId });
      actions.refillCache()(dispatch, getState);
    },
  };

  export function reducer(
    locale: string,
    state: State = contributableLocales.reduce(
      (state, locale) => ({
        ...state,
        [locale]: {
          clips: [],
          next: null,
          isLoading: false,
        },
      }),
      {}
    ),
    action: Action
  ): State {
    const localeState = state[locale];

    switch (action.type) {
      case ActionType.LOAD:
        return {
          ...state,
          [locale]: {
            ...localeState,
            isLoading: true,
          },
        };

      case ActionType.REFILL_CACHE: {
        const clips = action.clips
          ? localeState.clips.concat(action.clips)
          : localeState.clips;
        const next = localeState.next || clips.shift();
        return {
          ...state,
          [locale]: {
            clips: clips.filter(
              (clip1, i) =>
                clips.findIndex(clip2 => clip2.id === clip1.id) === i
            ),
            isLoading: false,
            next,
          },
        };
      }

      case ActionType.REMOVE_CLIP: {
        const clips = localeState.clips.filter(c => c.id !== action.clipId);
        const next = clips.pop();
        return { ...state, [locale]: { ...localeState, clips, next } };
      }

      default:
        return state;
    }
  }
}
