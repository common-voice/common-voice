import { DPropsFromState } from '../../pages/datasets/types';

export interface PageContentType {
  Content: React.ComponentType<any>;
  Card: React.ComponentType<any>;
}

export interface DownloadFormProps extends DPropsFromState {
  getString: Function;
  size: string;
  bundleLocale: string;
}
