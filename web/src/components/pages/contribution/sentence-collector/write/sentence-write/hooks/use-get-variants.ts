import { useEffect, useState } from 'react'

import { useAPI } from '../../../../../../../hooks/store-hooks'
import { useLocale } from '../../../../../../locale-helpers'

import { VariantsAll } from '../../../../../profile/info/languages/languages'

export const useGetVariants = () => {
  const [variantsAll, setVariantsAll] = useState<VariantsAll>({})
  const [variantsLoading, setVariantsLoading] = useState(true)

  const api = useAPI()
  const [locale] = useLocale()

  const getVariants = async () => {
    try {
      const variants = await api.getVariants(locale)
      setVariantsAll(variants)
    } finally {
      setVariantsLoading(false)
    }
  }

  useEffect(() => {
    getVariants()
  }, [])

  return {
    variants: variantsAll[locale],
    variantsLoading,
  }
}
