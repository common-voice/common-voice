import { Localized } from '@fluent/react'
import React from 'react'
import classNames from 'classnames'

import { TextButton } from '../../../ui/ui'
import {
  SingleContributionIcon,
  BulkContributionIcon,
} from '../../../../components/ui/icons'
import { WriteSubmissionToggleOptions } from './write/write-container'

type Props = {
  singleOptionId: string
  bulkOptionId: string
  onToggle: (option: WriteSubmissionToggleOptions) => void
  activeOption: WriteSubmissionToggleOptions
}

const SentenceCollectorToggle: React.FC<Props> = ({
  singleOptionId,
  bulkOptionId,
  onToggle,
  activeOption,
}) => (
  <div className="sc-toggle-wrapper">
    <div
      className={classNames('toggle-option', {
        active: activeOption === 'single',
      })}>
      <SingleContributionIcon isActive={activeOption === 'single'} />
      <Localized id={singleOptionId}>
        <TextButton
          className="single-option"
          onClick={() => onToggle('single')}
        />
      </Localized>
    </div>
    <span className="divider" />
    <div
      className={classNames('toggle-option', {
        active: activeOption === 'bulk',
      })}>
      <BulkContributionIcon isActive={activeOption === 'bulk'} />
      <Localized id={bulkOptionId}>
        <TextButton className="bulk-option" onClick={() => onToggle('bulk')} />
      </Localized>
    </div>
  </div>
)

export default SentenceCollectorToggle
