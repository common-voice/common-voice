/* eslint-disable @typescript-eslint/no-namespace */
import { Dispatch } from 'redux'
import StateTree from './tree'

export namespace Datasource {
  export type State = string | null

  enum ActionType {
    SET = 'SET_DATASOURCE_ID',
  }

  interface SetAction {
    type: ActionType.SET
    datasourceId: string
  }

  export type Action = SetAction

  export const actions = {
    set:
      (datasourceId: string) =>
      (dispatch: Dispatch<SetAction>, getState: () => StateTree) => {
        if (getState().datasource === datasourceId) return

        dispatch({
          type: ActionType.SET,
          datasourceId,
        })
      },
  }

  export function reducer(state: State = null, action: Action): State {
    switch (action.type) {
      case ActionType.SET:
        return action.datasourceId

      default:
        return state
    }
  }
}
