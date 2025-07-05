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

  React.useEffect(() => {
    if (!tab) {
      setSelectedTabIndex(0)
    }

    if (tab && tab === 'spontaneous-speech') {
      setSelectedTabIndex(1)
    }

    if (tab && tab === 'scripted-speech') {
      setSelectedTabIndex(0)
    }

    if (hash) {
      const element = document.getElementById(id)

      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, [selectedTabIndex])

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
