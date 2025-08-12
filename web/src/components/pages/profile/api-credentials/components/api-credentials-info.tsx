import React from 'react'
import { Localized, useLocalization } from '@fluent/react'

import ApiKeyDisplay from './api-credential-display'
import { InfoIcon } from '../../../../ui/icons'

type Props = {
  description: string
  apiClientID: string
  apiClientSecret: string
}

export const ApiCredentialsInfo = ({
  description,
  apiClientID,
  apiClientSecret,
}: Props) => {
  const { l10n } = useLocalization()
  return (
    <div className="api-key-info">
      <ApiKeyDisplay
        value={description}
        label={l10n.getString('api-key-name-display-label')}
        showButton={false}
      />

      <ApiKeyDisplay
        value={apiClientID}
        label={l10n.getString('api-client-id-display-label')}
        showButton
      />

      <ApiKeyDisplay
        value={apiClientSecret}
        label={l10n.getString('api-client-secret-display-label')}
        showButton
      />

      <div className="api-key-info-section">
        <div>
          <InfoIcon />
        </div>

        <div>
          <Localized id="save-api-key-info" elems={{ bold: <strong /> }}>
            <p className="description" />
          </Localized>
          <Localized
            id="save-api-key-info-description"
            elems={{ bold: <strong /> }}>
            <p className="description" />
          </Localized>
        </div>
      </div>
    </div>
  )
}
