export type BaseLanguage = {
  locale: string;
};

export type InProgressLanguage = BaseLanguage & {
  localizedPercentage: number;
  sentencesCount: number;
};

export type LaunchedLanguage = BaseLanguage & {
  seconds: number;
  speakers: number;
};

export interface LanguageStats {
  inProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
}
