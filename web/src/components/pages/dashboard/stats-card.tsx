import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import LanguageSelect, {
  ALL_LOCALES,
} from '../../language-select/language-select';

import './stats-card.css';

export default class StatsCard extends React.Component<{
  title: string;
  iconButtons?: React.ReactNode;
  tabs: { [label: string]: (props: { locale: string }) => any };
}> {
  state = { locale: ALL_LOCALES, selectedTab: Object.keys(this.props.tabs)[0] };

  render() {
    const { title, iconButtons, tabs } = this.props;
    const { selectedTab, locale } = this.state;

    return (
      <div className="stats-card">
        <div className="title-and-icon">
          <Localized id={title}>
            <h2 />
          </Localized>
          {iconButtons}
        </div>
        <div className="filters">
          <div className="tabs">
            {Object.keys(tabs).map(label => (
              <Localized key={label} id={label}>
                <button
                  type="button"
                  className={label == selectedTab ? 'selected' : ''}
                  onClick={() => this.setState({ selectedTab: label })}
                />
              </Localized>
            ))}
          </div>
          <LanguageSelect
            value={locale}
            onChange={locale =>
              this.setState({
                locale,
              })
            }
          />
        </div>
        <div className="content">
          {tabs[selectedTab]({ locale: locale == ALL_LOCALES ? null : locale })}
        </div>
      </div>
    );
  }
}
