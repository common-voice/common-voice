import Downshift from 'downshift';
import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { RequestedLanguages } from '../../stores/requested-languages';
import StateTree from '../../stores/tree';
import { LabeledInput } from '../ui/ui';

interface PropsFromState {
  requestedLanguages: string[];
}

interface PropsFromDispatch {
  fetchRequestedLanguages: typeof RequestedLanguages.actions.fetch;
}

interface Props extends PropsFromState, PropsFromDispatch {
  onChange: (...args: any[]) => any;
}

function LanguageAutocomplete({
  fetchRequestedLanguages,
  onChange,
  requestedLanguages,
}: Props) {
  // Types for Downshift haven't caught up yet. Can be removed in the future
  const Input = LabeledInput as any;

  useEffect(() => {
    fetchRequestedLanguages();
  }, []);

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
        const options = Array.from(new Set(requestedLanguages || [])).filter(
          name => name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const exactMatch = options.find(
          name => name.toLowerCase() === inputValue.toLowerCase()
        );
        return (
          <div>
            <Localized id="language-autocomplete" attrs={{ label: true }}>
              <Input
                {...getInputProps({
                  label: (
                    <Localized id="other-language">
                      <span />
                    </Localized>
                  ),
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

const mapStateToProps = ({ requestedLanguages }: StateTree) => ({
  requestedLanguages: requestedLanguages.languages,
});

const mapDispatchToProps = {
  fetchRequestedLanguages: RequestedLanguages.actions.fetch,
};

export default connect<PropsFromState, any>(
  mapStateToProps,
  mapDispatchToProps
)(LanguageAutocomplete) as any;
