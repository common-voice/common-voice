// a single accent object
export type Accent = {
  id: number;
  name: string;
  token?: string;
  clientId?: string;
};

// an object storing all accent/locale
// data for a user
export type UserAccentLocale = {
  locale: string;
  accents?: Accent[]
};