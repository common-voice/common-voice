// a single accent object
export type Accent = {
  id: number;
  name: string;
  token?: string;
  clientId?: string;
};

export type SentenceCount = {
  currentCount: number;
  targetSentenceCount: number;
};

// a single accent object
export type Language = {
  id: number;
  name: string;
  sentenceCount: SentenceCount;
  isContributable?: boolean;
};

// single variant object
export type Variant = {
  id: number;
  name: string;
  token: string;
};

/*
  an object storing all
  accent/locale/variant data for a user
*/
export type UserLanguage = {
  locale: string;
  variant?: Variant;
  accents?: Accent[];
};
