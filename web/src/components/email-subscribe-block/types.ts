import { UserClient } from 'common';
import API from '../../services/api';
import { Notifications } from '../../stores/notifications';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';

//Subscribe form interfaces
export interface SubscribePropsFromState {
  account: UserClient;
  api: API;
}

export interface SubscribePropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
  updateUser: typeof User.actions.update;
}

export interface SubscribeProps
  extends SubscribePropsFromState,
    SubscribePropsFromDispatch {
  demoMode?: boolean;
  subscribeText: string;
  light?: boolean;
  partnerships?: boolean;
}

export function SubscribeMapStateToProps({ api, user }: StateTree) {
  return {
    account: user.account,
    api,
  };
}

export const SubscribeMapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
  updateUser: User.actions.update,
};
