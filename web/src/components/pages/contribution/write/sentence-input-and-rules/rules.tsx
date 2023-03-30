import React, { useState } from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { SentenceSubmissionError } from 'common';
import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import useIsMaxWindowWidth from '../../../../../hooks/use-is-max-window-width';

type Props = {
  error: SentenceSubmissionError;
};

const MAX_WINDOW_WIDTH = 576;

export const Rules: React.FC<Props> = ({ error }) => {
  const [rulesVisible, setShowRulesVisible] = useState(true);
  const isMobileWidth = useIsMaxWindowWidth(MAX_WINDOW_WIDTH);

  const handleClick = () => {
    setShowRulesVisible(!rulesVisible);
  };

  return (
    <div className="rules">
      <div className={classNames('inner', { 'rules-hidden': !rulesVisible })}>
        <div className="rules-title-container">
          <Localized id="what-can-i-add">
            <TextButton onClick={handleClick} />
          </Localized>
          <ChevronDown
            className={classNames({ 'rotate-180': rulesVisible })}
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
  );
};
