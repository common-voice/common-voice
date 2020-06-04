import { PropsFromState } from '../../pages/datasets/dataset-info';
import { LocalizationProps } from 'fluent-react/compat';

export interface PageContentType {
  Content: React.ComponentClass<any, any>;
  Card: React.ComponentClass<any, any>;
}

export interface DownloadFormProps extends PropsFromState {
  getString: Function;
  size: string;
  bundleLocale: string;
}

export type SubscribeFormProps = PropsFromState & LocalizationProps;
