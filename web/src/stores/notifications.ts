export namespace Notifications {
  export type Notification = {
    id: number;
    content: any;
  } & (
    | {
        kind: 'pill';
        type: NotificationType;
        score?: number;
      }
    | { kind: 'banner'; bannerProps: { storageKey?: string; links: any[] } }
  );

  export type NotificationType = 'success' | 'error' | 'achievement';

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
    addPill: (content: any, type: NotificationType = 'success') => ({
      type: ActionType.ADD,
      notification: { id: ++id, kind: 'pill', content, type },
    }),

    // TODO: separate banners from notifications
    addBanner: (content: any, bannerProps: any) => ({
      type: ActionType.ADD,
      notification: { id: ++id, kind: 'banner', content, bannerProps },
    }),
    addAchievement: (
      score: number,
      text: string,
      type: NotificationType = 'achievement'
    ) => ({
      type: ActionType.ADD,
      notification: { id: ++id, kind: 'pill', score, content: text, type },
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
