import { getClientCredentials } from '../../../infrastructure/authentication/authentication'
import { GetClientCredentialsQuery } from './query/getClientCredentialsQuery'

export const getClientCredentialsQueryHandler = async (
  query: GetClientCredentialsQuery
) => {
  return getClientCredentials(query)
}
