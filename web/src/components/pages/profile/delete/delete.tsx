import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { InfoIcon } from '../../../ui/icons';
import { Toggle, Hr, Button } from '../../../ui/ui';

import './delete.css';
import { COMMON_VOICE_EMAIL } from '../../../../constants';

interface PropsFromState {
  user: User.State;
}

interface Props extends WithLocalizationProps, PropsFromState {}

class DeleteProfile extends React.Component<Props, { keep: boolean }> {
  state = { keep: true };

  textareaRef = React.createRef<HTMLTextAreaElement>();

  render() {
    const { keep } = this.state;
    return (
      <div className="profile-delete">
        <div className="top">
          <h2>
            <Localized id="delete-q">
              <span />
            </Localized>
            *
          </h2>
          <Localized id="indicates-required">
            <div className="required" />
          </Localized>
        </div>
        <div className="toggle-with-info">
          <div className="toggle-container">
            <Toggle
              onText="keep"
              offText="remove"
              defaultChecked={keep}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ keep: event.target.checked });
              }}
            />
          </div>
          <div className="info">
            <InfoIcon />
            <Localized id={keep ? 'keep-info' : 'remove-info'}>
              <div />
            </Localized>
          </div>
        </div>
        {/* We're disabling this field for now */}
        {false && !keep && (
          <textarea
            placeholder={this.props.getString('why-delete-recordings')}
            ref={this.textareaRef}
          />
        )}
        <Hr />
        <Localized id="profile-form-delete">
          <Button
            rounded
            onClick={() => {
              window.open(
                `mailto:${COMMON_VOICE_EMAIL}?subject=` +
                  encodeURIComponent('Delete Profile') +
                  '&body=' +
                  encodeURIComponent(
                    (keep
                      ? 'keep my recordings'
                      : 'remove my recordings, because: ' + '\n') +
                      /*+ this.textareaRef.current.value*/ '\n' +
                      'email:' +
                      this.props.user.account.email
                  )
              );
            }}
          />
        </Localized>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ user }: StateTree) => ({ user }))(
  withLocalization(DeleteProfile)
);
