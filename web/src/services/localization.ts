require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import { isProduction } from '../utility';
import API from './api';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? [DEFAULT_LOCALE]
  : [
      'ca',
      'cs',
      'cv',
      'en',
      'fr',
      'he',
      'mk',
      'nn-NO',
      'pt-BR',
      'sv-SE',
      'tr',
      'tt',
      'zh-CN',
      'zh-TW',
    ];

export async function createMessagesGenerator(api: API, userLocales: string[]) {
  const currentLocales = negotiateLanguages(userLocales, LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
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
