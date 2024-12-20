import { useEffect, useState } from 'react'

export const usePreloadImage = (url: string) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)

    const img = new Image()
    img.src = url
    img.onload = () => setIsLoaded(true)

    return () => {
      document.head.removeChild(link)
    }
  }, [url])

  return isLoaded
}
