import { Dispatch } from 'redux'

export type DonateBannerColour = 'pink' | 'coral'

export type DonateBannerState = {
  colour: DonateBannerColour | null
}

export enum DonateBannerActionType {
  SET_DONATE_BANNER_COLOUR = 'SET_DONATE_BANNER_COLOUR',
}

interface SetDonateBannerColourAction {
  type: DonateBannerActionType.SET_DONATE_BANNER_COLOUR
  colour: DonateBannerColour
}

export type DonateBannerAction = SetDonateBannerColourAction

export const DonateBannerActions = {
  setDonateBannerColour:
    (colour: DonateBannerColour) =>
    (dispatch: Dispatch<SetDonateBannerColourAction>) => {
      dispatch({
        type: DonateBannerActionType.SET_DONATE_BANNER_COLOUR,
        colour,
      })
    },
}

const INITIAL_STATE: DonateBannerState = {
  colour: null,
}

export function donateBannerColourReducer(
  state: DonateBannerState = INITIAL_STATE,
  action: DonateBannerAction
) {
  switch (action.type) {
    case DonateBannerActionType.SET_DONATE_BANNER_COLOUR:
      return {
        ...state,
        colour: action.colour,
      }

    default:
      return state
  }
}
