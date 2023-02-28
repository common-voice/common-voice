import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';

import React from 'react';
import { LabeledInput } from '../../../../ui/ui';
import { VoteButton } from '../../../contribution/listen/listen';

type Props = {
  contentType: 'cite' | 'review';
};

const ExampleContent: React.FC<Props & WithLocalizationProps> = ({
  getString,
  contentType,
}) => {
  if (contentType === 'cite') {
    return (
      <div className="example-container sentence-guidelines">
        <Localized id="citation" attrs={{ label: true }}>
          <LabeledInput value={getString('self-citation')} readOnly />
        </Localized>
        <Localized id="self-citation-explanation">
          <p className="self-citation-explanation" />
        </Localized>
      </div>
    );
  }

  return (
    <div className="example-container sentence-guidelines">
      <>
        <VoteButton kind="yes" onClick={() => console.log('kkk')} disabled />
        <VoteButton kind="no" onClick={() => console.log('kkk')} disabled />
      </>
    </div>
  );
};

export default withLocalization(ExampleContent);
