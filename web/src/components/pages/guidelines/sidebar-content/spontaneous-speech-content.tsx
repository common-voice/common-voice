import * as React from 'react'

import useIsMaxWindowWidth from '../../../../hooks/use-is-max-window-width'
import { questionGuidelineSections } from '../constants'
import { handleToggleVisibleSection } from '../utils'

export const SpontaneousSpeechContent = () => {
  const [visibleSections, setVisibleSections] = React.useState(
    questionGuidelineSections
  )

  const isMobileWidth = useIsMaxWindowWidth()

  const onToggleVisibleSection = (id: string) => {
    handleToggleVisibleSection({ id, visibleSections, setVisibleSections })
  }

  return (
    <>
      {visibleSections.map(section => (
        <section.component
          id={section.id}
          key={section.id}
          contentVisible={section.visible}
          toggleVisibleSection={() => onToggleVisibleSection(section.id)}
          isMobileWidth={isMobileWidth}
        />
      ))}
    </>
  )
}
