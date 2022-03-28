interface LocaleReleaseData {
  checksum?: string;
  clips: number;
  splits: {
    accent: {
      [key: string]: number;
    };
    age: {
      [key: string]: number;
    };
    gender: {
      [key: string]: number;
    };
  };
  users: number;
  duration: number;
  buckets: {
    dev: number;
    invalidated: number;
    other: number;
    test: number;
    train: number;
    validated: number;
  };
  size: number;
  avgDurationSecs: number;
  validDurationSecs: number;
  totalHrs: number;
  validHrs: number;
}

export interface ReleaseData {
  bundleURLTemplate?: string;
  bundleUrl?: string;
  date: string;
  name: string;
  multilingual: boolean;
  locales: {
    [key: string]: LocaleReleaseData;
  };
  totalDuration: number;
  totalValidDurationSecs: number;
  totalHrs: number;
  totalValidHrs: number;
  totalClips: number;
}

export interface BundleState {
  bundleLocale: string;
  checksum: string;
  size: string;
  language: string;
  totalHours: number;
  validHours: number;
  rawSize: number;
  releaseId?: string;
}
