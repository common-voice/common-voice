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

export type InProgressLanguage = BaseLanguage & {
  localizedPercentage: number;
};

export type LaunchedLanguage = BaseLanguage & {
  recordedHours: number;
  validatedHours: number;
  speakersCount: number;
  sentencesCount: SentenceCount;
};

export interface LanguageStats {
  inProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
}
