export type Sentence = {
  id: string;
  text: string;
  taxonomy?: string;
};

export type Clip = {
  id: string;
  glob: string;
  sentence: Sentence;
  audioSrc: string;
};
