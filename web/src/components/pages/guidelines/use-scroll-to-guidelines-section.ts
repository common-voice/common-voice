import * as React from 'react'
import {
  SENTENCE_NAV_IDS,
  VOICE_NAV_IDS,
  COLLECTING_QUESTIONS,
} from './constants'

const getDefaultTabOption = ({ tab }: { tab: string }) => {
  if (tab === 'voice') {
    return VOICE_NAV_IDS.PRONUNCIATIONS
  } else if (tab === 'sentence') {
    return SENTENCE_NAV_IDS.PUBLIC_DOMAIN
  } else if (tab === 'question') {
    return COLLECTING_QUESTIONS
  }

  return VOICE_NAV_IDS.PRONUNCIATIONS
}

const useScrollToGuidelinesSection = () => {
  const { hash } = window.location
  const id = hash.replace('#', '')

  const [, tab] = location.search.split('tab=')

  const defaultTabOption = getDefaultTabOption({ tab })

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [selectedTabOption, setSelectedTabOption] =
    React.useState(defaultTabOption)

  React.useEffect(() => {
    if (!tab) {
      setSelectedTabIndex(0)
    }

    if (tab && tab === 'sentence') {
      setSelectedTabIndex(1)
    }

    if (tab && tab === 'question') {
      setSelectedTabIndex(2)
    }

    if (hash) {
      const element = document.getElementById(id)

      if (element) {
        setSelectedTabOption(id)
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, [selectedTabIndex])

  return {
    selectedTabIndex,
    setSelectedTabIndex,
    selectedTabOption,
    setSelectedTabOption,
  }
}

export default useScrollToGuidelinesSection
