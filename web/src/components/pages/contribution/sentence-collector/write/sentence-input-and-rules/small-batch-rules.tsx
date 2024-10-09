import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { TextButton } from '../../../../../ui/ui'
import { ChevronDown } from '../../../../../ui/icons'

type Props = {
  title: string
  onToggle: (section: 'single' | 'smallBatch') => void
  isVisible: boolean
}

export const SmallBatchRules = ({ title, onToggle, isVisible }: Props) => {
  const handleClick = () => {
    onToggle('smallBatch')
  }

  return (
    <div className="small-batch-rules">
      <div className="rules-title-container">
        <div className="icon-and-title small-batch">
          <ChevronDown
            className={classNames('chevron', { 'rotate-180': isVisible })}
            onClick={handleClick}
          />
          <Localized id={title}>
            <TextButton onClick={handleClick} className="small-batch" />
          </Localized>
        </div>
      </div>

      {isVisible && (
        <ul>
          <Localized id="small-batch-sentences-rule-1">
            <li />
          </Localized>
          <Localized id="small-batch-sentences-rule-2">
            <li />
          </Localized>
          <Localized id="small-batch-sentences-rule-3">
            <li />
          </Localized>
          <Localized id="small-batch-sentences-rule-4">
            <li />
          </Localized>
          <Localized id="small-batch-sentences-rule-5">
            <li />
          </Localized>
          <Localized id="small-batch-sentences-rule-6">
            <li />
          </Localized>
        </ul>
      )}
    </div>
  )
}
