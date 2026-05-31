import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocalization } from '@fluent/react'
import { ClientHandledError, SystemError } from '../services/app-error'
import { Notifications } from '../stores/notifications'

/** Catches unhandled SystemError/ClientHandledError rejections and shows a localized pill. */
export default function useSystemErrorHandler() {
  const dispatch = useDispatch()
  const { l10n } = useLocalization()

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      let code: string | null = null
      let retryAfter = 0
      if (reason instanceof SystemError) {
        code = reason.code
      } else if (reason instanceof ClientHandledError) {
        code = String(reason.status)
        retryAfter = parseInt(reason.retryAfter ?? '', 10) || 0
      }
      if (!code) return

      event.preventDefault()

      const message = l10n.getString(
        `error-title-${code}`,
        { retryAfter },
        l10n.getString('error-something-went-wrong')
      )

      dispatch(Notifications.actions.addPill(message, 'error'))
    }

    window.addEventListener('unhandledrejection', handler)
    return () => window.removeEventListener('unhandledrejection', handler)
  }, [dispatch, l10n])
}
