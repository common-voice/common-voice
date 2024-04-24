import * as React from 'react'
import { Localized } from '@fluent/react'

import { Radio } from '../../../../ui/ui'

import { UserLanguage } from 'common'

import './variant-contribution-options.css'

type Props = {
  locale: string
  userLanguages: UserLanguage[]
  setUserLanguages: (userLanguages: UserLanguage[]) => void
}

type HandleChangeEvent<T> = React.ChangeEvent<
  { value: T; name?: string } & HTMLInputElement
>

export const VariantContributionOptions = ({
  locale,
  userLanguages,
  setUserLanguages,
}: Props) => {
  const userLanguage = userLanguages.find(
    language => language.locale === locale
  )
  const [isPreferredOption, setIsPreferredOption] = React.useState(
    userLanguage.variant.is_preferred_option
  )

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
            name="variant-contribution-option"
            value="my-variant"
            checked={isPreferredOption === true}
            onChange={handleChange}>
            <Localized id="variant-contribution-option-1">
              <span />
            </Localized>
          </Radio>
          <Radio
            contentClass="radio-content"
            labelClass="radio-label"
            name="variant-contribution-option"
            value="all-variants"
            checked={isPreferredOption === false}
            onChange={handleChange}>
            <Localized id="variant-contribution-option-2">
              <span />
            </Localized>
          </Radio>
        </div>
      </div>
    </div>
  )
}
