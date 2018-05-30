export namespace Uploads {
  export type Upload = () => Promise<any>;

  export type State = Upload[];

  enum ActionType {
    ADD = 'ADD_UPLOAD',
    REMOVE = 'REMOVE_UPLOAD',
  }

  interface AddAction {
    type: ActionType.ADD;
    upload: Upload;
  }

  interface RemoveAction {
    type: ActionType.REMOVE;
    upload: Upload;
  }

  export type Action = AddAction | RemoveAction;

  export const actions = {
    add: (upload: Upload) => ({
      type: ActionType.ADD,
      upload,
    }),
    remove: (upload: Upload) => ({
      type: ActionType.REMOVE,
      upload,
    }),
  };

  export function reducer(state: State = [], action: Action): State {
    switch (action.type) {
      case ActionType.ADD:
        return [...state, action.upload];

      case ActionType.REMOVE:
        return state.filter(u => u !== action.upload);

      default:
        return state;
    }
  }
}
