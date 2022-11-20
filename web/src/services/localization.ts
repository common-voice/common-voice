import 'intl-pluralrules'; // polyfill Intl.PluralRules
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { negotiateLanguages } = require('@fluent/langneg');
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { ReactLocalization } from '@fluent/react';
import { Flags } from '../stores/flags';
import API from './api';
import MessageOverwrites = Flags.MessageOverwrites;

export const DEFAULT_LOCALE = 'ar';

export function negotiateLocales(
  locales: ReadonlyArray<string>,
  availableLocales: ReadonlyArray<string>
) {
  return negotiateLanguages(locales, availableLocales, {
    defaultLocale: DEFAULT_LOCALE,
  });
}

// By implementing the sequence of FluentBundles as a generator, the cost of
// parsing fallback resources is deferred to until they're needed.
export function* asBundleGenerator(
  localeMessages: string[][],
  messageOverwrites?: MessageOverwrites
) {
  for (const [locale, messages] of localeMessages) {
    const bundle = new FluentBundle(locale, { useIsolating: false });
    bundle.addResource(
      new FluentResource(
        messages +
          (messageOverwrites?.[locale] ? '\n' + messageOverwrites[locale] : '')
      )
    );
    yield bundle;
  }
}

export function createCrossLocalization(
  localeMessages: string[][],
  locales: string[],
  availableLocales: string[]
) {
  const currentLocales = negotiateLocales(
    [...locales, ...navigator.languages],
    availableLocales
  );

  localeMessages = localeMessages
    .filter(([locale]) => currentLocales.includes(locale))
    .sort(([locale1], [locale2]) =>
      currentLocales.indexOf(locale1) > currentLocales.indexOf(locale2) ? 1 : -1
    );

  return new ReactLocalization(asBundleGenerator(localeMessages));
}

export async function createLocalization(
  api: API,
  userLocales: string[],
  messageOverwrites: MessageOverwrites,
  availableLocales: string[]
) {
  const currentLocales = negotiateLocales(userLocales, availableLocales);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localeMessages: any = await Promise.all(
    currentLocales.map(async (locale: string) => [
      locale,
      await api.fetchLocaleMessages(locale),
    ])
  );

  return new ReactLocalization(
    asBundleGenerator(localeMessages, messageOverwrites)
  );
}
