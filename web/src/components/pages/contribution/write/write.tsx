import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import React from 'react';

import { EditIcon } from '../../../ui/icons';
import { LabeledInput } from '../../../ui/ui';

import './write.css';

const NUMBER_OF_SENTENCE_RULES = 7;

const Write: React.FC<WithLocalizationProps> = ({ getString }) => (
  <div className="write-page">
    <div className="write-wrapper">
      <div className="write-page-header">
        <Localized id="sc-header-add">
          <span />
        </Localized>
        <EditIcon />
        <Localized id="write-page-header-public-domain">
          <span />
        </Localized>
      </div>
      <Localized id="write-page-subtitle">
        <p className="subtitle" />
      </Localized>
      <div className="inputs-and-rules-wrapper">
        <div className="inputs-wrapper">
          <Localized id="sentence" attrs={{ label: true }}>
            <LabeledInput
              placeholder={getString('sentence-input-value')}
              className="sentence-input"
              component="textarea"
            />
          </Localized>
          <Localized id="citation" attrs={{ label: true }}>
            <LabeledInput
              placeholder={getString('citation-input-value')}
              className="citation-input"
            />
          </Localized>
        </div>
        <div className="rules">
          <Localized id="what-can-i-add">
            <p />
          </Localized>
          <ul>
            {Array.from(
              Array(NUMBER_OF_SENTENCE_RULES),
              (_, index) => index + 1
            ).map((_, index) => (
              <Localized key={index} id={`new-sentence-rule-${index + 1}`}>
                <li />
              </Localized>
            ))}
            <Localized id="new-sentence-rule-1">
              <li />
            </Localized>
            <Localized id="new-sentence-rule-2">
              <li />
            </Localized>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default withLocalization(Write);
