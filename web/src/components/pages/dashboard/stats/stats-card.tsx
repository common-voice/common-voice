import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import LanguageSelect, {
  ALL_LOCALES,
} from '../../../language-select/language-select';

import './stats-card.css';

export default function StatsCard({
  title,
  iconButtons,
  tabs,
}: {
  title: string;
  iconButtons?: React.ReactNode;
  tabs: { [label: string]: (props: { locale: string }) => any };
}) {
  const [locale, setLocale] = useState(ALL_LOCALES);
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0]);

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
                onClick={() => setSelectedTab(label)}
              />
            </Localized>
          ))}
        </div>
        <LanguageSelect value={locale} onChange={setLocale} />
      </div>
      <div className="content">
        {tabs[selectedTab]({ locale: locale == ALL_LOCALES ? null : locale })}
      </div>
    </div>
  );
}
