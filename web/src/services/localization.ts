require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import { isProduction } from '../utility';
import API from './api';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? [DEFAULT_LOCALE]
  : [
      'es-CL',
      'ca',
      'zh-TW',
      'el',
      'en',
      'nn-NO',
      'id',
      'sv-SE',
      'sk',
      'tt',
      'cv',
      'tr',
      'de',
      'cs',
      'cy',
      'th',
      'pt-BR',
      'ru',
      'mk',
      'fr',
      'pl',
      'fy-NL',
      'he',
      'zh-CN',
      'nl',
      'sq',
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
