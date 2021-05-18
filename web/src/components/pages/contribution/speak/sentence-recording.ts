import { Sentence as SentenceType } from 'common';

interface Recording {
  blob: Blob;
  url: string;
}

export interface SentenceRecording {
  sentence: SentenceType;
  recording?: Recording;
}
