import * as React from 'react';
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import Downshift from 'downshift';

import { LabeledInput } from '../../../../../ui/ui';
import { AccentsAll } from '../languages';
import { UserLanguage } from 'common';

import InputLanguageAccentsList from '../input-language-accents/input-language-accents-list';

import './input-language-accents.css';

// TODO: Types for Downshift haven't caught up yet. Can be removed in the future
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = LabeledInput as any;

const clean = (text: string) => {
  return text ? text.trim().toLowerCase() : '';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stateReducer(state: any, changes: any) {
  // this clears out the Downshift input upon selecting an accent
  switch (changes.type) {
    case Downshift.stateChangeTypes.keyDownEnter:
    case Downshift.stateChangeTypes.clickItem:
    case Downshift.stateChangeTypes.mouseUp:
    case Downshift.stateChangeTypes.blurInput:
      return {
        ...changes,
        inputValue: '',
      };
    default:
      return changes;
  }
}

interface Props {
  locale: string;
  accents?: Array<{ id: number; name: string }>;
  accentsAll: AccentsAll;
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
}

const InputLanguageAccentsInput = ({
  locale,
  accentsAll,
  accents,
  userLanguages,
  setUserLanguages,
  getString,
}: Props & WithLocalizationProps) => {
  const getAutocompleteAccents = (locale: string) => {
    if (!accentsAll[locale]) {
      return [];
    }

    return Object.values({
      ...accentsAll[locale].userGenerated,
      ...accentsAll[locale].preset,
    });
  };

  const updateCustomAccent = (
    accent: { id: number; name: string } | string,
    locale: string
  ) => {
    const accentName = typeof accent === 'string' ? accent : accent.name;
    const accentId = typeof accent === 'string' ? null : accent.id;

    const newLanguages = userLanguages.slice() as UserLanguage[];
    const languageIndex = newLanguages.findIndex(language => {
      return language.locale === locale;
    });

    const accentExists = newLanguages[languageIndex].accents.some(accentObj => {
      return accentObj.name === accentName;
    });

    if (accentExists) {
      return;
    }

    // if this is new custom accent, input value will be string
    // otherwise it will be Accent
    newLanguages[languageIndex] = {
      ...newLanguages[languageIndex],
      accents: (newLanguages[languageIndex].accents || []).concat({
        name: accentName,
        id: accentId,
      }),
    };

    setUserLanguages(newLanguages);
  };

  return (
    <>
      <Downshift
        onChange={selection => {
          if (selection !== null) {
            updateCustomAccent(selection, locale);
          }
        }}
        stateReducer={stateReducer}
        itemToString={item => (item ? item.name : '')}>
        {({
          getInputProps,
          getItemProps,
          openMenu,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectItem,
          clearSelection,
        }) => {
          const options = getAutocompleteAccents(locale).filter(item =>
            clean(item.name).includes(clean(inputValue))
          );

          const handleKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
          ) => {
            if (event.key === 'Enter') {
              const { value } = event.target as HTMLInputElement;

              // don't submit blank values
              if (value.trim().length === 0) {
                return;
              }

              selectItem(value, {
                type: Downshift.stateChangeTypes.keyDownEnter,
              });
            }
          };

          return (
            <div>
              <Localized
                id="profile-form-custom-accent-help-text"
                attrs={{ label: true }}>
                <Input
                  disabled={locale.length === 0}
                  {...getInputProps({
                    onFocus: openMenu,
                    onClick: openMenu,
                    type: 'text',
                    value: inputValue || '',
                    onKeyDown: handleKeyDown,
                    'aria-labelledby': null,
                  })}
                  id=""
                  placeholder={getString(
                    'profile-form-custom-accent-placeholder-2'
                  )}
                />
              </Localized>

              {isOpen ? (
                <ul
                  {...getMenuProps()}
                  data-testid="input-language-accents-input-list"
                  className={isOpen ? 'downshift-open' : ''}>
                  {options.map((item, index) => (
                    <li
                      key={item.name}
                      {...getItemProps({
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index
                              ? 'var(--light-grey)'
                              : 'initial',
                        },
                      })}>
                      {item.name}
                    </li>
                  ))}
                  {inputValue?.length > 0 && options.length == 0 && (
                    <li
                      {...getItemProps({ item: inputValue })}
                      className="add-new-accent">
                      <Localized
                        id="profile-form-add-accent"
                        vars={{ inputValue }}
                      />
                    </li>
                  )}
                </ul>
              ) : null}

              <InputLanguageAccentsList
                locale={locale}
                accents={accents}
                userLanguages={userLanguages}
                setUserLanguages={setUserLanguages}
                clearSelection={clearSelection}
              />
            </div>
          );
        }}
      </Downshift>
    </>
  );
};

export default withLocalization(InputLanguageAccentsInput);
