import { Localized } from '@fluent/react'
import * as React from 'react'

import { QuestionIcon, SendIcon } from '../../../../../ui/icons'
import { LabeledCheckbox, LinkButton } from '../../../../../ui/ui'
import { PrimaryButton } from '../../../../../primary-buttons/primary-buttons'

import { SentenceInputAndRules } from '../sentence-input-and-rules/sentence-input-and-rules'

import { COMMON_VOICE_EMAIL } from '../../../../../../constants'
import URLS from '../../../../../../urls'
import { sentenceDomains as allSentenceDomains } from 'common'

import { StateError } from './types'

import './sentence-write.css'

export type WriteMode = 'single' | 'small-batch'

type Props = {
  allVariants: string[]
  mode: WriteMode
  handleCitationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handlePublicDomainChange: () => void
  handleSentenceDomainChange: (domain: string[]) => void
  handleSentenceInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  handleSentenceVariantChange: (item: string) => void
  handleSubmit: (evt: React.SyntheticEvent) => Promise<void>
  citation: string
  sentence: string
  sentenceVariant: string
  selectedSentenceDomains: string[]
  error?: StateError
  confirmPublicDomain: boolean
}

export const SentenceWrite: React.FC<Props> = ({
  allVariants,
  mode,
  handleCitationChange,
  handlePublicDomainChange,
  handleSentenceDomainChange,
  handleSubmit,
  handleSentenceInputChange,
  handleSentenceVariantChange,
  citation,
  sentence,
  sentenceVariant,
  selectedSentenceDomains,
  confirmPublicDomain,
  error,
}) => {
  return (
    <form
      className="guidelines-form"
      data-testid="single-submission-form"
      onSubmit={handleSubmit}>
      <div className="inputs-and-rules-container">
        <SentenceInputAndRules
          handleSentenceInputChange={handleSentenceInputChange}
          handleCitationChange={handleCitationChange}
          sentence={sentence}
          citation={citation}
          sentenceDomains={allSentenceDomains}
          setSelectedSentenceDomains={handleSentenceDomainChange}
          selectedSentenceDomains={selectedSentenceDomains}
          error={error}
          handleSentenceVariantChange={handleSentenceVariantChange}
          variantTokens={allVariants}
          selectedVariant={sentenceVariant}
          mode={mode}
        />
      </div>

      <div className="buttons">
        <div>
          <LinkButton
            rounded
            outline
            className="guidelines-button"
            blank
            to={URLS.GUIDELINES}>
            <QuestionIcon />
            <Localized id="guidelines">
              <span />
            </Localized>
          </LinkButton>
          <LinkButton
            rounded
            outline
            blank
            href={`mailto:${COMMON_VOICE_EMAIL}`}>
            <SendIcon />
            <Localized id="contact-us">
              <span />
            </Localized>
          </LinkButton>
        </div>
        <div className="write-form-container">
          <LabeledCheckbox
            label={
              <Localized
                id="sc-write-submit-confirm"
                elems={{
                  wikipediaLink: (
                    <a
                      href="https://en.wikipedia.org/wiki/Public_domain"
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
                }}>
                <span />
              </Localized>
            }
            disabled={sentence.length === 0}
            checked={confirmPublicDomain}
            required
            onChange={handlePublicDomainChange}
            data-testid="public-domain-checkbox"
          />
          <Localized id="submit-form-action">
            <PrimaryButton
              className="submit"
              type="submit"
              disabled={!confirmPublicDomain}
              data-testid="submit-button"
            />
          </Localized>
        </div>
      </div>
    </form>
  )
}
