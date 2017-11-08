import * as React from 'react';
import messages from '../../../messages';
import User from '../../user';
import ProfileForm from '../profile-form/profile-form';

import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any> {
  user: User;
}

export default ({ user }: Props) => (
  <div id="profile-container">
    <ProfileForm user={user} />

    <br />
    <br />

    <h1>{messages.WHY_PROFILE.TITLE}</h1>
    <br />
    <p>{messages.WHY_PROFILE.CONTENT}</p>
  </div>
);
