import { Sentence as SentenceType } from 'common';

interface Recording {
  blob: Blob;
  url: string;
  type?: string;
}

export interface SentenceRecording {
  sentence: SentenceType;
  recording?: Recording;
}
