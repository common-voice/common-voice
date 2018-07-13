export type BaseLanguage = {
  locale: {
    code: string;
    name: string;
  };
};

export type InProgressLanguage = BaseLanguage & {
  localizedPercentage: number;
  sentencesCount: number;
};

export type LaunchedLanguage = BaseLanguage & {
  hours: number;
  speakers: number;
};

export interface LanguageStats {
  inProgress: InProgressLanguage[];
  launched: LaunchedLanguage[];
}
