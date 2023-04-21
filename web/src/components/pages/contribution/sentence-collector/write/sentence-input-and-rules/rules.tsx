import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SentenceSubmissionError } from 'common'
import { AlertIcon, ChevronDown } from '../../../../../ui/icons'
import { TextButton } from '../../../../../ui/ui'
import useIsMaxWindowWidth from '../../../../../../hooks/use-is-max-window-width'

import './rules.css'

type Props = {
  error?: SentenceSubmissionError
  showFirst?: boolean
  title: string
}

const MAX_WINDOW_WIDTH = 992

export const Rules: React.FC<Props> = ({ error, showFirst, title }) => {
  const [rulesVisible, setShowRulesVisible] = React.useState(true)
  const isMobileWidth = useIsMaxWindowWidth(MAX_WINDOW_WIDTH)

  const handleClick = () => {
    setShowRulesVisible(!rulesVisible)
  }

  return (
    <div className={classNames('rules', { 'write-rules': showFirst })}>
      <div className={classNames('inner', { 'rules-hidden': !rulesVisible })}>
        <div className="rules-title-container">
          <div className="icon-and-title">
            {error && <AlertIcon className="alert-icon" />}
            <Localized id={title}>
              <TextButton onClick={handleClick} />
            </Localized>
          </div>
          <ChevronDown
            className={classNames('chevron', { 'rotate-180': rulesVisible })}
            onClick={handleClick}
          />
        </div>
        {(rulesVisible || !isMobileWidth) && (
          <ul>
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
            <Localized id="new-sentence-rule-2">
              <li
                className={classNames({
                  error: error === SentenceSubmissionError.TOO_LONG,
                })}
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
              />
            </Localized>
            <Localized id="new-sentence-rule-6">
              <li
                className={classNames({
                  error: error === SentenceSubmissionError.NO_FOREIGN_SCRIPT,
                })}
              />
            </Localized>
            <Localized id="new-sentence-rule-7">
              <li
                className={classNames({
                  error: error === SentenceSubmissionError.NO_CITATION,
                })}
              />
            </Localized>
            <Localized id="new-sentence-rule-8">
              <li className="last-rule" />
            </Localized>
          </ul>
        )}
      </div>
    </div>
  )
}