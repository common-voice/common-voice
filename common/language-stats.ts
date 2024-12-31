export type SentenceCount = {
  currentCount: number;
  targetSentenceCount: number;
};

export type GenericStatistic = {
  locale_id: number;
  count: number;
};

export type BaseLanguage = {
  locale: string;
  sentencesCount: SentenceCount;
  is_contributable: boolean;
};

export type LanguageStatistics = BaseLanguage & {
  recordedHours: number;
  validatedHours: number;
  speakersCount: number;
  sentencesCount: SentenceCount;
  localizedPercentage: number;
  locale?: string;
  lastFetched: string;
};

export enum TableNames {
  DOWNLOADS = 'downloaders',
  CLIPS = 'clips',
  USERS = 'user_clients',
  SENTENCES = 'sentences',
}

//time in ms
export enum TimeUnits {
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
}
