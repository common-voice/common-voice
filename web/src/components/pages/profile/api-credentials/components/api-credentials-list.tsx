import React from 'react'

import { FullCircleIcon, TrashIconRed } from '../../../../ui/icons'

import ApiCredentialDisplay from './api-credential-display'
import { ApiCredentials } from '../api-credentials.reducer'

type Props = {
  apiKeys: ApiCredentials[]
  showDeleteModal: (keyName: string) => void
}

export const ApiCredentialsList = ({ apiKeys, showDeleteModal }: Props) => {
  return (
    <div className="api-keys-list-container">
      {apiKeys.map(apiKey => (
        <div key={apiKey.userId} className="api-key-item-header">
          <div className="api-key-header">
            <p className="api-keyname">{apiKey.description}</p>
            <button onClick={() => showDeleteModal(apiKey.clientId)}>
              <TrashIconRed />
            </button>
          </div>
          <ApiCredentialDisplay
            showButton
            value={apiKey.clientId}
            label="api-client-id-display-label"
            isHiddenDisplayMode
          />
          <ApiCredentialDisplay
            value={Array.from({ length: 20 }, (_, i) => i + 1).map(el => (
              <FullCircleIcon key={el} />
            ))}
            label="api-client-secret-display-label"
            isHiddenDisplayMode
          />
        </div>
      ))}
    </div>
  )
}
