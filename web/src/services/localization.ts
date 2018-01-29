require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');

const MESSAGES_ALL: any = {
  en: `
help = Help
  `,
  de: `
help = Hilfe
  `,
};

export function* generateMessages(userLocales: string[]) {
  const currentLocales = negotiateLanguages(
    userLocales,
    Object.keys(MESSAGES_ALL),
    {
      defaultLocale: 'en',
    }
  );

  for (const locale of currentLocales) {
    const cx = new MessageContext(locale);
    cx.addMessages(MESSAGES_ALL[locale]);
    yield cx;
  }
}
