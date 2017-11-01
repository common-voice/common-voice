import { h } from 'preact';
import User from '../../../user';
import ProgressButton from '../../progress-button';
import ProfileActions from './profile-actions';

interface Props {
  children?: JSX.Element[];
  progress: number;
  user: User;
  onSubmit(): Promise<void>;
}

export default ({ children, progress, user, onSubmit }: Props) => (
  <div id="voice-submit">
    <p id="thank-you">
      <span>Review &amp; Submit</span>
    </p>
    <p id="want-to-review">
      <span>
        Thank you for recording! Now review and submit your clips below.
      </span>
    </p>
    <p id="box-headers">
      <span>Review</span>
      <span>Re-record</span>
    </p>
    {children}
    <ProgressButton
      percent={progress}
      disabled={false}
      onClick={onSubmit}
      text="Submit"
    />
    <ProfileActions user={user} />
  </div>
);
