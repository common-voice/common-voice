// Note: We don't set domain, it is the safest option
export type CookieOptions = {
  days?: number
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export type CookieSettings = {
  name: string // The name of the cookie
  value: string // The value of the cookie
  options: CookieOptions
}

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  days: 30, // Default 30 days expiration
  path: '/', // Default to root path
  secure: true, // Default to secure in production
  sameSite: 'lax' as const, // Default to 'lax' sameSite policy
}

// Sets a cookie with specified name, value, and options.
export function setCookie(
  name: string, // The name of the cookie
  value: string, // The value of the cookie
  options: CookieOptions = {} // Merge with defaults
): void {
  const days = options.days ?? DEFAULT_COOKIE_OPTIONS.days
  const path = options.path ?? DEFAULT_COOKIE_OPTIONS.path
  const secure = options.secure ?? DEFAULT_COOKIE_OPTIONS.secure
  const sameSite = options.sameSite ?? DEFAULT_COOKIE_OPTIONS.days

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  // Set expiration date
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  cookieString += `; expires=${date.toUTCString()}`
  // Add other options
  cookieString += `; path=${path}`
  if (secure) cookieString += '; secure'
  cookieString += `; samesite=${sameSite}`

  document.cookie = cookieString
}

// Gets the value of a cookie by name.
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }
  return null
}

// Deletes a cookie by name.
export function deleteCookie(
  name: string,
  path?: string,
): void {
  setCookie(name, '', {
    days: -1, // Set to expire in the past
    path,
  })
}
