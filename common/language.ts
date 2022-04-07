// a single accent object
export type Accent = {
  id: number;
  name: string;
  token?: string;
  clientId?: string;
};

// a single accent object
export type Language = {
  id: number;
  name: string;
  target_sentence_count: number;
  total_sentence_count?: number;
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
