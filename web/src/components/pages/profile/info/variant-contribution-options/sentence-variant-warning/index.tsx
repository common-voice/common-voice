import * as React from 'react'
import { Localized } from '@fluent/react'

import './sentence-variant-warning.css'

export const SentenceVariantWarning = () => (
  <div className="sentence-variant-warning-container">
    <div className="sentence-variant-warning-content">
      <div className="sentence-variant-warning-title-container">
        <Localized id="variant-contribution-warning-title">
          <p className="title" />
        </Localized>
      </div>
      <Localized id="variant-contribution-warning-subtitle">
        <p className="subtitle" />
      </Localized>
    </div>
  </div>
)
