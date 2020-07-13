import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import LanguageSelect, {
  ALL_LOCALES,
} from '../../../language-select/language-select';

import './stats-card.css';

export default function StatsCard({
  className,
  title,
  iconButtons,
  overlay,
  tabs,
  challenge,
  currentLocale,
}: {
  className?: string;
  title: string;
  iconButtons?: React.ReactNode;
  overlay?: React.ReactNode;
  tabs?: { [label: string]: (props: { locale?: string }) => any };
  challenge?: boolean;
  currentLocale?: string;
}) {
  const [locale, setLocale] = useState(ALL_LOCALES);
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0]);
  useEffect(() => setLocale(currentLocale ? currentLocale : ALL_LOCALES), [
    currentLocale,
  ]);

  return (
    <div className={'stats-card ' + (className || '')}>
      {overlay}
      <div className="stats-card__inner">
        <div className="title-and-icon">
          {challenge ? (
            <h2 className="challenge-title">{title}</h2>
          ) : (
            <Localized id={title}>
              <h2 />
            </Localized>
          )}
          {iconButtons}
        </div>
        <div className="filters">
          <div className="tabs">
            {Object.keys(tabs).map(label => {
              return challenge ? (
                <button
                  key={label}
                  type="button"
                  className={label == selectedTab ? 'selected' : ''}
                  onClick={() => setSelectedTab(label)}>
                  {label}
                </button>
              ) : (
                <Localized key={label} id={label}>
                  <button
                    type="button"
                    className={label == selectedTab ? 'selected' : ''}
                    onClick={() => setSelectedTab(label)}
                  />
                </Localized>
              );
            })}
          </div>
          {challenge ? (
            <span className="english-only">English Only</span>
          ) : (
            <LanguageSelect value={locale} onChange={setLocale} />
          )}
        </div>
        <div className="content">
          {tabs[selectedTab]({ locale: locale == ALL_LOCALES ? null : locale })}
        </div>
      </div>
    </div>
  );
}
