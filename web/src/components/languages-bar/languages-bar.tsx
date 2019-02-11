import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UserClient } from 'common/user-clients';
import StateTree from '../../stores/tree';
import { ALL_LOCALES } from '../language-select/language-select';

import './languages-bar.css';

interface PropsFromState {
  account: UserClient;
}

interface Props extends PropsFromState {
  children?: React.ReactNode;
  locale: string;
  onLocaleChange: (locale: string) => any;
}

const TITLE_BAR_LOCALE_COUNT = 3;

const LanguagesBar = ({ account, children, locale, onLocaleChange }: Props) => {
  const [showTitleBarLocales, setShowTitleBarLocales] = useState(true);

  useEffect(() => {
    const checkSize = () => {
      setShowTitleBarLocales(window.innerWidth > 992);
    };
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  const locales = [ALL_LOCALES].concat(
    (account ? account.locales : []).map(({ locale }) => locale)
  );
  const titleBarLocales = showTitleBarLocales
    ? locales.slice(0, TITLE_BAR_LOCALE_COUNT)
    : [];
  const dropdownLocales = showTitleBarLocales
    ? locales.slice(TITLE_BAR_LOCALE_COUNT)
    : locales;
  return (
    <div className="languages-bar">
      {children}

      <div className="underlined">
        <div className="languages">
          <span>
            <Localized id="your-languages">
              <span />
            </Localized>
            :
          </span>
          {titleBarLocales.map(l => (
            <label key={l}>
              <input
                type="radio"
                name="language"
                checked={l == locale}
                onChange={() => onLocaleChange(l)}
              />
              <Localized id={l}>
                <span />
              </Localized>
            </label>
          ))}
          {dropdownLocales.length > 0 && (
            <select
              className={dropdownLocales.includes(locale) ? 'selected' : ''}
              name="language"
              value={locale}
              onChange={({ target: { value } }) => {
                if (value) {
                  onLocaleChange(value);
                }
              }}>
              {titleBarLocales.length > 0 && <option value="" />}
              {dropdownLocales.map(l => (
                <Localized key={l} id={l}>
                  <option value={l} />
                </Localized>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect<PropsFromState>(({ user }: StateTree) => ({
  account: user.account,
}))(LanguagesBar);
