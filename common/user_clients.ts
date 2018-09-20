export type UserClients = {
  email?: string;
  sso?: true;
  client_id?: string;
  age?: string;
  gender?: string;
  locales?: { locale: string; accent: string }[];
}[];
