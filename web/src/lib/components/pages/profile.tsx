import * as React from 'react';
import messages from '../../../messages';
import User from '../../user';
import ProfileForm from '../profile-form/profile-form';

interface Props {
  active: string;
  user: User;
}

export default ({ active, user }: Props) => (
  <div id="profile-container" className={active}>
    <ProfileForm user={user} />

    <br />
    <br />

    <h1>{messages.WHY_PROFILE.TITLE}</h1>
    <br />
    <p>{messages.WHY_PROFILE.CONTENT}</p>
  </div>
);
