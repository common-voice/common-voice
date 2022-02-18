// a single accent object
export type Accent = {
  id: number;
  name: string;
  token?: string;
  clientId?: string;
};

/*
  an object storing all
  accent/locale/variant data for a user
*/
export type UserLanguage = {
  locale: string;
  accents?: Accent[];
};
