export const ActionTypes = {
  TOGGLE_CANCEL_MODAL: 'TOGGLE_CANCEL_MODAL',
  TOGGLE_DELETE_MODAL: 'TOGGLE_DELETE_MODAL',
  TOGGLE_SHOW_TEXT: 'TOGGLE_SHOW_TEXT',
  TOGGLE_CREATE_API_KEY_FORM: 'TOGGLE_CREATE_API_KEY_FORM',
  SET_CREATE_API_KEY_RESPONSE: 'SET_CREATE_API_KEY_RESPONSE',
  RESET_API_KEY_DATA: 'RESET_API_KEY_DATA',
  SET_API_KEYS: 'SET_API_KEYS',
  FETCHING_API_KEYS: 'FETCHING_API_KEYS',
  DELETE_API_KEY: 'DELETE_API_KEY',
} as const

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes]

export type CreateAPIKeyResponse = {
  userId: string
  clientId: string
  clientSecret: string
  description: string
  permissions: string[]
}

export type ApiKey = {
  userId: string
  clientId: string
  description: string
  createdAt: string
}

export type ApiCredentialsState = {
  isFetchingApiKeys: boolean
  showCancelConfirmationModal: boolean
  showDeleteConfirmationModal: boolean
  showText: boolean
  showCreateApiKeyForm: boolean
  createApiKeyResponse: CreateAPIKeyResponse | null
  apiKeys: ApiKey[]
}

export const actionCreators = {
  toggleCancelModal: (show: boolean) => ({
    type: ActionTypes.TOGGLE_CANCEL_MODAL,
    payload: show,
  }),
  toggleDeleteModal: (show: boolean) => ({
    type: ActionTypes.TOGGLE_DELETE_MODAL,
    payload: show,
  }),
  toggleShowText: (show: boolean) => ({
    type: ActionTypes.TOGGLE_SHOW_TEXT,
    payload: show,
  }),
  toggleCreateApiKey: (show: boolean) => ({
    type: ActionTypes.TOGGLE_CREATE_API_KEY_FORM,
    payload: show,
  }),
  setCreateApiKeyResponse: (data: CreateAPIKeyResponse) => ({
    type: ActionTypes.SET_CREATE_API_KEY_RESPONSE,
    payload: data,
  }),
  resetApiKeyData: () => ({
    type: ActionTypes.RESET_API_KEY_DATA,
  }),
  setApiKeys: (
    apiKeys: ApiKey[]
  ): { type: 'SET_API_KEYS'; payload: ApiKey[] } => ({
    type: ActionTypes.SET_API_KEYS,
    payload: apiKeys,
  }),
  setFetchingApiKeys: (isFetching: boolean) => ({
    type: ActionTypes.FETCHING_API_KEYS,
    payload: isFetching,
  }),
  deleteApiKey: (clientID: string) => ({
    type: ActionTypes.DELETE_API_KEY,
    payload: clientID,
  }),
}

type ToggleCancelModal = ReturnType<typeof actionCreators.toggleCancelModal>
type ToggleDeleteModal = ReturnType<typeof actionCreators.toggleDeleteModal>
type ToggleShowText = ReturnType<typeof actionCreators.toggleShowText>
type ToggleCreateApiKey = ReturnType<typeof actionCreators.toggleCreateApiKey>
type SetCreateApiKeyResponse = ReturnType<
  typeof actionCreators.setCreateApiKeyResponse
>
type ResetApiKeyData = ReturnType<typeof actionCreators.resetApiKeyData>
type SetApiKeys = ReturnType<typeof actionCreators.setApiKeys>
type FetchingApiKeys = ReturnType<typeof actionCreators.setFetchingApiKeys>
type DeleteApiKey = ReturnType<typeof actionCreators.deleteApiKey>

type ApiCredentialsAction =
  | ToggleCancelModal
  | ToggleDeleteModal
  | ToggleShowText
  | ToggleCreateApiKey
  | SetCreateApiKeyResponse
  | ResetApiKeyData
  | SetApiKeys
  | FetchingApiKeys
  | DeleteApiKey

export function apiCredentialsReducer(
  state: ApiCredentialsState,
  action: ApiCredentialsAction
): ApiCredentialsState {
  switch (action.type) {
    case ActionTypes.TOGGLE_CANCEL_MODAL:
      return { ...state, showCancelConfirmationModal: action.payload }
    case ActionTypes.TOGGLE_DELETE_MODAL:
      return { ...state, showDeleteConfirmationModal: action.payload }
    case ActionTypes.TOGGLE_SHOW_TEXT:
      return { ...state, showText: action.payload }
    case ActionTypes.TOGGLE_CREATE_API_KEY_FORM:
      return { ...state, showCreateApiKeyForm: action.payload }
    case ActionTypes.SET_CREATE_API_KEY_RESPONSE:
      return { ...state, createApiKeyResponse: action.payload }
    case ActionTypes.RESET_API_KEY_DATA:
      return { ...state, createApiKeyResponse: null }
    case ActionTypes.SET_API_KEYS:
      return { ...state, apiKeys: action.payload, isFetchingApiKeys: false }
    case ActionTypes.FETCHING_API_KEYS:
      return { ...state, isFetchingApiKeys: action.payload }
    case ActionTypes.DELETE_API_KEY:
      return {
        ...state,
        apiKeys: state.apiKeys.filter(key => key.clientId !== action.payload),
        showDeleteConfirmationModal: false,
      }
    default:
      return state
  }
}
