import * as React from 'react'
import { Tooltip } from 'react-tippy'
import { useHistory } from 'react-router'
import { useLocalization } from '@fluent/react'

import { DropdownArrowIcon } from '../../ui/icons'

import URLS from '../../../urls'

import './tag.css'

type Props = {
  text: string
}

export const Tag = ({ text }: Props) => {
  const history = useHistory()
  const { l10n } = useLocalization()

  const handleClick = () => {
    history.push(URLS.PROFILE_INFO)
  }

  return (
    <div className="tag-container" data-testid="contribution-tag">
      <Tooltip
        trigger="click"
        html={
          <div className="tooltip-content">
            <button type="button" onClick={handleClick}>
              {l10n.getString('change-preferences')}
            </button>
          </div>
        }
        style={{ display: 'inherit', gap: '8px' }}
        position="bottom-start"
        theme="light"
        arrow
        offset={5}
        distance={20}
        interactive>
        <p className="tag-text">{text}</p>
        <DropdownArrowIcon className="dropdown-arrow" />
      </Tooltip>
    </div>
  )
}
