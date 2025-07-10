import { useReducer } from 'react'

import {
  apiCredentialsReducer,
  ApiCredentialsState,
  actionCreators,
  CreateAPIKeyResponse,
  ApiKey,
} from './api-credentials.reducer'
import { useAction, useAPI } from '../../../../hooks/store-hooks'
import { Notifications } from '../../../../stores/notifications'
import { useLocalization } from '@fluent/react'

const initialState: ApiCredentialsState = {
  isFetchingApiKeys: false,
  showCancelConfirmationModal: false,
  showDeleteConfirmationModal: false,
  showText: false,
  showCreateApiKeyForm: false,
  createApiKeyResponse: null,
  apiKeys: [],
}

export const useApiCredentials = () => {
  const [state, apiCredentialsDispatch] = useReducer(
    apiCredentialsReducer,
    initialState
  )

  const api = useAPI()
  const addNotification = useAction(Notifications.actions.addPill)
  const { l10n } = useLocalization()

  const fetchApiKeys = async () => {
    try {
      apiCredentialsDispatch(actionCreators.setFetchingApiKeys(true))

      const response = await api.getAPICredentials()
      apiCredentialsDispatch(actionCreators.setApiKeys(response as ApiKey[]))
    } catch (error) {
      apiCredentialsDispatch(actionCreators.setApiKeys([]))

      addNotification(
        l10n.getString('fetching-api-keys-error-toast-message'),
        'error'
      )
    }
  }

  const toggleShowText = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleShowText(show))
  }

  const toggleCreateApiKeyForm = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleCreateApiKey(show))
  }

  const toggleCancelConfirmationModal = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleCancelModal(show))
  }

  const toggleDeleteConfirmationModal = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleDeleteModal(show))
  }

  const setCreateApiKeyData = (data: CreateAPIKeyResponse) => {
    apiCredentialsDispatch(actionCreators.setCreateApiKeyResponse(data))
  }

  const onCreateApiKey = async (description: string) => {
    try {
      const response = await api.createAPICredentials(description)
      apiCredentialsDispatch(actionCreators.setCreateApiKeyResponse(response))

      // fetch the updated API keys after creating a new one
      fetchApiKeys()
    } catch (error) {
      addNotification(
        l10n.getString('create-api-key-error-toast-message'),
        'error'
      )
    }
  }

  return {
    state,
    fetchApiKeys,
    toggleShowText,
    toggleCreateApiKeyForm,
    toggleCancelConfirmationModal,
    toggleDeleteConfirmationModal,
    setCreateApiKeyData,
    onCreateApiKey,
  }
}
