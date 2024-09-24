import { Localized } from '@fluent/react'
import * as React from 'react'

import { QuestionIcon, SendIcon } from '../../../../../ui/icons'
import { LabeledCheckbox, LinkButton } from '../../../../../ui/ui'
import { PrimaryButton } from '../../../../../primary-buttons/primary-buttons'

import { SentenceInputAndRules } from '../sentence-input-and-rules/sentence-input-and-rules'
import { sentenceDomains } from 'common'
import { useSentenceWrite } from './hooks/use-sentence-write'

import { COMMON_VOICE_EMAIL } from '../../../../../../constants'
import URLS from '../../../../../../urls'

import './sentence-write.css'

export type WriteMode = 'single' | 'small-batch'

type Props = {
  allVariants: string[]
  instructionLocalizedId: string
  mode: WriteMode
}

export const SentenceWrite: React.FC<Props> = ({
  allVariants,
  instructionLocalizedId,
  mode,
}) => {
  const {
    handleCitationChange,
    handlePublicDomainChange,
    handleSentenceDomainChange,
    handleSentenceInputChange,
    handleSentenceVariantChange,
    handleSubmit,
    sentenceWriteState,
  } = useSentenceWrite(mode)

  return (
    <form
      className="guidelines-form"
      data-testid="single-submission-form"
      onSubmit={handleSubmit}>
      <div className="inputs-and-rules-container">
        <SentenceInputAndRules
          handleSentenceInputChange={handleSentenceInputChange}
          handleCitationChange={handleCitationChange}
          sentence={sentenceWriteState.sentence}
          citation={sentenceWriteState.citation}
          sentenceDomains={sentenceDomains}
          setSelectedSentenceDomains={handleSentenceDomainChange}
          selectedSentenceDomains={sentenceWriteState.sentenceDomains}
          error={sentenceWriteState.error}
          handleSentenceVariantChange={handleSentenceVariantChange}
          variantTokens={allVariants}
          selectedVariant={sentenceWriteState.sentenceVariant}
          instructionLocalizedId={instructionLocalizedId}
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
            disabled={sentenceWriteState.sentence.length === 0}
            checked={sentenceWriteState.confirmPublicDomain}
            required
            onChange={handlePublicDomainChange}
            data-testid="public-domain-checkbox"
          />
          <Localized id="submit-form-action">
            <PrimaryButton
              className="submit"
              type="submit"
              disabled={!sentenceWriteState.confirmPublicDomain}
              data-testid="submit-button"
            />
          </Localized>
        </div>
      </div>
    </form>
  )
}
