import React, { useState } from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { TextButton } from '../../../../../ui/ui'
import { ChevronDown } from '../../../../../ui/icons'

type Props = {
  title: string
}

export const SmallBatchRules = ({ title }: Props) => {
  const [rulesVisible, setRulesVisible] = useState(true)

  const handleClick = () => {
    setRulesVisible(!rulesVisible)
  }

  return (
    <div className="small-batch-rules">
      <div className="rules-title-container">
        <div className="icon-and-title small-batch">
          <ChevronDown
            className={classNames('chevron', { 'rotate-180': rulesVisible })}
            onClick={handleClick}
          />
          <Localized id={title}>
            <TextButton onClick={handleClick} className="small-batch" />
          </Localized>
        </div>
      </div>

      {rulesVisible && (
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
