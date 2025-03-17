import * as React from 'react'
import { Localized } from '@fluent/react'

import { LanguageStatistics } from 'common'
import { ModalOptions } from '../languages'

import LanguageCardCTA from './cta'
import LanguageCardData from './data'

import styles from './language-card.module.css'

interface LanguageCardProps {
  type: 'launched' | 'in-progress'
  localeMessages: string[][]
  language: LanguageStatistics
  setModalOptions?: ({ locale }: ModalOptions) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const LanguageCard = ({
  type,
  language,
  setModalOptions,
}: LanguageCardProps) => {
  return (
    <div className={styles.LanguageCard}>
      <div className={styles.LanguageCardContent}>
        <h3 className={styles.LanguageCardHeading}>
          <Localized id={language.locale} />
        </h3>

        <LanguageCardData type={type} language={language} />
      </div>

      <LanguageCardCTA
        type={type}
        locale={language.locale}
        onClick={() => {
          if (type === 'in-progress') {
            // show modal
            setModalOptions({ locale: language.locale })
          }
        }}
      />
    </div>
  )
}

export default LanguageCard
