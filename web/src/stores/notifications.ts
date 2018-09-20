export namespace Notifications {
  export type Notification = {
    id: number;
    content: any;
  };

  export type State = Notification[];

  enum ActionType {
    ADD = 'ADD_NOTIFICATION',
    REMOVE = 'REMOVE_NOTIFICATION',
  }

  interface AddAction {
    type: ActionType.ADD;
    notification: Notification;
  }

  interface RemoveAction {
    type: ActionType.REMOVE;
    id: number;
  }

  export type Action = AddAction | RemoveAction;

  let id = 0;

  export const actions = {
    add: (content: any) => ({
      type: ActionType.ADD,
      notification: { id: ++id, content },
    }),
    remove: (id: number) => ({
      type: ActionType.REMOVE,
      id,
    }),
  };

  export function reducer(state: State = [], action: Action): State {
    switch (action.type) {
      case ActionType.ADD:
        return [...state, action.notification];

      case ActionType.REMOVE:
        return state.filter(({ id }) => id !== action.id);

      default:
        return state;
    }
  }
}
