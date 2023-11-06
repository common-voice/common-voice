import * as React from 'react';
import { useSelect } from 'downshift';
import classNames from 'classnames';

import {
  LocalizedGetAttribute,
  useAvailableLocales,
  useNativeNameAvailableLocales,
} from '../locale-helpers';
import VisuallyHidden from '../visually-hidden/visually-hidden';
import { AbortContributionModalStatus } from '../../stores/abort-contribution-modal';
import { useAbortContributionModal } from '../../hooks/store-hooks';

import './localization-select.css';

interface Props {
  locale?: string;
  onLocaleChange?: (props: string) => void;
}

function getLocaleWithName(locale: string) {
  const availableLocalesWithNames = useNativeNameAvailableLocales();
  return availableLocalesWithNames.find(({ code }) => code === locale);
}

const LocalizationSelectComplex = ({ locale, onLocaleChange }: Props) => {
  const availableLocales = useAvailableLocales();
  const availableLocalesWithNames = useNativeNameAvailableLocales();
  const { abortStatus } = useAbortContributionModal();
  const localWithName = getLocaleWithName(locale);
  const initialSelectedItem = localWithName
    ? localWithName.code
    : availableLocales[0];
  const items = availableLocalesWithNames.map(locale => locale.code);

  function onSelectedItemChange({ selectedItem }: { selectedItem: string }) {
    if (selectedItem && selectedItem !== locale) {
      onLocaleChange(selectedItem);
    }
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useSelect({ items, initialSelectedItem, onSelectedItemChange });

  React.useEffect(() => {
    // if the user does not choose to switch in the abort modal
    // set the locale as the selected item
    if (abortStatus === AbortContributionModalStatus.REJECTED) {
      selectItem(locale);
    }
  }, [abortStatus]);

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
          <button className="button" type="button" {...getToggleButtonProps()}>
            {locale}
          </button>
          <div className="list-wrapper">
            <ul {...getMenuProps()}>
              {items.map((item, index) => (
                <li
                  key={item}
                  className={classNames({
                    selected: item === locale,
                    highlighted: index == highlightedIndex,
                  })}
                  {...getItemProps({ item })}>
                  {getLocaleWithName(item).name}
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
