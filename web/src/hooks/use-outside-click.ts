import * as React from 'react'

export const useOutsideClick = (callback: () => void) => {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref])

  return ref
}
