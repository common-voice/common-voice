import { Action as ReduxAction, Dispatch } from 'redux'
import * as Sentry from '@sentry/react'
import StateTree from './tree'
import { User } from './user'
import { Clip } from 'common'

// Feature flag: Enable detailed error telemetry in Sentry
// Set to false to reduce Sentry costs (only critical errors will be tracked)
const ENABLE_ERROR_TELEMETRY = true

function extractErrorDetails(err: unknown): {
  errMessage: string
  errName: string
} {
  return {
    errMessage: err instanceof Error ? err.message : String(err),
    errName: err instanceof Error ? err.name : 'UnknownError',
  }
}

async function getCanPlayAudio(audioSrc: string) {
  return new Promise(resolve => {
    const audio = new Audio(audioSrc)

    audio.addEventListener('error', () => {
      resolve(false)
    })

    audio.addEventListener('canplay', () => {
      resolve(true)
    })

    audio.load()
  })
}

async function checkClipsForErrors(clips: Clip[]) {
  return await Promise.all(
    clips.map(async clip => {
      let hasError = false

      try {
        // can play clip
        const canPlayAudio = await getCanPlayAudio(clip.audioSrc)
        if (!canPlayAudio) {
          throw new Error(`Couldn't play clip "${clip.audioSrc}"`)
        }

        // attempt to decode sentence
        clip.sentence = {
          ...clip.sentence,
          text: decodeURIComponent(clip.sentence.text),
        }
      } catch (e) {
        console.error('Clip error', e)
        hasError = true
      }

      return { hasError, clip }
    })
  )
}

async function removeClipsWithErrors(clips: Clip[]) {
  const clipsWithErrors = await checkClipsForErrors(clips)

  // filter out errored clips
  return clipsWithErrors
    .filter(clipWithErrors => !clipWithErrors.hasError)
    .map(clipWithErrors => clipWithErrors.clip)
}

