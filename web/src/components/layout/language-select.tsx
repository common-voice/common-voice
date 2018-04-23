import Downshift from 'downshift';
import { Localized } from 'fluent-react';
import * as React from 'react';

interface Props {
  locale: string;
  locales: string[][];
  onChange: (locale: string) => any;
}

export default class LangaugeSelect extends React.Component<Props> {
  render() {
    const { locale, locales, onChange } = this.props;
    return (
      <Downshift
        onChange={onChange}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div className="language-select with-down-arrow">
            <Localized id={locale}>
              <div className="selection" tabIndex={0} {...getInputProps()} />
            </Localized>
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
