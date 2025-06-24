import React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { ChevronDown } from '../../../ui/icons'

type Props = {
  id: string
  selectedTabOption: string
  setSelectedTabOption: (option: string) => void
}

export const SidebarNavItem = ({
  id,
  selectedTabOption,
  setSelectedTabOption,
}: Props) => (
  <div>
    <Localized id={id}>
      <button
        className={classNames({
          'active-tab-option': selectedTabOption === id,
        })}
        onClick={() => setSelectedTabOption(id)}
      />
    </Localized>
    <ChevronDown />
  </div>
)
