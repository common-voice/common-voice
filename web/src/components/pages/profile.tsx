import { Localized } from 'fluent-react';
import * as React from 'react';
import ProfileForm from '../profile-form/profile-form';

import { RouteComponentProps } from 'react-router';

export default (props: RouteComponentProps<any>) => (
  <div id="profile-container">
    <ProfileForm />

    <br />
    <br />

    <Localized id="profile-why-title">
      <h1 />
    </Localized>
    <br />
    <Localized id="profile-why-content">
      <p style={{ marginBottom: '3rem' }} />
    </Localized>
  </div>
);
