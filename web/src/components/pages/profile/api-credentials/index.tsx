import React from 'react'
import { Localized } from '@fluent/react'

import { Button } from '../../../ui/ui'
import {
  ChevronDown,
  ChevronRight,
  PlusCircleIcon,
  TrashIcon,
  XCircleIcon,
} from '../../../ui/icons'
import Modal from '../../../modal/modal'

import { NoApiKeys } from './components/no-api-keys'
import { CreateApiKey } from './components/create-api-key'
import { ApiKeyInfo } from './components/api-key-info'
import { ApiKeysList } from './components/api-keys-list'

import './api-credentials.css'

const mockApiKeyData = [
  { label: 'api-key-name-display-label', value: 'My First CV API Key' },
  { label: 'public-api-key', value: 'C0mm0nV0ice-1234-5678-9abc-def0GHIJklmn' },
  { label: 'secret-api-key', value: 'C0mm0nV0ice-1234-5678-9abc-def0GHIJklmn' },
]

const mockApiKeys = [
  {
    keyName: 'My first key',
    publicKey: 'jeunioeonv',
    secretKey: 'jeguu76894kn jvej7890',
  },
  {
    keyName: 'My second key',
    publicKey: 'jeuiouenv',
    secretKey: 'jeguu76894kn jvej7890',
  },
]

export const ApiCredentials = () => {
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] =
    React.useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    React.useState(false)
  const [showText, setShowText] = React.useState(false)
  const [showCreateApiKey, setShowCreateApiKey] = React.useState(false)
  const [apiKeyData, setApiKeyData] = React.useState([])
  const [apiKeys] = React.useState(mockApiKeys)

  const noAPIKeys = apiKeys.length === 0 && !showCreateApiKey

  const handleCreateApiKey = () => {
    setApiKeyData(mockApiKeyData)
  }

  const handleDeleteApiKey = (keyName: string) => {
    setShowDeleteConfirmationModal(true)
    console.log(`Delete API Key: ${keyName}`)
  }

  return (
    <div className="api-credentials-container">
      <section className="api-credentials-description">
        <Localized id="api-credentials">
          <h2 />
        </Localized>
        <Localized id="api-credentials-description-1">
          <span className="api-credentials-description-1" />
        </Localized>

        {!showText && (
          <button
            className="show-wall-of-text hidden-md-up"
            onClick={() => setShowText(!showText)}>
            <Localized id="show-wall-of-text">
              <span />
            </Localized>
            <ChevronRight />
          </button>
        )}

        <Localized id="api-credentials-description-2">
          <span className="hidden-sm-down" />
        </Localized>

        {showText && (
          <Localized id="api-credentials-description-2">
            <span className="api-credentials-description-2-sm" />
          </Localized>
        )}

        {showText && (
          <button
            className="hidden-md-up"
            onClick={() => setShowText(!showText)}>
            <Localized id="close">
              <span />
            </Localized>
            <ChevronDown style={{ marginInlineStart: '4px', scale: '0.6' }} />
          </button>
        )}
      </section>

      <section className="api-keys">
        <div className="api-keys-header">
          <Localized id="api-credentials-keys">
            <h2 />
          </Localized>

          {!showCreateApiKey ? (
            <Button
              className="create-api-key-button"
              rounded
              onClick={() => setShowCreateApiKey(true)}>
              <PlusCircleIcon />
              <Localized id="create-api-key-button">
                <span />
              </Localized>
            </Button>
          ) : (
            <Button
              className="cancel-api-key-button"
              rounded
              onClick={() => {
                if (!apiKeyData.length) {
                  setShowCancelConfirmationModal(true)
                } else {
                  setShowCreateApiKey(false)
                  setApiKeyData([])
                }
              }}>
              <XCircleIcon />
              <Localized id="cancel">
                <span />
              </Localized>
            </Button>
          )}
        </div>

        <div className="api-keys-box">
          <Localized id="your-api-keys">
            <h3 />
          </Localized>
        </div>
        <div className="api-keys-content">
          {noAPIKeys && <NoApiKeys />}
          {showCreateApiKey && apiKeyData.length === 0 && (
            <CreateApiKey handleCreateApiKey={handleCreateApiKey} />
          )}
          {apiKeyData.length > 0 && <ApiKeyInfo apiKeyData={mockApiKeyData} />}
          {
            <ApiKeysList
              apiKeys={apiKeys}
              onDeleteApiKey={handleDeleteApiKey}
            />
          }
        </div>
      </section>

      {showCancelConfirmationModal && (
        <Modal
          onRequestClose={() => setShowCancelConfirmationModal(false)}
          innerClassName="api-modal">
          <div className="api-modal-content">
            <XCircleIcon />
            <Localized id="api-key-modal-confirmation-header">
              <h3 />
            </Localized>

            <Localized id="cancel-api-key-confirmation-description">
              <p />
            </Localized>

            <Button
              onClick={() => {
                setShowCreateApiKey(false)
                setShowCancelConfirmationModal(false)
              }}
              rounded
              isBig>
              <Localized id="cancel">
                <span />
              </Localized>
            </Button>
          </div>
        </Modal>
      )}

      {showDeleteConfirmationModal && (
        <Modal
          onRequestClose={() => setShowDeleteConfirmationModal(false)}
          innerClassName="api-modal">
          <div className="api-modal-content">
            <TrashIcon />
            <Localized id="api-key-modal-confirmation-header">
              <h3 />
            </Localized>

            <Localized id="delete-api-key-confirmation-description">
              <p />
            </Localized>

            <Button
              onClick={() => {
                setShowDeleteConfirmationModal(false)
                // TODO: call function to delete api key
                console.log('API Key deleted')
              }}
              rounded
              isBig>
              <Localized id="delete">
                <span />
              </Localized>
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
