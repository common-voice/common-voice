import { TaxonomyType } from './taxonomies';

export type Sentence = {
  id: string;
  text: string;
  taxonomy?: TaxonomyType;
};

export type Clip = {
  id: string;
  glob: string;
  sentence: Sentence;
  audioSrc: string;
};
