import { WithLocalizationProps } from '@fluent/react';
import { useLocale } from '../components/locale-helpers';
import { useMemo } from 'react';

/**
 * An object describing a locale and its localized name.
 */
interface LocalizedLocale {
  locale: string;
  localizedName: string;
}

/**
 * This hook provides a sorted list of locales and their localized names.
 *
 * @param {string[]} locales A list of locales to sort by localized name.
 * @param {function} getString A function that translates a locale to its localized name.
 *
 * @return {[string[], LocalizedLocale[]]} A tuple with both a simple, sorted array of locales, and an array of locales with their localized names.
 */
function useSortedLocales(
  locales: string[],
  getString: WithLocalizationProps['getString']
): [locales: string[], localizedLocales: LocalizedLocale[]] {
  const [clientLocale] = useLocale();

  // Memoize the array of locales and only recompute when necessary.
  const sortedLocales: LocalizedLocale[] = useMemo(
    () =>
      locales
        .map(locale => ({
          locale,
          localizedName: getString(locale).toLocaleLowerCase(clientLocale),
        }))
        .sort(({ localizedName: a }, { localizedName: b }) =>
          a.localeCompare(b, clientLocale)
        ),
    [locales, clientLocale, getString]
  );

  return [sortedLocales.map(({ locale }) => locale), sortedLocales];
}

export default useSortedLocales;
