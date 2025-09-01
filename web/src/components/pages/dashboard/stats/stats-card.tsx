import { Localized } from '@fluent/react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import LanguageSelect, {
  ALL_LOCALES,
} from '../../../language-select/language-select'
import { useLocalStorageState } from '../../../../hooks/store-hooks'

import './stats-card.css'

const DEFAULT_LOCALE_OPTION = ALL_LOCALES

export default function StatsCard({
  id,
  className,
  title,
  iconButtons,
  overlay,
  tabs,
  challenge,
  scrollable,
  currentLocale,
}: {
  id?: string
  className?: string
  title: string
  iconButtons?: React.ReactNode
  overlay?: React.ReactNode
  tabs?: { [label: string]: (props: { locale?: string }) => any } // eslint-disable-line @typescript-eslint/no-explicit-any
  challenge?: boolean
  scrollable?: boolean
  currentLocale?: string
}) {
  const [locale, setLocale] = useLocalStorageState(
    DEFAULT_LOCALE_OPTION,
    `${id}${currentLocale}`
  )
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0])
  const isDefaultOptionSelected = locale === DEFAULT_LOCALE_OPTION

  // handle when changing language tab towards top of page
  useEffect(() => {
    if (currentLocale) {
      setLocale(currentLocale)
    }
  }, [currentLocale])

  return (
    <div
      className={`stats-card ${className || ''} ${
        scrollable ? 'scrollable' : ''
      }`}>
      {overlay}
      <div className="stats-card__inner">
        <div className="title-and-icon">
          {challenge ? (
            <h2 className="challenge-title">{title}</h2>
          ) : (
            <Localized id={title}>
              {/* Localized injects content into child component */}
              {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
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
              )
            })}
          </div>
          {challenge ? (
            <span className="english-only">English Only</span>
          ) : (
            <LanguageSelect value={locale} onChange={setLocale} />
          )}
        </div>
        <div className="content">
          {(() => {
            const TabComponent = tabs[selectedTab]
            return (
              <TabComponent locale={isDefaultOptionSelected ? null : locale} />
            )
          })()}{' '}
        </div>
      </div>
    </div>
  )
}
