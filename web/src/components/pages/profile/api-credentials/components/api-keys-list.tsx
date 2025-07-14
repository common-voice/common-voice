import React from 'react'

import { TrashIconRed } from '../../../../ui/icons'

import ApiKeyDisplay from './api-key-display'
import { ApiKey } from '../api-credentials.reducer'

type Props = {
  apiKeys: ApiKey[]
  showDeleteModal: (keyName: string) => void
}

export const ApiKeysList = ({ apiKeys, showDeleteModal }: Props) => {
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
          <ApiKeyDisplay
            showButton
            value={apiKey.clientId}
            label="public-api-key"
            isHiddenDisplayMode
          />
          <ApiKeyDisplay
            value="⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺⏺"
            label="secret-api-key"
            isHiddenDisplayMode
          />
        </div>
      ))}
    </div>
  )
}
