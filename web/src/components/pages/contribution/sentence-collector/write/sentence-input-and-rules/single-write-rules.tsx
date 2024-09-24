import React, { useState } from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SentenceSubmissionError } from 'common'
import { AlertIcon, ChevronDown } from '../../../../../ui/icons'
import { TextButton } from '../../../../../ui/ui'

type Props = {
  showFirstRule: boolean
  isLoggedIn: boolean
  error?: SentenceSubmissionError
}

export const SinglewriteRules = ({
  showFirstRule,
  error,
  isLoggedIn,
}: Props) => {
  const [rulesVisible, setRulesVisible] = useState(true)

  const handleClick = () => {
    setRulesVisible(!rulesVisible)
  }

  return (
    <div className="single-write-rules">
      <div className="rules-title-container">
        <div className="icon-and-title">
          <ChevronDown
            className={classNames('chevron', { 'rotate-180': rulesVisible })}
            onClick={handleClick}
          />
          {error && <AlertIcon className="alert-icon" />}
          <Localized id="sc-review-single-write-title">
            <TextButton onClick={handleClick} />
          </Localized>
        </div>
      </div>

      {rulesVisible && (
        <ul>
          {showFirstRule && (
            <Localized
              id="new-sentence-rule-1"
              elems={{
                noCopyright: (
                  <a
                    href="https://en.wikipedia.org/wiki/Public_domain"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
                cc0: (
                  <a
                    href="https://creativecommons.org/share-your-work/public-domain/cc0/"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}>
              <li />
            </Localized>
          )}
          <Localized id="new-sentence-rule-2">
            <li
              className={classNames({
                error: error === SentenceSubmissionError.TOO_LONG,
              })}
              data-testid={
                error === SentenceSubmissionError.TOO_LONG
                  ? 'error-too-long'
                  : ''
              }
            />
          </Localized>
          <Localized id="new-sentence-rule-3">
            <li />
          </Localized>
          <Localized id="new-sentence-rule-4">
            <li />
          </Localized>
          <Localized id="new-sentence-rule-5">
            <li
              className={classNames({
                error:
                  error === SentenceSubmissionError.NO_NUMBERS ||
                  error === SentenceSubmissionError.NO_SYMBOLS,
              })}
              data-testid={
                error === SentenceSubmissionError.NO_NUMBERS ||
                error === SentenceSubmissionError.NO_SYMBOLS
                  ? 'error-no-numbers-no-symbols'
                  : ''
              }
            />
          </Localized>
          <Localized id="new-sentence-rule-6">
            <li
              className={classNames({
                error: error === SentenceSubmissionError.NO_FOREIGN_SCRIPT,
              })}
              data-testid={
                error === SentenceSubmissionError.NO_FOREIGN_SCRIPT
                  ? 'error-no-foreign-script'
                  : ''
              }
            />
          </Localized>
          <Localized id="new-sentence-rule-7">
            <li
              className={classNames({
                error: error === SentenceSubmissionError.NO_CITATION,
              })}
              data-testid={
                error === SentenceSubmissionError.NO_CITATION
                  ? 'error-no-citation'
                  : ''
              }
            />
          </Localized>
          <Localized id="new-sentence-rule-8">
            <li className="last-rule" />
          </Localized>
        </ul>
      )}
      {!isLoggedIn && (
        <Localized id="login-instruction-multiple-sentences">
          <p className="login-instruction-multiple-sentences" />
        </Localized>
      )}
    </div>
  )
}
