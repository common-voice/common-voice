import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocalization } from '@fluent/react'
import { SystemError } from '../services/app-error'
import { Notifications } from '../stores/notifications'

/**
 * Catches unhandled SystemError promise rejections (from async Redux thunks)
 * and shows a localized notification pill instead of letting them surface
 * as uncaught errors in Sentry.
 *
 * React Error Boundaries only catch errors during rendering — async errors
 * from API calls in Redux thunks escape entirely. This hook fills that gap.
 * 
 * This will catch & handle most of the communication related errors...
 * 
 */
export default function useSystemErrorHandler() {
  const dispatch = useDispatch()
  const { l10n } = useLocalization()

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (!(event.reason instanceof SystemError)) return

      event.preventDefault()

      const code = event.reason.code
      const message = l10n.getString(
        `error-title-${code}`,
        null,
        l10n.getString('error-something-went-wrong')
      )

      dispatch(Notifications.actions.addPill(message, 'error'))
    }

    window.addEventListener('unhandledrejection', handler)
    return () => window.removeEventListener('unhandledrejection', handler)
  }, [dispatch, l10n])
}
