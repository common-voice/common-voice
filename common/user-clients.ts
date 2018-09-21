export type UserClient = {
  email?: string;
  sso?: true;
  username?: string;
  client_id?: string;
  age?: string;
  gender?: string;
  locales?: { locale: string; accent: string }[];
  visible?: boolean;
};
