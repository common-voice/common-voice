import * as React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { EditIcon } from '../../../../../ui/icons'
import { LabeledInput, LabeledSelect } from '../../../../../ui/ui'
import { MultipleCombobox } from '../../../../../multiple-combobox'
import { Rules } from './rules'
import { Instruction } from '../../instruction'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'
import { SentenceSubmissionError, Variant } from 'common'
import { LabeledTextArea } from '../../../../../ui/ui'
import { LocaleLink } from '../../../../../locale-helpers'
import URLS from '../../../../../../urls'
import { useMultipleComboBox } from '../../../../../multiple-combobox/use-multiple-combox'

type Props = {
  handleSentenceInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  handleCitationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSentenceVariantChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  selectedSentenceDomains: string[]
  setSelectedSentenceDomains: (domains: string[]) => void
  sentence: string
  citation: string
  sentenceDomains: readonly string[]
  error: SentenceSubmissionError
  variants: Variant[]
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
  variants,
}) => {
  const isSentenceError = error && error !== SentenceSubmissionError.NO_CITATION
  const isCitationError = error === SentenceSubmissionError.NO_CITATION

  const { l10n } = useLocalization()

  const { multipleComboBoxItems, inputValue, setInputValue } =
    useMultipleComboBox({
      items: sentenceDomains,
      selectedItems: selectedSentenceDomains,
    })

  return (
    <div className="inputs-and-instruction">
      <Instruction localizedId="write-instruction" icon={<EditIcon />} />
      <Localized id="write-page-subtitle">
        <p className="subtitle" />
      </Localized>
      <div className="inputs-and-rules-wrapper">
        <div className="inputs">
          <Localized id="sentence" attrs={{ label: true }}>
            <LabeledTextArea
              placeholder={l10n.getString('sentence-input-value')}
              className={classNames('sentence-input', {
                'sentence-error': isSentenceError,
                'variants-dropdown-hidden': !variants,
              })}
              onChange={handleSentenceInputChange}
              value={sentence}
              dataTestId="sentence-textarea"
            />
          </Localized>
          <MultipleCombobox
            items={multipleComboBoxItems}
            maxNumberOfSelectedElements={3}
            selectedItems={selectedSentenceDomains}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setSelectedItems={setSelectedSentenceDomains}
          />
          {variants && (
            <Localized id="sentence-variant-select" attrs={{ label: true }}>
              <LabeledSelect
                className="sentence-variant-select"
                onChange={handleSentenceVariantChange}>
                <option value="">
                  {l10n.getString('sentence-variant-select-default-value')}
                </option>
                {variants.map(el => (
                  <Localized id={el.token} key={el.id}>
                    <option value={el.token}>{el}</option>
                  </Localized>
                ))}
              </LabeledSelect>
            </Localized>
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
              required
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
            <ExpandableInformation summaryLocalizedId="how-to-cite">
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
        <Rules error={error} title="sc-review-write-title" showFirstRule />
      </div>
    </div>
  )
}
