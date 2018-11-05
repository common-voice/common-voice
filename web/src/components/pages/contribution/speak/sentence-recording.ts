import { Sentences } from '../../../../stores/sentences';

interface Recording {
  blob: Blob;
  url: string;
}

export interface SentenceRecording {
  sentence: Sentences.Sentence;
  recording?: Recording;
}
