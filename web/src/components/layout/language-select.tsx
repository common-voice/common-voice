import Downshift from 'downshift';
import * as React from 'react';
import { getNativeNameWithFallback } from '../../services/localization';

interface Props {
  locale: string;
  locales: string[][];
  onChange: (locale: string) => any;
}

export default class LanguageSelect extends React.PureComponent<Props> {
  render() {
    const { locale, locales, onChange } = this.props;
    return (
      <Downshift
        defaultHighlightedIndex={locales.findIndex(([code]) => code == locale)}
        isOpen={true}
        onChange={onChange}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div className="language-select with-down-arrow">
            <div className="selection" tabIndex={0} {...getInputProps()}>
              {getNativeNameWithFallback(locale)}
            </div>
            <div className="list-wrapper">
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
      />
    );
  }
}
