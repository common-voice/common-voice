import { Dispatch } from 'redux'

export type AbortContributionModalState = {
  modalVisible: boolean | null
  abortConfirmed: boolean | null
}

export enum AbortContributionModalActionType {
  SET_MODAL_VISIBILITY = 'SET_MODAL_VISIBILITY',
  ABORT_CONFIRMED = 'ABORT_CONFIRMED',
}

interface SetAbortContributionModalAction {
  type: AbortContributionModalActionType.SET_MODAL_VISIBILITY
  isAbortContributionModalVisible: boolean
}

interface SetAbortConfirmedAction {
  type: AbortContributionModalActionType.ABORT_CONFIRMED
  isAbortConfirmed: boolean
}

export type AbortContributionModalAction =
  | SetAbortContributionModalAction
  | SetAbortConfirmedAction

export const AbortContributionModalActions = {
  setAbortContributionModalVisible:
    (isAbortContributionModalVisible: boolean) =>
    (dispatch: Dispatch<SetAbortContributionModalAction>) => {
      dispatch({
        type: AbortContributionModalActionType.SET_MODAL_VISIBILITY,
        isAbortContributionModalVisible,
      })
    },

  setAbortConfirmed:
    (isAbortConfirmed: boolean) =>
    (dispatch: Dispatch<SetAbortConfirmedAction>) => {
      dispatch({
        type: AbortContributionModalActionType.ABORT_CONFIRMED,
        isAbortConfirmed,
      })
    },
}

const INITIAL_STATE: AbortContributionModalState = {
  modalVisible: null,
  abortConfirmed: null,
}

export function abortContributionModalReducer(
  state: AbortContributionModalState = INITIAL_STATE,
  action: AbortContributionModalAction
) {
  switch (action.type) {
    case AbortContributionModalActionType.SET_MODAL_VISIBILITY:
      return {
        ...state,
        modalVisible: action.isAbortContributionModalVisible,
        ...(action.isAbortContributionModalVisible === true
          ? { abortConfirmed: null }
          : {}),
      }

    case AbortContributionModalActionType.ABORT_CONFIRMED:
      return {
        ...state,
        abortConfirmed: action.isAbortConfirmed,
      }

    default:
      return state
  }
}
