import { TaxonomyToken } from './taxonomies';

export type FeatureType = {
  name: string;
  configFlag: string;
  storageKey?: string;
  taxonomy?: TaxonomyToken;
};

export const features: { [key: string]: FeatureType } = {
  singleword_benchmark: {
    name: 'Yes/No/Spoken Digit Benchmark',
    storageKey: 'hideTargetSegmentBanner',
    configFlag: 'BENCHMARK_LIVE',
    taxonomy: 'singlewordBenchmark',
  },
  covid_19_spotter: {
    name: 'Covid-19 Keyword Spotter',
    configFlag: 'COVID19_LIVE',
    taxonomy: 'covid19Spotter',
  },
};
