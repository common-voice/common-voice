import { UserClient } from 'common';
import API from '../../../services/api';
import { Notifications } from '../../../stores/notifications';
import StateTree from '../../../stores/tree';

//Datasets-info interfaces
export interface DatasetPropsFromState {
  api: API;
}

export interface CorpusProps extends DatasetPropsFromState {
  getString: Function;
  releaseName: string;
}

export interface DownloadFormProps extends DatasetPropsFromState {
  release: string;
  urlPattern: string;
  bundleState: BundleState;
}

export interface BundleState {
  bundleLocale: string;
  checksum: string;
  size: string;
  language: string;
  totalHours: number;
  validHours: number;
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
    SubscribePropsFromDispatch {
  demoMode?: boolean;
}

export function SubscribeMapStateToProps({ api, user }: StateTree) {
  return {
    account: user.account,
    api,
  };
}

export const SubscribeMapDispatchToProps = {
  addNotification: Notifications.actions.addPill,
};
