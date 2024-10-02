import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { TextButton } from '../../../ui/ui'
import {
  SingleContributionIcon,
  BulkContributionIcon,
} from '../../../../components/ui/icons'
import { WriteSubmissionToggleOptions } from './write/write-container'

type Props = {
  onToggle: (option: WriteSubmissionToggleOptions) => void
  activeOption: WriteSubmissionToggleOptions
}

const SentenceCollectorToggle: React.FC<Props> = ({
  onToggle,
  activeOption,
}) => (
  <div className="sc-toggle-wrapper" data-testid="sc-toggle">
    <div
      className={classNames('toggle-option single', {
        active: activeOption === 'single',
      })}>
      <SingleContributionIcon isActive={activeOption === 'single'} />
      <>
        <Localized id="single-sentence-submission">
          <TextButton
            className="single-option hidden-md-down"
            data-testid="single-option"
            onClick={() => onToggle('single')}
          />
        </Localized>
        <Localized id="single-sentence">
          <TextButton
            className="single-option hidden-lg-up"
            onClick={() => onToggle('single')}
          />
        </Localized>
      </>
    </div>
    <span className="divider" />
    <div
      className={classNames('toggle-option bulk', {
        active: activeOption === 'bulk',
      })}>
      <BulkContributionIcon isActive={activeOption === 'bulk'} />
      <>
        <Localized id="bulk-sentence-submission">
          <TextButton
            className="bulk-option hidden-md-down"
            data-testid="bulk-option"
            onClick={() => onToggle('bulk')}
          />
        </Localized>
        <Localized id="bulk-sentences">
          <TextButton
            className="bulk-option hidden-lg-up"
            onClick={() => onToggle('bulk')}
          />
        </Localized>
      </>
    </div>
  </div>
)

export default SentenceCollectorToggle
