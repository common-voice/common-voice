export type FeatureToken = 'singleword_benchmark';

export type FeatureType = {
  name: string;
  configFlag: string;
  storageKey?: string;
  locales?: string[];
};

export const features: { [key in FeatureToken]: FeatureType } = {
  singleword_benchmark: {
    name: 'Yes/No/Spoken Digit Benchmark',
    storageKey: 'hideTargetSegmentBanner',
    configFlag: 'BENCHMARK_LIVE',
    locales: [
      'en',
      'ar',
      'ca',
      'de',
      'es',
      'fr',
      'nl',
      'pl',
      'pt',
      'ru',
      'ta',
      'tr',
      'tt',
    ],
  },
};
