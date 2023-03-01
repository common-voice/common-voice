import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';

import React from 'react';
import { SkipIcon } from '../../../../ui/icons';
import { Button, LabeledInput } from '../../../../ui/ui';
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
      <div className="example-container citing-sentences">
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
    <div className="example-container reviewing-sentences">
      <>
        <VoteButton kind="yes" disabled className="yes-button" />
        <Button outline rounded className="skip-button">
          <SkipIcon />
          <Localized id="skip">
            <span />
          </Localized>{' '}
        </Button>
        <VoteButton kind="no" disabled className="no-button" />
      </>
    </div>
  );
};

export default withLocalization(ExampleContent);
