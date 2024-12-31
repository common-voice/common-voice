import * as React from 'react'
import { Localized } from '@fluent/react'

import { Radio } from '../../../../ui/ui'
import { SentenceVariantWarning } from './sentence-variant-warning'

import { UserLanguage } from 'common'

import './variant-contribution-options.css'

type Props = {
  locale: string
  userLanguages: UserLanguage[]
  setUserLanguages: (userLanguages: UserLanguage[]) => void
  isPreferredOption: boolean
  setIsPreferredOption: React.Dispatch<React.SetStateAction<boolean>>
}

type HandleChangeEvent<T> = React.ChangeEvent<
  { value: T; name?: string } & HTMLInputElement
>

export const VariantContributionOptions = ({
  locale,
  userLanguages,
  setUserLanguages,
  isPreferredOption,
  setIsPreferredOption,
}: Props) => {
  const currentLanguage = userLanguages.find(
    language => language.locale === locale
  )

  const isVariantPreferredOption =
    currentLanguage?.variant?.is_preferred_option || false

  const handleChange = (
    evt: HandleChangeEvent<'my-variant' | 'all-variants'>
  ) => {
    const preferredOption = evt.target.value

    setIsPreferredOption(preferredOption === 'my-variant')

    const newLanguages = [...userLanguages]
    const languageIndex = newLanguages.findIndex(
      language => language.locale === locale
    )

    if (preferredOption === 'my-variant') {
      newLanguages[languageIndex] = {
        ...newLanguages[languageIndex],
        variant: {
          ...newLanguages[languageIndex].variant,
          is_preferred_option: true,
        },
      }
    } else {
      newLanguages[languageIndex] = {
        ...newLanguages[languageIndex],
        variant: {
          ...newLanguages[languageIndex].variant,
          is_preferred_option: false,
        },
      }
    }

    setUserLanguages(newLanguages)
  }

  return (
    <div className="variant-contribution-options-container">
      <Localized id="variant-contribution-options-header">
        <h3 />
      </Localized>
      <div className="form-fields">
        <Localized id="variant-contribution-help">
          <p className="variant-contribution-help" />
        </Localized>

        <div className="radio-container">
          <Radio
            contentClass="radio-content"
            labelClass="radio-label"
            name={`${locale}-variant-contribution-option`}
            value="all-variants"
            checked={isVariantPreferredOption === false}
            onChange={handleChange}>
            <Localized id="variant-contribution-option-1">
              <span />
            </Localized>
          </Radio>
          <Radio
            contentClass="radio-content"
            labelClass="radio-label"
            name={`${locale}-variant-contribution-option`}
            value="my-variant"
            checked={isVariantPreferredOption === true}
            onChange={handleChange}>
            <Localized id="variant-contribution-option-2">
              <span />
            </Localized>
          </Radio>
        </div>

        {(isPreferredOption || isVariantPreferredOption) && (
          <SentenceVariantWarning />
        )}
      </div>
    </div>
  )
}
