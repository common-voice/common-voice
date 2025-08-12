import { useReducer } from 'react'
import { useLocalization } from '@fluent/react'

import {
  apiCredentialsReducer,
  ApiCredentialsState,
  actionCreators,
  CreateAPICredentialsResponse,
  ApiCredentials,
} from './api-credentials.reducer'
import { useAction, useAPI } from '../../../../hooks/store-hooks'
import { Notifications } from '../../../../stores/notifications'
import { AlertIcon } from '../../../ui/icons'

const initialState: ApiCredentialsState = {
  isFetchingApiCredentials: false,
  showCancelConfirmationModal: false,
  showDeleteConfirmationModal: false,
  showCreateApiCredentalsForm: false,
  createApiCredentialsResponse: null,
  apiCredentials: [],
}

const SHOW_NOTIFICATION_BOLD_TEXT = true
const TOO_MANY_CREDENTIALS_ERROR = 'too many credentials'

export const useApiCredentials = () => {
  const [state, apiCredentialsDispatch] = useReducer(
    apiCredentialsReducer,
    initialState
  )

  const api = useAPI()
  const addNotification = useAction(Notifications.actions.addPill)
  const { l10n } = useLocalization()

  const fetchApiCredentials = async () => {
    try {
      apiCredentialsDispatch(actionCreators.setFetchingApiCredentials(true))

      const response = await api.getAPICredentials()
      apiCredentialsDispatch(
        actionCreators.setApiCredentials(response as ApiCredentials[])
      )
    } catch (error) {
      apiCredentialsDispatch(actionCreators.setApiCredentials([]))

      addNotification(
        l10n.getString('fetching-api-keys-error-toast-message'),
        'error',
        AlertIcon,
        SHOW_NOTIFICATION_BOLD_TEXT
      )
    }
  }

  const toggleCreateApiCredentialsForm = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleCreateApiCredentialsForm(show))
  }

  const toggleCancelConfirmationModal = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleCancelModal(show))
  }

  const toggleDeleteConfirmationModal = (show: boolean) => {
    apiCredentialsDispatch(actionCreators.toggleDeleteModal(show))
  }

  const setCreateApiCredentialsData = (data: CreateAPICredentialsResponse) => {
    apiCredentialsDispatch(actionCreators.setCreateApiCredentialsResponse(data))
  }

  const onCreateApiCredentials = async (description: string) => {
    if (!description) {
      addNotification(
        l10n.getString('add-api-key-name-error'),
        'error',
        AlertIcon,
        SHOW_NOTIFICATION_BOLD_TEXT
      )
      return
    }

    if (
      state.apiCredentials.some(
        credential => credential.description === description
      )
    ) {
      addNotification(
        l10n.getString('duplicate-api-key-name-error'),
        'error',
        AlertIcon,
        SHOW_NOTIFICATION_BOLD_TEXT
      )
      return
    }

    try {
      const response = await api.createAPICredentials(description)
      apiCredentialsDispatch(
        actionCreators.setCreateApiCredentialsResponse(response)
      )

      // fetch the updated API keys after creating a new one
      fetchApiCredentials()
    } catch (error) {
      if (error.message.includes(TOO_MANY_CREDENTIALS_ERROR)) {
        addNotification(
          l10n.getString('max-api-keys-reached'),
          'error',
          AlertIcon,
          SHOW_NOTIFICATION_BOLD_TEXT
        )
      } else {
        addNotification(
          l10n.getString('create-api-key-error-toast-message'),
          'error',
          AlertIcon,
          SHOW_NOTIFICATION_BOLD_TEXT
        )
      }
    }
  }

  const deleteAPICredentials = async (clientID: string) => {
    try {
      await api.deleteAPICredentials(clientID)
      apiCredentialsDispatch(actionCreators.deleteApiCredentials(clientID))
      addNotification(
        l10n.getString('delete-api-key-success-toast-message'),
        'success'
      )
    } catch (error) {
      addNotification(
        l10n.getString('delete-api-key-error-toast-message'),
        'error',
        AlertIcon,
        SHOW_NOTIFICATION_BOLD_TEXT
      )
    } finally {
      toggleDeleteConfirmationModal(false)
    }
  }

  return {
    state,
    fetchApiCredentials,
    toggleCreateApiCredentialsForm,
    toggleCancelConfirmationModal,
    toggleDeleteConfirmationModal,
    setCreateApiCredentialsData,
    onCreateApiCredentials,
    deleteAPICredentials,
  }
}
