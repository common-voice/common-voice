import * as React from 'react';
import { connect } from 'react-redux';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';
import { Locale } from '../stores/locale';
import StateTree, { useTypedSelector } from '../stores/tree';
import { Localized } from '@fluent/react';

export interface LocalePropsFromState {
  locale: Locale.State;
  toLocaleRoute: (path: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface LocaleProps extends LocalePropsFromState {
  dispatch: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const toLocaleRouteBuilder = (locale: string) => (path: string) =>
  `/voicewall/${locale}${path}`;

export const localeConnector = connect<LocalePropsFromState>(
  ({ locale }: StateTree) => ({
    locale,
    toLocaleRoute: toLocaleRouteBuilder(locale),
  }),
  null,
  null,
  { pure: false }
);

export function useLocale(): [string, (path: string) => string] {
  const locale = useTypedSelector(({ locale }) => locale);

  return [locale, toLocaleRouteBuilder(locale)];
}

export function useToLocaleRoute(): (path: string) => string {
  const [locale] = useLocale();
  return toLocaleRouteBuilder(locale);
}

export function useNativeLocaleNames() {
  return useTypedSelector(({ languages }) => languages.nativeNames);
}

export function useContributableLocales() {
  return useTypedSelector(({ languages }) => languages.contributableLocales);
}

export function useContributableNativeNames() {
  return useTypedSelector(
    ({ languages }) => languages.contributableNativeNames
  );
}

export function useLocalizedDiscourseURL() {
  const DISCOURSE_LOCALES = [
    'de',
    'ca',
    'es',
    'fr',
    'it',
    'sw',
    'tr',
    'uk',
    'rw',
    'uz',
    'zh-TW',
  ];
  const DISCOURSE_BASE = 'https://discourse.mozilla.org/c/voice';

  const [locale] = useLocale();

  if (!DISCOURSE_LOCALES.includes(locale)) {
    return DISCOURSE_BASE;
  }

  return `${DISCOURSE_BASE}/${locale}`;
}

export function useAvailableLocales() {
  const { translatedLocales } = useTypedSelector(({ languages }) => languages);
  return translatedLocales;
}

export function useNativeNameAvailableLocales() {
  const nativeNames = useNativeLocaleNames();
  const availableLocales = useAvailableLocales();

  return availableLocales
    .map((code: string) => {
      return {
        code,
        name: nativeNames[code] || code,
      };
    })
    .sort((localeA, localeB) => {
      return localeA.name.localeCompare(localeB.name);
    });
}

export const LocaleLink: any = localeConnector(
  (props: { blank?: boolean } & LinkProps & LocaleProps) => {
    const {
      dispatch,
      locale,
      blank,
      to,
      toLocaleRoute,
      children,
      ...restOfProps
    } = props;
    const blankProps = blank
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};
    return props.target ? (
      <a href={toLocaleRoute(to)} {...blankProps} {...restOfProps}>
        {children}
      </a>
    ) : (
      <Link to={toLocaleRoute(to)} {...blankProps} {...restOfProps}>
        {children}
      </Link>
    );
  }
);

export const LocaleNavLink = localeConnector(
  (props: NavLinkProps & LocaleProps) => {
    const { dispatch, locale, to, toLocaleRoute, children, ...restOfProps } =
      props;

    return (
      <NavLink to={toLocaleRoute(to)} {...restOfProps}>
        {children}
      </NavLink>
    );
  }
);

export function isContributable(locale: string) {
  const contributableLocales = useContributableLocales();
  return contributableLocales.includes(locale);
}

export const ContributableLocaleLock = localeConnector(
  ({
    children,
    locale,
    render,
  }: LocaleProps & {
    children?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    render?: (args: { isContributable: boolean }) => React.ReactNode;
  }) => {
    return render
      ? render({ isContributable: isContributable(locale) })
      : isContributable(locale) && children;
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetAttribute = (args: any) => args.fn(args[args.attribute]);

export const LocalizedGetAttribute = ({
  id,
  attribute,
  children,
}: {
  id: string;
  attribute: string;
  children: (value: string) => React.ReactElement<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => (
  <Localized id={id} attrs={{ [attribute]: true }}>
    <GetAttribute attribute={attribute} fn={children} />
  </Localized>
);
