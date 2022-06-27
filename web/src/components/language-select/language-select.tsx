import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import Downshift from 'downshift';
import * as React from 'react';

import './language-select.css';
import useSortedLocales from '../../hooks/use-sorted-locales';
import { useContributableLocales } from '../locale-helpers';

export const ALL_LOCALES = 'all-locales';

const LanguageSelect = ({
  value,
  onChange,
  getString,
}: {
  value: string;
  onChange: (locale: string) => any;
} & WithLocalizationProps) => {
  const contributableLocales = useContributableLocales();
  const [sortedLocales] = useSortedLocales(contributableLocales, getString);

  return (
    <Downshift initialInputValue={value} onChange={onChange}>
      {({ getItemProps, highlightedIndex, isOpen, toggleMenu }) => (
        <div className="language-select" onClick={() => toggleMenu()}>
          <Localized id={value}>
            <div className="current" />
          </Localized>
          {isOpen && (
            <ul onClick={() => toggleMenu()}>
              {[ALL_LOCALES].concat(sortedLocales).map((l, i) => (
                <Localized key={l} id={l}>
                  <li
                    className={[
                      l === value ? 'selected' : '',
                      highlightedIndex === i ? 'highlighted' : '',
                    ].join(' ')}
                    {...getItemProps({ item: l })}
                    value={l}
                  />
                </Localized>
              ))}
            </ul>
          )}
        </div>
      )}
    </Downshift>
  );
};

export default withLocalization(LanguageSelect);
