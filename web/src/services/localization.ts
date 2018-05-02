require('fluent-intl-polyfill');
const { MessageContext } = require('fluent');
const { negotiateLanguages } = require('fluent-langneg');
import ISO6391 from 'iso-639-1';
const locales = require('../../../data/locales.json');
const completedLocales = require('../../../data/completed_locales.json');
import { isProduction } from '../utility';
import API from './api';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = isProduction()
  ? (completedLocales as string[])
  : Object.keys(locales);
export const CONTRIBUTABLE_LOCALES = ['en'];

const localeNations: any = {
  'es-AR': 'de Argentina',
  'es-CL': 'de Chile',
  'pt-BR': 'Brasil',
  'sv-SE': 'Sverige',
  'zh-CN': '简体',
  'zh-TW': '繁體',
};

export function getNativeNameWithFallback(locale: string) {
  let nativeName = ISO6391.getNativeName(locale);

  if (nativeName) {
    return nativeName;
  }

  const [localePart, nationPart] = locale.split('-');
  nativeName = ISO6391.getNativeName(localePart);
  if (nativeName) {
    // Norwegian locales are identifiable by their first part alone
    if (nationPart == 'NO') return nativeName;

    const nation = localeNations[locale];
    return nation
      ? `${nativeName} (${nation})`
      : nativeName + ' ' + (locales[locale].split(' ')[1] || '');
  }

  return locale;
}

export function negotiateLocales(locales: string[]) {
  return negotiateLanguages(locales, LOCALES, {
    defaultLocale: DEFAULT_LOCALE,
  });
}

function* asMessageContextGenerator(localeMessages: string[][]) {
  for (const [locale, messages] of localeMessages) {
    const cx = new MessageContext(locale, { useIsolating: false });
    cx.addMessages(messages);
    yield cx;
  }
}

export function createCrossLocaleMessagesGenerator(
  localeMessages: string[][],
  locales: string[]
) {
  const currentLocales = negotiateLocales([...locales, ...navigator.languages]);

  localeMessages = localeMessages
    .filter(([locale]) => currentLocales.includes(locale))
    .sort(
      ([locale1], [locale2]) =>
        currentLocales.indexOf(locale1) > currentLocales.indexOf(locale2)
          ? 1
          : -1
    );

  return asMessageContextGenerator(localeMessages);
}

export async function createMessagesGenerator(api: API, userLocales: string[]) {
  const currentLocales = negotiateLocales(userLocales);

  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocaleMessages(locale),
    ])
  );

  return asMessageContextGenerator(localeMessages);
}
