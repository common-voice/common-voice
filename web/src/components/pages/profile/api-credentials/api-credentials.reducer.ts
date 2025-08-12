export const ActionTypes = {
  TOGGLE_CANCEL_MODAL: 'TOGGLE_CANCEL_MODAL',
  TOGGLE_DELETE_MODAL: 'TOGGLE_DELETE_MODAL',
  TOGGLE_CREATE_API_CREDENTIALS_FORM: 'TOGGLE_CREATE_API_CREDENTIALS_FORM',
  SET_CREATE_API_CREDENTIALS_RESPONSE: 'SET_CREATE_API_CREDENTIALS_RESPONSE',
  RESET_API_CREDENTIALS_DATA: 'RESET_API_CREDENTIALS_DATA',
  SET_API_CREDENTIALS: 'SET_API_CREDENTIALS',
  FETCHING_API_CREDENTIALS: 'FETCHING_API_CREDENTIALS',
  DELETE_API_CREDENTIALS: 'DELETE_API_CREDENTIALS',
} as const

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes]

export type CreateAPICredentialsResponse = {
  userId: string
  clientId: string
  clientSecret: string
  description: string
  permissions: string[]
}

export type ApiCredentials = {
  userId: string
  clientId: string
  description: string
  createdAt: string
}

export type ApiCredentialsState = {
  isFetchingApiCredentials: boolean
  showCancelConfirmationModal: boolean
  showDeleteConfirmationModal: boolean
  showCreateApiCredentalsForm: boolean
  createApiCredentialsResponse: CreateAPICredentialsResponse | null
  apiCredentials: ApiCredentials[]
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
  toggleCreateApiCredentialsForm: (show: boolean) => ({
    type: ActionTypes.TOGGLE_CREATE_API_CREDENTIALS_FORM,
    payload: show,
  }),
  setCreateApiCredentialsResponse: (data: CreateAPICredentialsResponse) => ({
    type: ActionTypes.SET_CREATE_API_CREDENTIALS_RESPONSE,
    payload: data,
  }),
  resetApiCredentialsData: () => ({
    type: ActionTypes.RESET_API_CREDENTIALS_DATA,
  }),
  setApiCredentials: (
    apiCredentials: ApiCredentials[]
  ): { type: 'SET_API_CREDENTIALS'; payload: ApiCredentials[] } => ({
    type: ActionTypes.SET_API_CREDENTIALS,
    payload: apiCredentials,
  }),
  setFetchingApiCredentials: (isFetching: boolean) => ({
    type: ActionTypes.FETCHING_API_CREDENTIALS,
    payload: isFetching,
  }),
  deleteApiCredentials: (clientID: string) => ({
    type: ActionTypes.DELETE_API_CREDENTIALS,
    payload: clientID,
  }),
}

type ToggleCancelModal = ReturnType<typeof actionCreators.toggleCancelModal>
type ToggleDeleteModal = ReturnType<typeof actionCreators.toggleDeleteModal>
type ToggleCreateApiCredentialsForm = ReturnType<
  typeof actionCreators.toggleCreateApiCredentialsForm
>
type SetCreateApiCredentialsResponse = ReturnType<
  typeof actionCreators.setCreateApiCredentialsResponse
>
type ResetApiCredentialsData = ReturnType<
  typeof actionCreators.resetApiCredentialsData
>
type SetApiCredentials = ReturnType<typeof actionCreators.setApiCredentials>
type FetchingApiCredentials = ReturnType<
  typeof actionCreators.setFetchingApiCredentials
>
type DeleteApiCredentials = ReturnType<
  typeof actionCreators.deleteApiCredentials
>

type ApiCredentialsAction =
  | ToggleCancelModal
  | ToggleDeleteModal
  | ToggleCreateApiCredentialsForm
  | SetCreateApiCredentialsResponse
  | ResetApiCredentialsData
  | SetApiCredentials
  | FetchingApiCredentials
  | DeleteApiCredentials

export function apiCredentialsReducer(
  state: ApiCredentialsState,
  action: ApiCredentialsAction
): ApiCredentialsState {
  switch (action.type) {
    case ActionTypes.TOGGLE_CANCEL_MODAL:
      return { ...state, showCancelConfirmationModal: action.payload }
    case ActionTypes.TOGGLE_DELETE_MODAL:
      return { ...state, showDeleteConfirmationModal: action.payload }
    case ActionTypes.TOGGLE_CREATE_API_CREDENTIALS_FORM:
      return { ...state, showCreateApiCredentalsForm: action.payload }
    case ActionTypes.SET_CREATE_API_CREDENTIALS_RESPONSE:
      return { ...state, createApiCredentialsResponse: action.payload }
    case ActionTypes.RESET_API_CREDENTIALS_DATA:
      return { ...state, createApiCredentialsResponse: null }
    case ActionTypes.SET_API_CREDENTIALS:
      return {
        ...state,
        apiCredentials: action.payload,
        isFetchingApiCredentials: false,
      }
    case ActionTypes.FETCHING_API_CREDENTIALS:
      return { ...state, isFetchingApiCredentials: action.payload }
    case ActionTypes.DELETE_API_CREDENTIALS:
      return {
        ...state,
        apiCredentials: state.apiCredentials.filter(
          credential => credential.clientId !== action.payload
        ),
        showDeleteConfirmationModal: false,
      }
    default:
      return state
  }
}
