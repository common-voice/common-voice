import React from 'react'

import { Localized } from '@fluent/react'

import { Button, LabeledCheckbox, LabeledInput } from '../../../../ui/ui'
import { InfoIcon, PlusCircleIcon } from '../../../../ui/icons'
import { LocaleLink } from '../../../../locale-helpers'
import URLS from '../../../../../urls'

type Props = {
  handleCreateApiKey: (desription: string) => void
}

export const CreateApiCredentials = ({ handleCreateApiKey }: Props) => {
  const [apiKeyName, setApiKeyName] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [privacyAgreed, setIsPrivacyAgreed] = React.useState(false)
  const [confirmNoIdentify, setConfirmNoIdentify] = React.useState(false)

  const isGenerateButtonDisabled = !privacyAgreed || !confirmNoIdentify

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="create-api-key-container">
      <Localized id="api-key-name-input" attrs={{ label: true }}>
        <LabeledInput
          ref={inputRef}
          value={apiKeyName}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            setApiKeyName(evt.target.value)
          }
        />
      </Localized>

      <div className="api-key-info-section">
        <div>
          <InfoIcon />
        </div>

        <div>
          <Localized id="create-api-key-header" elems={{ bold: <strong /> }}>
            <p className="header" />
          </Localized>
          <Localized
            id="create-api-key-description"
            elems={{ bold: <strong /> }}>
            <p className="description" />
          </Localized>
        </div>
      </div>

      <div className="generate-api-key-button-container">
        <div className="checkboxes">
          <LabeledCheckbox
            label={
              <Localized
                id="accept-privacy-and-terms"
                elems={{
                  termsLink: <LocaleLink to={URLS.TERMS} blank />,
                  privacyLink: <LocaleLink to={URLS.PRIVACY} blank />,
                }}>
                <span />
              </Localized>
            }
            required
            onChange={() => {
              setIsPrivacyAgreed(!privacyAgreed)
            }}
            checked={privacyAgreed}
            data-testid="checkbox"
            className="accept-privacy-and-terms"
          />

          <LabeledCheckbox
            label={
              <Localized id="create-api-key-agreement">
                <span />
              </Localized>
            }
            required
            onChange={() => {
              setConfirmNoIdentify(!confirmNoIdentify)
            }}
            checked={confirmNoIdentify}
            data-testid="checkbox"
          />
        </div>

        <Button
          className="generate-api-key-button"
          onClick={() => handleCreateApiKey(apiKeyName)}
          disabled={isGenerateButtonDisabled}>
          <PlusCircleIcon />
          <Localized id="generate-api-key-button">
            <span />
          </Localized>
        </Button>
      </div>
    </div>
  )
}
