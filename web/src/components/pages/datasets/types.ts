import API from '../../../services/api';
import { WithLocalizationProps } from '@fluent/react';

//Datasets-info interfaces
export interface DatasetPropsFromState {
  api: API;
}

export interface CorpusProps extends DatasetPropsFromState {
  getString: WithLocalizationProps['getString'];
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
  rawSize: number;
  datasetVersion?: string;
}
