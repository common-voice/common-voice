import * as React from 'react'
import { useLocalization } from '@fluent/react'
import classNames from 'classnames'

import URLS from '../../urls'
import { useNativeNameAvailableLocales } from '../locale-helpers'
import { LinkButton } from '../ui/ui'
import { ChatBubblePlusGreyIcon, GlobeBlackIcon } from '../ui/icons'
import Dropdown from '../dropdown'

import './language-select.css'

const RequestNewLanguageLink = () => {
  const { l10n } = useLocalization()
  return (
    <LinkButton
      rounded
      blank
      to={URLS.LANGUAGE_REQUEST}
      data-testid="request-language-contribution-picker">
      <ChatBubblePlusGreyIcon />
      {l10n.getString('request-new-language')}
    </LinkButton>
  )
}

interface Props {
  locale?: string
  userLanguages?: string[]
  isMobile?: boolean
  onLocaleChange?: (props: string) => void
}

const LanguageSelect = ({
  locale,
  userLanguages,
  isMobile = false,
  onLocaleChange,
}: Props) => {
  const getAvailableLocalesWithNames = () => {
    const initialAvailableLocalesWithNames = useNativeNameAvailableLocales()
    // Get user languages to top of the list
    if (userLanguages) {
      const userLanguagesWithNames = userLanguages.map(lang =>
        initialAvailableLocalesWithNames.find(({ code }) => code === lang)
      )

      return userLanguagesWithNames.concat(
        initialAvailableLocalesWithNames.filter(
          item => !userLanguages.includes(item.code)
        )
      )
    }

    return initialAvailableLocalesWithNames
  }

  const { l10n } = useLocalization()
  const availableLocalesWithNames = getAvailableLocalesWithNames()
  const items = availableLocalesWithNames.map(locale => locale.code)

  // don't show select if we dont have multiple locales
  if (items.length <= 1) {
    return null
  }

  return (
    <div
      className={classNames('language-select-container', {
        'is-mobile': isMobile,
      })}>
      <Dropdown
        options={items}
        currentValue={locale}
        buttonIcon={<GlobeBlackIcon viewBox="0 0 15 14" />}
        searchBoxLabel={l10n.getString('dataset-searchbox-label')}
        searchBoxPlaceholder={l10n.getString('dataset-searchbox-placeholder')}
        searchBoxAriaLabel={l10n.getString('dataset-searchbox-aria-label')}
        notFoundMessage={l10n.getString('dataset-search-no-results')}
        bottomComponent={<RequestNewLanguageLink />}
        isMobile={isMobile}
        onChange={onLocaleChange}
      />
    </div>
  )
}

export default LanguageSelect
