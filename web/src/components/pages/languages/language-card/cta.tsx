import * as React from 'react'
import { Link } from 'react-router-dom'
import { Localized } from '@fluent/react'

import URLS from '../../../../urls'
import { toLocaleRouteBuilder } from '../../../locale-helpers'

import styles from './cta.module.css'

interface LanguageCardCTAProps {
  type: 'launched' | 'in-progress'
  locale: string
  onClick: () => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const LanguageCardCTA = ({ type, locale, onClick }: LanguageCardCTAProps) => {
  if (type === 'launched') {
    return (
      <Link
        className={styles.cta}
        to={toLocaleRouteBuilder(locale)(URLS.SPEAK)}>
        <Localized id="contribute" />
      </Link>
    )
  }

  return (
    <button className={styles.cta} onClick={onClick}>
      <Localized id="get-involved-button" />
    </button>
  )
}

export default LanguageCardCTA
