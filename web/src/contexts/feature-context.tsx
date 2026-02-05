import React, { createContext, useContext, useEffect, useState } from 'react'

import { FEATURES_COOKIE } from 'common'

const API_PATH = location.origin + '/api/v1'

type FeatureMap = Record<string, boolean>
interface FeatureContextType {
  features: FeatureMap
  loaded: boolean
}

const FeatureContext = createContext<FeatureContextType>({
  features: {},
  loaded: false,
})

export const FeatureProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [features, setFeatures] = useState<FeatureMap>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // handle URL search parameters (?feature=xxx&feature=yyy) - can be multiple
    const searchParams = new URLSearchParams(window.location.search)
    const queryFeatures = searchParams.getAll('feature') // handles ?feature=a&feature=b
    // Also check cookie (for fallback after navigation)
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${FEATURES_COOKIE}=`))
    const cookieFeatures = cookie?.split('=')[1]?.split(',') || []

    const merged = new Set([...queryFeatures, ...cookieFeatures])
    const featureMap: FeatureMap = {}

    for (const feature of merged) {
      featureMap[feature] = true
    }
    setFeatures(featureMap)
    setLoaded(true)

    // Ping backend to store features in cookie
    if (queryFeatures.length > 0) {
      const featureParams = queryFeatures
        .map(f => `feature=${encodeURIComponent(f)}`)
        .join('&')
      const pingURL = `${API_PATH}/ping?${featureParams}`
      fetch(pingURL, { credentials: 'include' })
    }
  }, [])

  return (
    <FeatureContext.Provider value={{ features, loaded }}>
      {children}
    </FeatureContext.Provider>
  )
}

export const useFeature = (feature: string): boolean => {
  const { features } = useContext(FeatureContext)
  return !!features[feature]
}

export const useAllFeatures = (): FeatureMap => {
  return useContext(FeatureContext).features
}

export const useFeatureContextLoaded = (): boolean => {
  return useContext(FeatureContext).loaded
}
