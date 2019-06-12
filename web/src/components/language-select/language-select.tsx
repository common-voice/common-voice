import { Localized } from 'fluent-react/compat';
import Downshift from 'downshift';
import * as React from 'react';

const contributableLocales = require('../../../../locales/contributable.json') as string[];

import './language-select.css';

export const ALL_LOCALES = 'all-locales';

export default ({
  value,
  onChange,
}: {
  value: string;
  onChange: (locale: string) => any;
}) => (
  <Downshift initialInputValue={value} onChange={onChange}>
    {({ getItemProps, highlightedIndex, isOpen, toggleMenu }) => (
      <div className="language-select" onClick={() => toggleMenu()}>
        <Localized id={value}>
          <div className="current" />
        </Localized>
        {isOpen && (
          <ul onClick={() => toggleMenu()}>
            {[ALL_LOCALES].concat(contributableLocales).map((l, i) => (
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
