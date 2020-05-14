export type FeatureToken = 'singleword_benchmark';

export type FeatureType = {
  name: string;
  token: FeatureToken;
  storageKey?: string;
  locales?: string[];
};

export const features: { [key in FeatureToken]: FeatureType } = {
  singleword_benchmark: {
    name: 'Yes/No/Spoken Digit Benchmark',
    token: 'singleword_benchmark',
    storageKey: 'hideTargetSegmentBanner',
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

export const featureTokens = Object.values(features).map(
  feature => feature.token
);
