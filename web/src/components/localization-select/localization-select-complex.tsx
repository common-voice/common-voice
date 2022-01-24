import * as React from 'react';
import { useSelect } from 'downshift';
import classNames from 'classnames';

import { LocalizedGetAttribute } from '../locale-helpers';
import { LOCALES, LOCALES_WITH_NAMES } from '../../services/localization';
import VisuallyHidden from '../visually-hidden/visually-hidden';

import './localization-select.css';

interface LocaleWithName {
  code: string;
  name: string;
}

interface Props {
  locale?: string;
  onLocaleChange: (props: any) => any;
}

const LocalizationSelectComplex = ({ locale, onLocaleChange }: Props) => {
  const initialSelectedItem =
    LOCALES_WITH_NAMES.find(({ code }) => code === locale) || LOCALES[0];
  const items = LOCALES_WITH_NAMES;

  function onSelectedItemChange({ selectedItem }: any) {
    if (selectedItem.code) {
      onLocaleChange(selectedItem.code);
    }
  }

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items, initialSelectedItem, onSelectedItemChange });

  const selectedLocale = selectedItem as LocaleWithName;

  // don't show select if we dont have multiple locales
  if (items.length <= 1) {
    return null;
  }

  return (
    <LocalizedGetAttribute id="localization-select" attribute="label">
      {(label: string) => (
        <div
          className={classNames('localization-select with-down-arrow', {
            'localization-select--open': isOpen,
          })}>
          <VisuallyHidden>
            <label {...getLabelProps()}>{label}</label>
          </VisuallyHidden>
          <button
            aria-label={selectedLocale.name}
            className="button"
            type="button"
            {...getToggleButtonProps()}>
            {locale}
          </button>
          <div className="list-wrapper">
            <div className="triangle" />
            <ul {...getMenuProps()}>
              {items.map((item, index) => (
                <li
                  key={item.code}
                  className={classNames({
                    selected: item.code === locale,
                    highlighted: index == highlightedIndex,
                  })}
                  {...getItemProps({ item })}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </LocalizedGetAttribute>
  );
};

export default LocalizationSelectComplex;
