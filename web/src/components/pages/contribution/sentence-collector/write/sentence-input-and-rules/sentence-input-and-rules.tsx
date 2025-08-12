import * as React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { LabeledInput } from '../../../../../ui/ui'
import { MultipleCombobox } from '../../../../../multiple-combobox'
import { Rules } from './rules'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'
import { Select } from '../../../../../select'
import { LabeledTextArea } from '../../../../../ui/ui'

import { SentenceSubmissionError } from 'common'
import { LocaleLink } from '../../../../../locale-helpers'
import URLS from '../../../../../../urls'
import { useMultipleComboBox } from '../../../../../multiple-combobox/use-multiple-combobox'
import { useAccount } from '../../../../../../hooks/store-hooks'
import { WriteMode } from '../sentence-write'
import { StateError } from '../sentence-write/types'
import { trackGtag } from '../../../../../../services/tracker-ga4'

type Props = {
  handleSentenceInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  handleCitationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSentenceVariantChange: (item: string) => void
  selectedSentenceDomains: string[]
  setSelectedSentenceDomains: (domains: string[]) => void
  sentence: string
  citation: string
  sentenceDomains: readonly string[]
  error?: StateError
  variantTokens: string[]
  variantNames: string[]
  selectedVariant?: string
  mode: WriteMode
}

export const SentenceInputAndRules: React.FC<Props> = ({
  handleCitationChange,
  handleSentenceInputChange,
  handleSentenceVariantChange,
  sentenceDomains,
  selectedSentenceDomains,
  setSelectedSentenceDomains,
  sentence,
  citation,
  error,
  variantTokens,
  variantNames,
  selectedVariant,
  mode,
}) => {
  const { l10n } = useLocalization()
  const isSentenceError =
    error && error?.type !== SentenceSubmissionError.NO_CITATION
  const isCitationError = error?.type === SentenceSubmissionError.NO_CITATION
  const hasVariants = variantTokens && variantTokens.length > 0

  const zippedOptions = hasVariants && variantTokens.map((v, i) => `${variantNames[i]} [${v}]`)
  const variantOptions: string[] = hasVariants ? [l10n.getString('sentence-variant-select-multiple-variants'), ...zippedOptions] : []

  const { multipleComboBoxItems, inputValue, setInputValue } =
    useMultipleComboBox({
      items: sentenceDomains,
      selectedItems: selectedSentenceDomains,
    })

  const account = useAccount()

  const handleDetailsToggle = (
    evt: React.SyntheticEvent<HTMLDetailsElement>
  ) => {
    trackGtag('how-to-cite-toggle', { isOpen: evt.currentTarget.open })
  }

  return (
    <div className="inputs-and-instruction">
      <div className="inputs-and-rules-wrapper">
        <div className="inputs">
          <Localized id="sentence" attrs={{ label: true }}>
            <LabeledTextArea
              placeholder={
                mode === 'single'
                  ? l10n.getString('sentence-input-placeholder')
                  : l10n.getString('small-batch-sentence-input-placeholder')
              }
              className={classNames('sentence-input', {
                'sentence-error': isSentenceError,
                'variants-dropdown-hidden': !hasVariants,
              })}
              onChange={handleSentenceInputChange}
              value={sentence}
              dataTestId="sentence-textarea"
            />
          </Localized>
          <MultipleCombobox
            items={multipleComboBoxItems}
            maxNumberOfSelectedElements={3}
            inputValue={inputValue}
            setInputValue={setInputValue}
            selectedItems={selectedSentenceDomains}
            setSelectedItems={setSelectedSentenceDomains}
            label={l10n.getString('sentence-domain-combobox-label')}
          />
          {hasVariants && (
            <Select
              items={variantOptions}
              setSelectedItem={handleSentenceVariantChange}
              selectedItem={selectedVariant}
              label={l10n.getString('sentence-variant-select-label')}
              placeHolderText={l10n.getString(
                'sentence-variant-select-placeholder'
              )}
              doTranslation={false}
            />
          )}
          <Localized id="citation" attrs={{ label: true }}>
            <LabeledInput
              placeholder={l10n.getString('citation-input-placeholder')}
              className={classNames('citation-input', {
                'citation-error': isCitationError,
              })}
              onChange={handleCitationChange}
              value={citation}
              dataTestId="citation-input"
              autoComplete="on"
              name="citation"
            />
          </Localized>
          {isCitationError && (
            <div
              className="citation-error-message"
              data-testid="citation-error-message">
              <Localized id="required-field">
                <p />
              </Localized>
            </div>
          )}
          <div className="expandable-container">
            <ExpandableInformation
              summaryLocalizedId="how-to-cite"
              dataTestId="how-to-cite"
              onToggle={handleDetailsToggle}>
              <Localized id="how-to-cite-explanation-bold">
                <span className="bold" />
              </Localized>
              <Localized
                id="how-to-cite-explanation"
                elems={{
                  guidelinesLink: <LocaleLink to={URLS.GUIDELINES} blank />,
                }}>
                <span />
              </Localized>
            </ExpandableInformation>
          </div>
        </div>
        <Rules
          error={error?.type}
          showFirstRule
          isLoggedIn={Boolean(account)}
          mode={mode}
          localizedTitleId="sc-review-write-title"
          localizedSmallBatchTitleId="sc-review-small-batch-title"
        />
      </div>
    </div>
  )
}
