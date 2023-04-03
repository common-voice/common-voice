import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { EditIcon } from '../../../../ui/icons';
import { LabeledInput } from '../../../../ui/ui';
import { WriteProps } from '../write';
import { Rules } from './rules';
import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { SentenceSubmissionError } from 'common';
import { LabeledTextArea } from '../../../../ui/ui';
import { LocaleLink } from '../../../../locale-helpers';
import URLS from '../../../../../urls';

type Props = {
  getString: WriteProps['getString'];
  handleSentenceInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleCitationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sentence: string;
  citation: string;
  error: SentenceSubmissionError;
};

export const SentenceInputAndRules: React.FC<Props> = ({
  getString,
  handleCitationChange,
  handleSentenceInputChange,
  sentence,
  citation,
  error,
}) => {
  const isSentenceError =
    error && error !== SentenceSubmissionError.NO_CITATION;
  const isCitationError = error === SentenceSubmissionError.NO_CITATION;

  return (
    <div className="inputs-and-instruction">
      <div className="write-page-instruction">
        <Localized id="sc-header-add">
          <span />
        </Localized>
        <EditIcon />
        <Localized id="write-page-instruction-public-domain">
          <span />
        </Localized>
      </div>
      <Localized id="write-page-subtitle">
        <p className="subtitle" />
      </Localized>
      <div className="inputs-and-rules-wrapper">
        <div className="inputs">
          <Localized id="sentence" attrs={{ label: true }}>
            <LabeledTextArea
              placeholder={getString('sentence-input-value')}
              className={classNames('sentence-input', {
                'sentence-error': isSentenceError,
              })}
              onChange={handleSentenceInputChange}
              value={sentence}
              dataTestId="sentence-textarea"
            />
          </Localized>
          <Localized id="citation" attrs={{ label: true }}>
            <LabeledInput
              placeholder={getString('citation-input-value')}
              className={classNames('citation-input', {
                'citation-error': isCitationError,
              })}
              onChange={handleCitationChange}
              value={citation}
              dataTestId="citation-input"
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
        <Rules error={error} />
      </div>
    </div>
  );
};
