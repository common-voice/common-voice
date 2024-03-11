import { AB_TESTING_SPLIT_KEY } from '../constants'

export const useABTestingSplit = () => {
  const abTestingSplit = localStorage.getItem(AB_TESTING_SPLIT_KEY)

  return abTestingSplit
}
