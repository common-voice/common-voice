import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { TextButton } from '../../../ui/ui'
import {
  SingleContributionIcon,
  BulkContributionIcon,
  SmallBatchContributionIcon,
} from '../../../ui/icons'
import { WriteSubmissionToggleOptions } from './write/write-container'

type Props = {
  onToggle: (option: WriteSubmissionToggleOptions) => void
  activeOption: WriteSubmissionToggleOptions
}

const toggleOptions = ['single', 'small-batch', 'bulk'] as const

const getContributionIcon = ({
  option,
  isActive,
}: {
  option: 'single' | 'small-batch' | 'bulk'
  isActive: boolean
}): JSX.Element => {
  const iconMapping = {
    single: <SingleContributionIcon isActive={isActive} />,
    'small-batch': <SmallBatchContributionIcon isActive={isActive} />,
    bulk: <BulkContributionIcon isActive={isActive} />,
  }

  return iconMapping[option]
}

const SentenceCollectorToggle: React.FC<Props> = ({
  onToggle,
  activeOption,
}) => (
  <div className="sc-toggle-wrapper" data-testid="sc-toggle">
    {toggleOptions.map((option, index) => (
      <React.Fragment key={option}>
        <div
          className={classNames('toggle-option single', {
            active: activeOption === option,
          })}>
          {getContributionIcon({ option, isActive: activeOption === option })}
          <>
            <Localized id={`${option}-sentence-submission`}>
              <TextButton
                className="toggle-option hidden-md-down"
                data-testid={`${option}-option`}
                onClick={() => onToggle(option)}
              />
            </Localized>
            <Localized id={`${option}-sentence`}>
              <TextButton
                className="toggle-option hidden-lg-up"
                onClick={() => onToggle(option)}
              />
            </Localized>
          </>
        </div>
        {index === toggleOptions.length - 1 ? (
          <></>
        ) : (
          <span className="divider" />
        )}
      </React.Fragment>
    ))}
  </div>
)

export default SentenceCollectorToggle
