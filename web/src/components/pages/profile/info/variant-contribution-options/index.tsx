import * as React from 'react'
import { Localized } from '@fluent/react'

import { Radio } from '../../../../ui/ui'

import './variant-contribution-options.css'

export const VariantContributionOptions = () => {
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
            name="variant-contribution-option">
            <Localized id="variant-contribution-option-1">
              <span />
            </Localized>
          </Radio>
          <Radio
            contentClass="radio-content"
            labelClass="radio-label"
            name="variant-contribution-option"
            checked>
            <Localized id="variant-contribution-option-2">
              <span />
            </Localized>
          </Radio>
        </div>
      </div>
    </div>
  )
}
