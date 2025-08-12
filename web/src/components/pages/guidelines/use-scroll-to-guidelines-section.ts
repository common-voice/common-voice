import * as React from 'react'

import { VOICE_NAV_IDS } from './constants'

const getDefaultTabOption = ({ tab }: { tab: string }) => {
  if (tab === 'scripted-speech') {
    return 'voice-collection'
  } else if (tab === 'spontaneous-speech') {
    return 'question-collection'
  }

  return 'voice-collection'
}

const useScrollToGuidelinesSection = () => {
  const { hash } = window.location
  const id = hash.replace('#', '')

  const [, tab] = location.search.split('tab=')

  const defaultTabOption = getDefaultTabOption({ tab })

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [selectedTabOption, setSelectedTabOption] =
    React.useState(defaultTabOption)
  const [selectedSection, setSelectedSection] = React.useState(
    id || VOICE_NAV_IDS.PRONUNCIATIONS
  )

  const scrollToElement = React.useCallback(
    (elementId: string, retries = 5) => {
      const element = document.getElementById(elementId)

      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
        return true
      }

      if (retries > 0) {
        setTimeout(() => scrollToElement(elementId, retries - 1), 100)
      } else {
        console.warn(`Element with id "${elementId}" not found after retries`)
      }

      return false
    },
    []
  )

  React.useEffect(() => {
    if (!tab) {
      setSelectedTabIndex(0)
    } else if (tab === 'spontaneous-speech') {
      setSelectedTabIndex(1)
    } else if (tab === 'scripted-speech') {
      setSelectedTabIndex(0)
    }
  }, [tab])

  React.useEffect(() => {
    if (hash && id) {
      setTimeout(() => {
        scrollToElement(id)
      }, 50)
    }
  }, [selectedTabIndex, hash, id, scrollToElement])

  return {
    selectedTabIndex,
    setSelectedTabIndex,
    selectedTabOption,
    setSelectedTabOption,
    selectedSection,
    setSelectedSection,
  }
}

export default useScrollToGuidelinesSection
