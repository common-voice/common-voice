import React from 'react';
import { Localized } from '@fluent/react';

import { EditIcon } from '../../../../ui/icons';
import { LabeledInput } from '../../../../ui/ui';
import { WriteProps } from '../write';
import { Rules } from './rules';
import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { SentenceSubmissionError } from 'common';

type Props = {
  getString: WriteProps['getString'];
  handleSentenceInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleCitationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sentence: string;
  citation: string;
  error?: SentenceSubmissionError;
};

export const SentenceInputAndRules: React.FC<Props> = ({
  getString,
  handleCitationChange,
  handleSentenceInputChange,
  sentence,
  citation,
  error,
}) => {
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
            <LabeledInput
              placeholder={getString('sentence-input-value')}
              className="sentence-input"
              component="textarea"
              onChange={handleSentenceInputChange}
              value={sentence}
            />
          </Localized>
          <Localized id="citation" attrs={{ label: true }}>
            <LabeledInput
              placeholder={getString('citation-input-value')}
              className="citation-input"
              onChange={handleCitationChange}
              value={citation}
            />
          </Localized>
          <div className="expandable-container">
            <ExpandableInformation summaryLocalizedId="how-to-cite">
              <Localized id="how-to-cite-explanation-bold">
                <span className="bold" />
              </Localized>
              <Localized id="how-to-cite-explanation">
                <span />
              </Localized>
            </ExpandableInformation>
          </div>
        </div>
        <Rules />
      </div>
    </div>
  );
};
