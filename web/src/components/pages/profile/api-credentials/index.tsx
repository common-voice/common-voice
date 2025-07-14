import React, { useEffect } from 'react'
import { Localized } from '@fluent/react'

import { Button, Spinner } from '../../../ui/ui'
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

import { useApiCredentials } from './use-api-credentials'
import { ApiKey } from './api-credentials.reducer'

import './api-credentials.css'

export const ApiCredentials = () => {
  const [apiKeyToDelete, setApiKeyToDelete] = React.useState<ApiKey | null>(
    null
  )

  const {
    state: {
      apiKeys,
      createApiKeyResponse,
      showCreateApiKeyForm,
      showCancelConfirmationModal,
      showDeleteConfirmationModal,
      showText,
      isFetchingApiKeys,
    },
    fetchApiKeys,
    toggleShowText,
    toggleCreateApiKeyForm,
    toggleCancelConfirmationModal,
    toggleDeleteConfirmationModal,
    setCreateApiKeyData,
    onCreateApiKey,
    deleteAPIKey,
  } = useApiCredentials()

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const noAPIKeys = apiKeys.length === 0 && !isFetchingApiKeys
  const shouldShowCreateApiKeyForm =
    showCreateApiKeyForm && !createApiKeyResponse

  const handleCreateApiKey = (description: string) => {
    onCreateApiKey(description)
  }

  const handleDeleteApiKey = (clientID: string) => {
    toggleDeleteConfirmationModal(true)
    const apiKey = apiKeys.find(key => key.clientId === clientID)

    if (apiKey) {
      setApiKeyToDelete(apiKey)
    }
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
            onClick={() => toggleShowText(!showText)}>
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
            onClick={() => toggleShowText(!showText)}>
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

          {!showCreateApiKeyForm ? (
            <Button
              className="create-api-key-button"
              rounded
              onClick={() => toggleCreateApiKeyForm(true)}>
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
                if (!createApiKeyResponse) {
                  toggleCancelConfirmationModal(true)
                } else {
                  toggleCreateApiKeyForm(false)
                  setCreateApiKeyData(null)
                }
              }}>
              <XCircleIcon />
              <Localized id="cancel">
                <span />
              </Localized>
            </Button>
          )}
        </div>

        {shouldShowCreateApiKeyForm && (
          <CreateApiKey handleCreateApiKey={handleCreateApiKey} />
        )}
        {createApiKeyResponse && (
          <ApiKeyInfo
            description={createApiKeyResponse.description}
            apiClientID={createApiKeyResponse.clientId}
            apiClientSecret={createApiKeyResponse.clientSecret}
          />
        )}

        {isFetchingApiKeys ? (
          <Spinner isFloating={false} />
        ) : (
          <>
            <div className="api-keys-box">
              <Localized id="your-api-keys">
                <h3 />
              </Localized>
            </div>
            <div className="api-keys-content">
              {noAPIKeys && <NoApiKeys />}

              {
                <ApiKeysList
                  apiKeys={apiKeys}
                  showDeleteModal={handleDeleteApiKey}
                />
              }
            </div>
          </>
        )}
      </section>

      {showCancelConfirmationModal && (
        <Modal
          onRequestClose={() => toggleCancelConfirmationModal(false)}
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
                toggleCreateApiKeyForm(false)
                toggleCancelConfirmationModal(false)
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
          onRequestClose={() => toggleDeleteConfirmationModal(false)}
          innerClassName="api-modal">
          <div className="api-modal-content">
            <TrashIcon />
            <Localized id="api-key-modal-confirmation-header">
              <h3 />
            </Localized>

            <Localized
              id="delete-api-key-confirmation-description"
              vars={{ apiKeyName: apiKeyToDelete?.description || '' }}
              elems={{ bold: <strong /> }}>
              <p />
            </Localized>

            <Button
              onClick={() => {
                deleteAPIKey(apiKeyToDelete.clientId)
                toggleDeleteConfirmationModal(false)
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
