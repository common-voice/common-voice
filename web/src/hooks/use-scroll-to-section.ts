import * as React from 'react'

export const useScrollToSection = () => {
  const { hash } = window.location
  const id = hash.replace('#', '')

  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(id)

      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, [])
}
