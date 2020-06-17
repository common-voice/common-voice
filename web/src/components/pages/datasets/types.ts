import { UserClient } from 'common';
import API from '../../../services/api';
import { Notifications } from '../../../stores/notifications';
import StateTree from '../../../stores/tree';
import { LocalePropsFromState } from '../../locale-helpers';
import { WithLocalizationProps } from '@fluent/react';

//Datasets-info interfaces
export interface DatasetPropsFromState {
  api: API;
}

//Subscribe form interfaces
export interface SubscribePropsFromState {
  account: UserClient;
  api: API;
}

export interface SubscribePropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
}

export interface SubscribeProps
  extends SubscribePropsFromState,
    SubscribePropsFromDispatch {}

export function SubscribeMapStateToProps({ api, user }: StateTree) {
  return {
    account: user.account,
    api,
  };
}

export const SubscribeMapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
};
