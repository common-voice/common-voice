export type BaseLanguage = {
  locale: string;
};
type SentenceCount = {
  current_count: number;
  target_sentence_count: number;
};
export type InProgressLanguage = BaseLanguage & {
  localizedPercentage: number;
  sentencesCount: SentenceCount;
};

export type LaunchedLanguage = BaseLanguage & {
  seconds: number;
  speakers: {
    current_count: number;
  };
};

export interface LanguageStats {
  inProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
}
