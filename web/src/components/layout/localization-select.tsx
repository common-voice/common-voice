import Downshift from 'downshift';
import * as React from 'react';
import { NATIVE_NAMES } from '../../services/localization';

interface Props {
  locale: string;
  locales: string[][];
  onChange: (locale: string) => any;
}

export default ({ locale, locales, onChange }: Props) => (
  <Downshift
    initialHighlightedIndex={locales.findIndex(([code]) => code == locale)}
    isOpen={true}
    onChange={onChange}>
    {({ getInputProps, getItemProps, highlightedIndex }) => (
      <div className="localization-select with-down-arrow">
        <div
          className="selection"
          tabIndex={0}
          {...getInputProps()}
          title={NATIVE_NAMES[locale]}>
          {locale}
        </div>
        <div className="list-wrapper">
          <div className="filler" />
          <div className="triangle" />
          <ul>
            {locales.map(([code, name], index) => (
              <li
                key={code}
                className={[
                  code === locale ? 'selected' : '',
                  index == highlightedIndex ? 'highlighted' : '',
                ].join(' ')}
                {...getItemProps({ item: code })}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </Downshift>
);
