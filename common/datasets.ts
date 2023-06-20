export type Dataset = {
  id: number;
  release_dir: string;
  multilingual: boolean;
  bundle_date: string;
  release_date: string;
  total_clips_duration: number;
  valid_clips_duration: number;
  release_type: string;
  download_path: string;
  checksum?: string; //singleword releases have checksums
  size?: number; //singleword releases have size
  languages_count?: number; //singleword releases need language count
};

export type LanguageDataset = {
  id: number;
  dataset_id: number;
  locale_id: number;
  total_clips_duration: number;
  valid_clips_duration: number;
  average_clips_duration: number;
  total_users: number;
  size: number;
  checksum: string;
};

export type Datasets = Dataset[];
export type LanguageDatasets = LanguageDataset[];