const CACHE_SET_COUNT = 50
const MIN_CACHE_COUNT = 5

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Clips {
  export interface State {
    [locale: string]: {
      clips: Clip[]
      isLoading: boolean
      hasLoadingError: boolean
      showFirstContributionToast: boolean
      showFirstStreakToast: boolean
      hasEarnedSessionToast: boolean
      challengeEnded: boolean
    }
  }

  enum ActionType {
    REFILL_CACHE = 'REFILL_CLIPS_CACHE',
    REMOVE_CLIP = 'REMOVE_CLIP',
    LOAD = 'LOAD_CLIPS',
    LOAD_ERROR = 'LOAD_CLIPS_ERROR',
    ACHIEVEMENT = 'ACHIEVEMENT',
  }

  interface LoadAction extends ReduxAction {
    type: ActionType.LOAD
  }
  interface LoadErrorAction extends ReduxAction {
    type: ActionType.LOAD_ERROR
  }

  interface AchievementAction extends ReduxAction {
    type: ActionType.ACHIEVEMENT
    showFirstContributionToast?: boolean
    hasEarnedSessionToast?: boolean
    showFirstStreakToast?: boolean
    challengeEnded?: boolean
  }

  interface RefillCacheAction extends ReduxAction {
    type: ActionType.REFILL_CACHE
    clips?: Clip[]
  }

  interface RemoveClipAction extends ReduxAction {
    type: ActionType.REMOVE_CLIP
    clipId: string
  }

  export type Action =
    | LoadAction
    | LoadErrorAction
    | RefillCacheAction
    | RemoveClipAction
    | AchievementAction

  export const actions = {
    refillCache:
      () =>
      async (
        dispatch: Dispatch<RefillCacheAction | LoadAction | LoadErrorAction>,
        getState: () => StateTree
      ) => {
        const state = getState()

        // don't load if no contributable locale
        if (
          state.languages &&
          !state.languages.contributableLocales.includes(state.locale)
        ) {
          return
        }

        if (localeClips(state).clips.length >= MIN_CACHE_COUNT) {
          return
        }

        try {
          dispatch({ type: ActionType.LOAD })

          const randomClips = await state.api.fetchRandomClips(CACHE_SET_COUNT)

          const clips = await removeClipsWithErrors(randomClips)

          dispatch({ type: ActionType.REFILL_CACHE, clips })
        } catch (err) {
          // Track handled errors in Sentry only if telemetry enabled
          if (ENABLE_ERROR_TELEMETRY) {
            const { errMessage, errName } = extractErrorDetails(err)
            Sentry.addBreadcrumb({
              category: 'clips',
              message: 'Failed to load clips',
              level: 'error',
              data: { error: errMessage, errorType: errName },
            })

            Sentry.captureMessage('Clip loading failed (handled)', {
              level: 'warning',
              tags: { action: 'refillCache', errorType: errName },
              contexts: {
                clips: { error: errMessage, locale: state.locale },
              },
            })
          }

          // Dispatch LOAD_ERROR to update UI state - no re-throw needed
          // Error is "handled" by showing error message to user via hasLoadingError flag
          // Re-throwing would create unhandled promise rejection
          dispatch({ type: ActionType.LOAD_ERROR })
        }
      },

    vote:
      (isValid: boolean, clipId?: string) =>
      async (
        dispatch: Dispatch<Action | User.Action>,
        getState: () => StateTree
      ) => {
        const state = getState()
        const id = clipId

        // Store the clip before removing in case we need to rollback
        const clipToRemove = localeClips(state).clips.find(c => c.id === id)

        // Optimistically remove clip from UI
        dispatch({ type: ActionType.REMOVE_CLIP, clipId: id })

        try {
          const {
            showFirstContributionToast,
            hasEarnedSessionToast,
            showFirstStreakToast,
            challengeEnded,
          } = await state.api.saveVote(id, isValid)

          if (!state.user.account) {
            dispatch(User.actions.tallyVerification())
          }
          if (state.user?.account?.enrollment?.challenge) {
            dispatch({
              type: ActionType.ACHIEVEMENT,
              showFirstContributionToast,
              hasEarnedSessionToast,
              showFirstStreakToast,
              challengeEnded,
            })
          }
          User.actions.refresh()(dispatch, getState)
          actions.refillCache()(dispatch, getState)
        } catch (error) {
          // Track network/server errors for debugging (won't mark as "unhandled")
          const { errMessage, errName } = extractErrorDetails(error)

          // Track handled errors in Sentry only if telemetry enabled
          if (ENABLE_ERROR_TELEMETRY) {
            Sentry.addBreadcrumb({
              category: 'vote',
              message: 'Clip-Vote submission failed',
              level: 'error',
              data: {
                clipId: id,
                isValid,
                error: errMessage,
                errorType: errName,
              },
            })

            Sentry.captureMessage(`Clip-Vote submission failed (${errName})`, {
              level: 'warning',
              tags: { action: 'vote', errorType: errName },
              contexts: {
                vote: { clipId: id, isValid, error: errMessage },
              },
            })
          }

          // Rollback: Only restore clip for DEFINITE failures to prevent vote duplication
          //
          // Error types come from backend API responses (see server/src/lib/clip.ts):
          // - NotFoundError: HTTP 404 - clip doesn't exist in database
          // - BusinessLogicError: HTTP 400 - validation failed (e.g., already voted)
          //
          // Network errors (timeout, connection lost) are NOT definite failures because:
          // - Vote may have been saved on backend before response was sent
          // - Restoring clip would let user vote again → duplicate vote error
          //
          // Our strategy against comms errors: Only restore on errors where we KNOW vote didn't succeed
          const isDefiniteFailure =
            errName === 'NotFoundError' || // 404: Clip doesn't exist
            errName === 'BusinessLogicError' // 400: Business rule violation

          if (clipToRemove && isDefiniteFailure) {
            dispatch({
              type: ActionType.REFILL_CACHE,
              clips: [clipToRemove],
            })
          }

          dispatch({ type: ActionType.LOAD_ERROR })
        }
      },

    remove:
      (clipId: string) =>
      async (dispatch: Dispatch<Action>, getState: () => StateTree) => {
        dispatch({ type: ActionType.REMOVE_CLIP, clipId })
        actions.refillCache()(dispatch, getState)
      },
  }

  const DEFAULT_LOCALE_STATE = {
    clips: [] as Clip[],
    isLoading: false,
    hasLoadingError: false,
    showFirstContributionToast: false,
    showFirstStreakToast: false,
    hasEarnedSessionToast: false,
    challengeEnded: false,
  }

  export function reducer(
    locale: string,
    state: State = {},
    action: Action
  ): State {
    const currentLocaleState = state[locale]
    const localeState = {
      ...DEFAULT_LOCALE_STATE,
      ...currentLocaleState,
    }

    switch (action.type) {
      case ActionType.LOAD:
        return {
          ...state,
          [locale]: {
            ...localeState,
            isLoading: true,
          },
        }

      case ActionType.LOAD_ERROR:
        return {
          ...state,
          [locale]: {
            ...localeState,
            isLoading: false,
            hasLoadingError: true,
          },
        }

      case ActionType.REFILL_CACHE: {
        const clips = localeState
          ? action.clips
            ? localeState.clips.concat(action.clips)
            : localeState.clips
          : []

        const filtered = clips.filter(
          (clip1, i) => clips.findIndex(clip2 => clip2.id === clip1.id) === i
        )

        return {
          ...state,
          [locale]: {
            clips: filtered,
            isLoading: false,
            hasLoadingError: false,
            hasEarnedSessionToast: false,
            showFirstContributionToast: false,
            showFirstStreakToast: false,
            challengeEnded: true,
          },
        }
      }

      case ActionType.REMOVE_CLIP: {
        const clips = localeState.clips.filter(c => c.id !== action.clipId)
        return { ...state, [locale]: { ...localeState, clips } }
      }

      case ActionType.ACHIEVEMENT: {
        return {
          ...state,
          [locale]: {
            ...localeState,
            hasEarnedSessionToast: action.hasEarnedSessionToast,
            showFirstContributionToast: action.showFirstContributionToast,
            showFirstStreakToast: action.showFirstStreakToast,
            challengeEnded: action.challengeEnded,
          },
        }
      }

      default:
        return state
    }
  }

  const localeClips = ({ locale, clips }: StateTree) => {
    if (!clips[locale]) {
      return DEFAULT_LOCALE_STATE
    }

    return clips[locale]
  }

  export const selectors = {
    localeClips,
  }
}
