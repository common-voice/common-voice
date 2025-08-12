import * as React from 'react'
import { Localized, WithLocalizationProps } from '@fluent/react'
import classNames from 'classnames'
import { Tooltip } from 'react-tooltip'

import { ContributeMenuItem } from '.'
import { LocaleLink } from '../../../locale-helpers'
import URLS from '../../../../urls'

type Props = {
  item: ContributeMenuItem
  toggleMenu?: () => void
  isLocaleContributable: boolean
} & WithLocalizationProps

const smallTagRegex = /\s*<small>.*?<\/small>/g

export const MenuItemRenderer = ({
  item,
  isLocaleContributable,
  getString,
  toggleMenu,
}: Props) => {
  const {
    internalHref,
    externalHref,
    localizedId,
    icon: Icon,
    menuItemTooltip,
    menuItemAriaLabel,
  } = item
  const isComingSoon = !(internalHref || externalHref)
  const isSpeakOrListenUrl =
    internalHref === URLS.SPEAK || internalHref === URLS.LISTEN

  const renderContent = () => {
    if (!isLocaleContributable && isSpeakOrListenUrl) {
      return (
        <>
          <Icon />
          <Localized
            id={`${localizedId}-coming-soon`}
            elems={{ small: <span /> }}>
            <p className="coming-soon-text" />
          </Localized>
        </>
      )
    }

    if (internalHref) {
      return (
        <LocaleLink
          to={internalHref}
          className="contribute-link"
          onClick={toggleMenu}>
          <Icon />
          <Localized id={localizedId} />
        </LocaleLink>
      )
    }

    if (externalHref) {
      return (
        <a
          href={externalHref}
          target="_blank"
          rel="noreferrer"
          className="contribute-link"
          onClick={toggleMenu}>
          <Icon />
          {getString(localizedId).replace(smallTagRegex, '')}
        </a>
      )
    }
  }

  return (
    <React.Fragment key={localizedId}>
      <li aria-label={getString(menuItemAriaLabel)} id={menuItemTooltip}>
        <div
          className={classNames('content', {
            'coming-soon':
              isComingSoon || (!isLocaleContributable && isSpeakOrListenUrl),
          })}>
          {renderContent()}
        </div>
      </li>
      <div>
        <Tooltip
          anchorSelect={`#${menuItemTooltip}`}
          place="bottom"
          style={{
            width: 'auto',
            maxWidth: '350px',
            position: 'absolute',
          }}
          openEvents={{ mouseover: true }}>
          {getString(menuItemTooltip)}
        </Tooltip>
      </div>
    </React.Fragment>
  )
}
