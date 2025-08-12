import React, { useEffect } from 'react'
import { Localized } from '@fluent/react'

import { Button, Spinner } from '../../../ui/ui'
import { PlusCircleIcon, TrashIcon, XCircleIcon } from '../../../ui/icons'
import Modal from '../../../modal/modal'

import { NoApiCredentials } from './components/no-api-credentials'
import { CreateApiCredentials } from './components/create-api-credentials'
import { ApiCredentialsInfo } from './components/api-credentials-info'
import { ApiCredentialsList } from './components/api-credentials-list'

import { useApiCredentials } from './use-api-credentials'
import { ApiCredentials as ApiCredentialsType } from './api-credentials.reducer'

import './api-credentials.css'

export const ApiCredentials = () => {
  const [apiCredentialToDelete, setApiCredentialToDelete] =
    React.useState<ApiCredentialsType | null>(null)

  const {
    state: {
      apiCredentials,
      createApiCredentialsResponse,
      showCreateApiCredentalsForm,
      showCancelConfirmationModal,
      showDeleteConfirmationModal,
      isFetchingApiCredentials,
    },
    fetchApiCredentials,
    toggleCreateApiCredentialsForm,
    toggleCancelConfirmationModal,
    toggleDeleteConfirmationModal,
    setCreateApiCredentialsData,
    onCreateApiCredentials,
    deleteAPICredentials,
  } = useApiCredentials()

  useEffect(() => {
    fetchApiCredentials()
  }, [])

  const noAPICredentials =
    apiCredentials.length === 0 && !isFetchingApiCredentials
  const shouldShowCreateApiCredentialsForm =
    showCreateApiCredentalsForm && !createApiCredentialsResponse

  const handleCreateApiCredentials = (description: string) => {
    onCreateApiCredentials(description)
  }

  const handleDeleteApiCredentials = (clientID: string) => {
    toggleDeleteConfirmationModal(true)
    const apiCrential = apiCredentials.find(
      credential => credential.clientId === clientID
    )

    if (apiCrential) {
      setApiCredentialToDelete(apiCrential)
    }
  }

  return (
    <div className="api-credentials-container">
      <section className="api-credentials-description-section">
        <Localized id="api-credentials">
          <h2 />
        </Localized>
        <Localized id="api-credentials-description">
          <p className="api-credentials-description" />
        </Localized>

        <ul>
          <Localized id="api-credentials-use-case-1">
            <li />
          </Localized>
          <Localized id="api-credentials-use-case-2">
            <li />
          </Localized>
          <Localized id="api-credentials-use-case-3">
            <li />
          </Localized>
        </ul>

        <Localized id="api-credentials-description-conclusion">
          <p className="api-credentials-description" />
        </Localized>
      </section>

      <section className="api-keys">
        <div className="api-keys-header">
          <Localized id="api-credentials-header">
            <h2 />
          </Localized>

          {!createApiCredentialsResponse &&
            (!showCreateApiCredentalsForm ? (
              <Button
                className="create-api-key-button"
                rounded
                onClick={() => toggleCreateApiCredentialsForm(true)}>
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
                  if (!createApiCredentialsResponse) {
                    toggleCancelConfirmationModal(true)
                  } else {
                    toggleCreateApiCredentialsForm(false)
                    setCreateApiCredentialsData(null)
                  }
                }}>
                <XCircleIcon />
                <Localized id="cancel">
                  <span />
                </Localized>
              </Button>
            ))}
        </div>

        {shouldShowCreateApiCredentialsForm && (
          <CreateApiCredentials
            handleCreateApiKey={handleCreateApiCredentials}
          />
        )}
        {createApiCredentialsResponse && (
          <ApiCredentialsInfo
            description={createApiCredentialsResponse.description}
            apiClientID={createApiCredentialsResponse.clientId}
            apiClientSecret={createApiCredentialsResponse.clientSecret}
          />
        )}

        {isFetchingApiCredentials ? (
          <Spinner isFloating={false} />
        ) : (
          <>
            <div className="api-keys-box">
              <Localized id="your-api-keys">
                <h3 />
              </Localized>
            </div>
            <div className="api-keys-content">
              {noAPICredentials && <NoApiCredentials />}

              {
                <ApiCredentialsList
                  apiKeys={apiCredentials}
                  showDeleteModal={handleDeleteApiCredentials}
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
                toggleCreateApiCredentialsForm(false)
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
              vars={{ apiKeyName: apiCredentialToDelete?.description || '' }}
              elems={{ bold: <strong /> }}>
              <p />
            </Localized>

            <Button
              onClick={() => {
                deleteAPICredentials(apiCredentialToDelete.clientId)
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
