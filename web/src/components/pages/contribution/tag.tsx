import * as React from 'react'
import { Tooltip } from 'react-tippy'

import { DropdownArrowIcon } from '../../ui/icons'

import './tag.css'

export const Tag = () => (
  <div className="tag-container">
    <Tooltip
      trigger="click"
      html={<div>Tooltip content Rotimi</div>}
      style={{ display: 'inherit', gap: '8px' }}
      position="bottom"
      theme="light"
      arrow>
      <p className="tag-text">Mexican</p>
      <DropdownArrowIcon className="dropdown-arrow" />
    </Tooltip>
  </div>
)
