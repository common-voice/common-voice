export type UserClient = {
  email?: string;
  username?: string;
  client_id?: string;
  age?: string;
  gender?: string;
  locales?: { locale: string; accent: string }[];
  visible?: boolean;
  basket_token?: string;
};
