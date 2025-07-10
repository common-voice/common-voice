import React from 'react'

import { Localized } from '@fluent/react'
import { Button, LabeledInput } from '../../../../ui/ui'
import { InfoIcon, PlusCircleIcon } from '../../../../ui/icons'

type Props = {
  handleCreateApiKey: (desription: string) => void
}

export const CreateApiKey = ({ handleCreateApiKey }: Props) => {
  const [apiKeyName, setApiKeyName] = React.useState('')

  return (
    <div className="create-api-key-container">
      <Localized id="api-key-name-input" attrs={{ label: true }}>
        <LabeledInput
          value={apiKeyName}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setApiKeyName(evt.target.value)
          }
        />
      </Localized>

      <div className="api-key-info-section">
        <div>
          <InfoIcon />
        </div>

        <div>
          <Localized id="create-api-key-header" elems={{ bold: <strong /> }}>
            <p className="header" />
          </Localized>
          <Localized id="create-api-key-description">
            <p className="description" />
          </Localized>

          <Button
            className="generate-api-key-button"
            onClick={() => handleCreateApiKey(apiKeyName)}>
            <PlusCircleIcon />
            <Localized id="generate-api-key-button">
              <span />
            </Localized>
          </Button>
        </div>
      </div>
    </div>
  )
}
