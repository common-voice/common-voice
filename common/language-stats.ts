export type SentenceCount = {
  currentCount: number;
  targetSentenceCount: number;
};

export type BaseLanguage = {
  locale: string;
};

export type InProgressLanguage = BaseLanguage & {
  localizedPercentage: number;
  sentencesCount: SentenceCount;
};

export type LaunchedLanguage = BaseLanguage & {
  seconds: number;
  speakers: {
    currentCount: number;
  };
};

export interface LanguageStats {
  inProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
}
