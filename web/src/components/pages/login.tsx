import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useAction } from '../../hooks/store-hooks'
import URLS from '../../urls'
import { Notifications } from '../../stores/notifications'
import { useTypedSelector } from '../../stores/tree'
import { trackProfile } from '../../services/tracker'
import { useLocale } from '../locale-helpers'

export const LoginFailure = withRouter(
  ({ history }: RouteComponentProps<any, any, any>): null => {
    const [, toLocaleRoute] = useLocale()
    const addNotification = useAction(Notifications.actions.addPill)

    useEffect(() => {
      addNotification('Login failed!')
      history.replace(toLocaleRoute(URLS.ROOT))
    }, [])

    return null
  }
)

export const LoginSuccess = withRouter(
  ({ history, location }: RouteComponentProps<any, any, any>): null => {
    const user = useTypedSelector(({ user }) => user)
    const [locale, toLocaleRoute] = useLocale()

    useEffect(() => {
      const { account, isFetchingAccount } = user
      if (isFetchingAccount) return
      const redirectURL = sessionStorage.getItem('redirectURL')
      sessionStorage.removeItem('redirectURL')

      // Check for intended_redirect parameter (for new users coming from SS)
      const urlParams = new URLSearchParams(location.search)
      const intendedRedirect = urlParams.get('intended_redirect')

      if (account) {
        trackProfile('login', locale)
      }

      if (account) {
        // Existing user - use redirect URL if available
        history.replace(
          redirectURL || toLocaleRoute(URLS.DASHBOARD + location.search)
        )
      } else {
        // New user - store intended redirect for after profile completion
        if (intendedRedirect) {
          sessionStorage.setItem('postProfileRedirect', intendedRedirect)
        }
        history.replace(URLS.PROFILE_INFO + location.search)
      }
    }, [user])

    return null
  }
)
