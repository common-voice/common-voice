import { Localized } from '@fluent/react'
import * as React from 'react'

import { LinkButton } from '../../../../ui/ui'
import { ArrowRight } from '../../../../ui/icons'
import URLS from '../../../../../urls'

type Props = {
  localizedMessageId: string
}

const ReviewEmptyState = ({ localizedMessageId }: Props) => {
  return (
    <div className="empty-container" data-testid="review-empty-state">
      <div className="error-card no-sentences-available">
        <h1>
          <Localized id={localizedMessageId} />
        </h1>
        <LinkButton rounded blank to={URLS.WRITE}>
          <ArrowRight className="speak-sc-icon" />
          <Localized id="speak-empty-state-cta">
            <span />
          </Localized>
        </LinkButton>
      </div>
    </div>
  )
}

export default ReviewEmptyState
