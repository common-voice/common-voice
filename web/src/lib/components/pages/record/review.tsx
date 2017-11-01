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
    <div id="voice-submit-review">
      <h2>Review &amp; Submit</h2>
      <br />
      <p>
        Thank you for recording!<br />
        Now review and submit your clips below.
      </p>
    </div>
    <p id="box-headers">
      <span>Review</span>
      <span>Re-record</span>
    </p>
    {children}
    <br />
    <ProgressButton
      percent={progress}
      disabled={false}
      onClick={onSubmit}
      text="Submit"
    />
    <ProfileActions user={user} />
  </div>
);
