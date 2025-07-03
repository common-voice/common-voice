import React from 'react'
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import classNames from 'classnames'

import { Button } from '../../../../ui/ui'
import { CopyIcon } from '../../../../ui/icons'
import useCopyToClipboard from '../../../../../hooks/use-copy-to-clipboard'

type Props = {
  apiKey: string
  label: string
  showButton?: boolean
  isHiddenDisplayMode?: boolean
} & WithLocalizationProps

const ApiKeyDisplay = ({
  apiKey,
  label,
  showButton,
  isHiddenDisplayMode,
  getString,
}: Props) => {
  const [, copy] = useCopyToClipboard(getString)

  return (
    <div className="api-key-display-wrapper">
      <span className="api-key-label">{getString(label)}</span>

      <div
        className={classNames('api-key-container', {
          'hidden-display-mode': isHiddenDisplayMode,
        })}>
        <span className="api-key-text">{apiKey}</span>
        {showButton && (
          <Button className="copy-api-key-button" onClick={() => copy(apiKey)}>
            <CopyIcon />
            <Localized id="copy">
              <span />
            </Localized>
          </Button>
        )}
      </div>
    </div>
  )
}

export default withLocalization(ApiKeyDisplay)
