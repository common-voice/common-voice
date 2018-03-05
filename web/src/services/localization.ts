require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import API from './api';

export async function createMessagesGenerator(
  api: API,
  userLocales: string[],
  supportedLocales = ['en']
) {
  const currentLocales = negotiateLanguages(userLocales, supportedLocales, {
    defaultLocale: 'en',
  });

  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocale(locale),
    ])
  );
  return function*(): any {
    for (const [locale, messages] of localeMessages) {
      const cx = new MessageContext(locale);
      cx.addMessages(messages);
      yield cx;
    }
  };
}
