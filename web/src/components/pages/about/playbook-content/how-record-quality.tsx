import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleNavLink } from '../../../locale-helpers';
import URLS from '../../../../urls';

const HowRecordQuality = React.memo(() => {
  const strong = <strong />;

  return (
    <div className="record-quality-content">
      <div>
        <Localized id="about-playbook-how-record-content-1">
          <p />
        </Localized>
        <Localized id="about-playbook-how-record-content-2">
          <p />
        </Localized>
        <Localized id="about-playbook-how-record-content-3">
          <p />
        </Localized>
        <Localized id="about-playbook-how-record-content-4">
          <p />
        </Localized>
        <Localized
          id="about-playbook-how-record-content-5"
          elems={{
            accuracyLink: <LocaleNavLink to={URLS.CRITERIA} />,
          }}>
          <p />
        </Localized>
      </div>
      <img src={require('../images/playbook-group-illustration.jpg')} />
    </div>
  );
});

export default HowRecordQuality;
