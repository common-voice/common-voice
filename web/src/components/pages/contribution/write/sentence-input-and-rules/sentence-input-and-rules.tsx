import React from 'react';
import { Localized } from '@fluent/react';

import { EditIcon } from '../../../../ui/icons';
import { LabeledInput } from '../../../../ui/ui';
import { WriteProps } from '../write';
import { Rules } from './rules';

type Props = {
  getString: WriteProps['getString'];
};

export const SentenceInputAndRules: React.FC<Props> = ({ getString }) => (
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
          />
        </Localized>
        <Localized id="citation" attrs={{ label: true }}>
          <LabeledInput
            placeholder={getString('citation-input-value')}
            className="citation-input"
          />
        </Localized>
      </div>
      <Rules />
    </div>
  </div>
);
