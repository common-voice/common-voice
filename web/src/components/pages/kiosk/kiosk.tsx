import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../modal/modal';
import { CardAction, Button, Hr, LabeledInput } from '../../ui/ui';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { KioskProgress } from '../../../stores/kioskProgress';
import { DownloadIcon } from '../../ui/icons';
import PrivacyInfo from '../../privacy-info';
import URLS from '../../../urls';
import { RouteComponentProps, withRouter } from 'react-router';

import './kiosk.css';

interface PropsFromState {
  user: User.State;
  kioskProgress: KioskProgress.State;
}

interface PropsFromDispatch {
  updateUser: typeof User.actions.update;
  clearUser: typeof User.actions.clear;
  updateKiosk: typeof KioskProgress.actions.update;
}

interface KioskProps
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

class KioskPage extends React.Component<KioskProps> {
  state = {
    email: this.props.user.email,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.value,
    } as any);
  };

  private save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email } = this.state;
    this.props.updateUser({
      email: email,
      sendEmails: true,
      privacyAgreed: true,
    });
    this.props.updateKiosk({ isSubmitted: true });
  };

  private wizardFinish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.updateKiosk({ wizardFinished: true });
    this.props.history.push(URLS.SPEAK);
  };

  private contribFinish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.updateKiosk({
      wizardFinished: false,
      recordFinished: false,
      listenFinished: false,
      isSubmitted: false,
    });
    this.props.history.push(URLS.KIOSK);
  };

  constructor(props: KioskProps) {
    super(props);
    if (!this.props.kioskProgress.wizardFinished) {
      this.state.email = '';
      this.props.clearUser();
    }
  }

  render() {
    const {
      wizardFinished,
      recordFinished,
      listenFinished,
      isSubmitted,
    } = this.props.kioskProgress;

    const { email } = this.state;

    return (
      <div id="kiosk-container">
        <div id="common-voice-kiosk">
          <Localized id="kiosk-wizard-welcome">
            <h1 />
          </Localized>
        </div>

        {wizardFinished &&
          recordFinished &&
          listenFinished && (
            <form onSubmit={this.contribFinish}>
              <br />

              <Localized id="kiosk-wizard-congrats">
                <h3 />
              </Localized>

              <Hr />

              <Localized id="kiosk-wizard-finish">
                <Button type="submit" rounded />
              </Localized>
            </form>
          )}

        {wizardFinished &&
          !recordFinished &&
          !listenFinished && (
            <Localized id="kiosk-wizard-continue">
              <h2 />
            </Localized>
          )}

        {!wizardFinished &&
          !recordFinished &&
          !listenFinished && (
            <Localized id="kiosk-wizard-start">
              <h2 />
            </Localized>
          )}

        {!wizardFinished &&
          !isSubmitted && (
            <form onSubmit={this.save}>
              <br />

              <Localized id="kiosk-email-value" attrs={{ label: true }}>
                <LabeledInput
                  label="Email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={this.update}
                />
              </Localized>

              <Hr />

              <div className="center">
                <Localized id="kiosk-email-submit">
                  <Button disabled={!email} type="submit" rounded />
                </Localized>
                <div />
              </div>

              <br />

              <PrivacyInfo localizedPrefix="get-involved-" />
            </form>
          )}
        {!wizardFinished &&
          isSubmitted && (
            <form onSubmit={this.wizardFinish}>
              <br />

              <Localized id="kiosk-wizard-intro">
                <h3 />
              </Localized>

              <Hr />

              <Localized id="kiosk-wizard-submit">
                <Button type="submit" rounded />
              </Localized>
            </form>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
  kioskProgress: state.kioskProgress,
});

const mapDispatchToProps = {
  updateUser: User.actions.update,
  clearUser: User.actions.clear,
  updateKiosk: KioskProgress.actions.update,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(withLocalization(KioskPage))
);
