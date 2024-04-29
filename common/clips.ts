import { Variant } from './language';
import { TaxonomyType } from './taxonomies';

export type Sentence = {
  id: string;
  text: string;
  taxonomy?: TaxonomyType;
  variant?: Variant;
};

export type Clip = {
  id: string;
  glob: string;
  sentence: Sentence;
  audioSrc: string;
};
