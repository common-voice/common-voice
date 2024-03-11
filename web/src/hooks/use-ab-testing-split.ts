import { AB_TESTING_SPLIT_KEY } from '../components/app'

export const useABTestingSplit = () => {
  const abTestingSplit = localStorage.getItem(AB_TESTING_SPLIT_KEY)

  return abTestingSplit
}
