import { UserClient } from 'common';
import API from '../../../services/api';
import { Notifications } from '../../../stores/notifications';
import StateTree from '../../../stores/tree';
import { LocalePropsFromState } from '../../locale-helpers';
import { LocalizationProps } from 'fluent-react/compat';

//Datasets-info interfaces
export interface DPropsFromState {
  api: API;
}

export type DProps = LocalePropsFromState & LocalizationProps & DPropsFromState;

//Subscribe form interfaces
export interface SPropsFromState {
  account: UserClient;
  api: API;
}

export interface SProps extends SPropsFromState, SPropsFromDispatch {}

export interface SPropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
}

export function SMapStateToProps({ api, user }: StateTree) {
  return {
    account: user.account,
    api,
  };
}

export const SMapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
};
