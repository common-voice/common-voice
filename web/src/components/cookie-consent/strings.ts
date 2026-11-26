import { ReactLocalization } from '@fluent/react'

import { CookieControlStrings } from './config'

// Fluent ids are defined in web/locales/common-voice/en/cookie-consent.ftl.
export function getCookieControlStrings(
  l10n: Pick<ReactLocalization, 'getString'>
): CookieControlStrings {
  const t = (id: string) => l10n.getString(`cookie-consent-${id}`)

  return {
    text: {
      notifyTitle: t('notify-title'),
      notifyDescription: t('notify-description'),
      accept: t('accept-all'),
      reject: t('reject-all'),
      settings: t('settings'),
      title: t('panel-title'),
      intro: t('panel-intro'),
      acceptSettings: t('allow-all'),
      rejectSettings: t('reject-all'),
      necessaryTitle: t('necessary-title'),
      necessaryDescription: t('necessary-description'),
      on: t('toggle-on'),
      off: t('toggle-off'),
      closeLabel: t('close'),
      cornerButton: t('corner-button'),
      landmark: t('landmark'),
    },
    analytics: {
      label: t('analytics-label'),
      description: t('analytics-description'),
    },
  }
}
