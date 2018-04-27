import Downshift from 'downshift';
import { Localized } from 'fluent-react';
import ISO6391 from 'iso-639-1';
import * as React from 'react';
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

class LanguageAutocomplete extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchRequestedLanguages();
  }

  render() {
    return (
      <Downshift
        onChange={this.props.onChange}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => {
          const options = Array.from(
            new Set(
              ISO6391.getAllNames().concat(this.props.requestedLanguages || [])
            )
          )
            .map(name => {
              const code = ISO6391.getCode(name);
              return code
                ? [ISO6391.getName(code), ISO6391.getNativeName(code)]
                : [name, ''];
            })
            .filter(
              ([name, nativeName]) =>
                name.toLowerCase().includes(inputValue.toLowerCase()) ||
                nativeName.toLowerCase().includes(inputValue.toLowerCase())
            );
          const exactMatch = options.find(
            ([name]) => name.toLowerCase() === inputValue.toLowerCase()
          );
          return (
            <div>
              <Localized id="language-autocomplete" attrs={{ label: true }}>
                <LabeledInput
                  {...getInputProps({
                    label: 'Other Language',
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
                    {options.map(([name, nativeName], index) => (
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
                        {name + (nativeName ? ` (${nativeName})` : '')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    );
  }
}

const mapStateToProps = ({ requestedLanguages }: StateTree) => ({
  requestedLanguages: requestedLanguages.languages,
});

const mapDispatchToProps = {
  fetchRequestedLanguages: RequestedLanguages.actions.fetch,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(LanguageAutocomplete);
