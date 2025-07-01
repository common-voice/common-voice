import React from 'react'

import { Localized } from '@fluent/react'
import { LabeledInput } from '../../../ui/ui'

type Props = {
  apiKeyName: string
  publicApiKey: string
  secretApiKey: string
}

export const ApiKeyInfo = ({
  apiKeyName,
  publicApiKey,
  secretApiKey,
}: Props) => {
  return (
    <div className="api-key-info">
      <Localized id="api-key-name-input" attrs={{ label: true }}>
        <LabeledInput value={apiKeyName} disabled />
      </Localized>
      <Localized id="api-key-name-input" attrs={{ label: true }}>
        <LabeledInput value={publicApiKey} disabled />
      </Localized>
      <Localized id="api-key-name-input" attrs={{ label: true }}>
        <LabeledInput value={secretApiKey} disabled />
      </Localized>
    </div>
  )
}
