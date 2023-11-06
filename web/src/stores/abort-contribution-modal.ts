import { Dispatch } from 'redux'

export enum AbortContributionModalStatus {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export type AbortContributionModalState = {
  modalVisible: boolean | null
  abortStatus: AbortContributionModalStatus
}

export enum AbortContributionModalActionType {
  SET_MODAL_VISIBILITY = 'SET_MODAL_VISIBILITY',
  SET_ABORT_STATUS = 'SET_ABORT_STATUS',
}

interface SetAbortContributionModalAction {
  type: AbortContributionModalActionType.SET_MODAL_VISIBILITY
  isAbortContributionModalVisible: boolean
}

interface SetAbortStatusAction {
  type: AbortContributionModalActionType.SET_ABORT_STATUS
  abortStatus: AbortContributionModalStatus
}

export type AbortContributionModalAction =
  | SetAbortContributionModalAction
  | SetAbortStatusAction

export const AbortContributionModalActions = {
  setAbortContributionModalVisible:
    (isAbortContributionModalVisible: boolean) =>
    (dispatch: Dispatch<SetAbortContributionModalAction>) => {
      dispatch({
        type: AbortContributionModalActionType.SET_MODAL_VISIBILITY,
        isAbortContributionModalVisible,
      })
    },

  setAbortStatus:
    (abortStatus: AbortContributionModalStatus) =>
    (dispatch: Dispatch<SetAbortStatusAction>) => {
      dispatch({
        type: AbortContributionModalActionType.SET_ABORT_STATUS,
        abortStatus,
      })
    },
}

const INITIAL_STATE: AbortContributionModalState = {
  modalVisible: null,
  abortStatus: AbortContributionModalStatus.INACTIVE,
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
          ? {
              abortStatus: AbortContributionModalStatus.INACTIVE,
            }
          : {}),
      }

    case AbortContributionModalActionType.SET_ABORT_STATUS:
      return {
        ...state,
        abortStatus: action.abortStatus,
      }

    default:
      return state
  }
}
