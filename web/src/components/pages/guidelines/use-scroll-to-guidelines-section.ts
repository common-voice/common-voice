import * as React from 'react'
import { VOICE_NAV_IDS } from './constants'

const useScrollToGuidelinesSection = () => {
  const { hash } = window.location
  const id = hash.replace('#', '')

  const [, tab] = location.search.split('tab=')

  const defaultVoiceOption = VOICE_NAV_IDS.PRONUNCIATIONS

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const [selectedTabOption, setSelectedTabOption] =
    React.useState(defaultVoiceOption)

  React.useEffect(() => {
    if (tab && tab === 'sentence') {
      setSelectedTabIndex(1)
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
