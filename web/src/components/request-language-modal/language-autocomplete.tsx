import Downshift from 'downshift';
import { Localized, useLocalization } from '@fluent/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useAction } from '../../hooks/store-hooks';
import { RequestedLanguages } from '../../stores/requested-languages';
import { useTypedSelector } from '../../stores/tree';
import { LabeledInput } from '../ui/ui';

export default function LanguageAutocomplete({
  onChange,
}: {
  onChange: (...args: any[]) => any;
}) {
  const requestedLanguages = useTypedSelector(
    store => store.requestedLanguages.languages
  );
  const fetchRequestedLanguages = useAction(RequestedLanguages.actions.fetch);

  // Types for Downshift haven't caught up yet. Can be removed in the future
  const Input = LabeledInput as any;

  useEffect(() => {
    fetchRequestedLanguages();
  }, []);

  const { l10n } = useLocalization()

  return (
    <Downshift onChange={onChange}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => {
        const options = Array.from(
          new Set(requestedLanguages || [])
        ).filter(name => name.toLowerCase().includes(inputValue.toLowerCase()));
        const exactMatch = options.find(
          name => name.toLowerCase() === inputValue.toLowerCase()
        );
        return (
          <div>
            <Localized id="language-autocomplete" attrs={{ label: true }}>
              <Input
                {...getInputProps({
                  // TODO: need to see how this looks
                  label: l10n.getString('other-language'),
                  required: true,
                  type: 'text',
                })}
              />
            </Localized>
            <div style={{ position: 'relative' }}>
              {isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '-1rem',
                    zIndex: 10,
                    border: '1px solid #ccc',
                    width: '100%',
                    maxHeight: '5rem',
                    overflowY: 'auto',
                    background: 'white',
                  }}>
                  {!exactMatch && (
                    <div
                      {...getItemProps({ item: inputValue })}
                      style={{
                        backgroundColor:
                          highlightedIndex === 0 ? 'lightgray' : 'white',
                        fontWeight: selectedItem === name ? 'bold' : 'normal',
                      }}>
                      Add new Language "{inputValue}"
                    </div>
                  )}
                  {options.map((name, index) => (
                    <div
                      {...getItemProps({ item: name })}
                      key={name}
                      style={{
                        backgroundColor:
                          highlightedIndex === index + (exactMatch ? 0 : 1)
                            ? 'lightgray'
                            : 'white',
                        fontWeight: selectedItem === name ? 'bold' : 'normal',
                      }}>
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
}
