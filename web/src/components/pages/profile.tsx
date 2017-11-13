import * as React from 'react';
import messages from '../../messages';
import ProfileForm from '../profile-form/profile-form';

import { RouteComponentProps } from 'react-router';

export default (props: RouteComponentProps<any>) => (
  <div id="profile-container">
    <ProfileForm />

    <br />
    <br />

    <h1>{messages.WHY_PROFILE.TITLE}</h1>
    <br />
    <p>{messages.WHY_PROFILE.CONTENT}</p>
  </div>
);
