import { DPropsFromState } from '../../pages/datasets/types';

export interface PageContentType {
  Content: React.ComponentClass<any, any>;
  Card: React.ComponentClass<any, any>;
}

export interface DownloadFormProps extends DPropsFromState {
  getString: Function;
  size: string;
  bundleLocale: string;
}
