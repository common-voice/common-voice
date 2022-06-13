/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { connect } from 'react-redux';
import { Localized, LocalizationProvider } from '@fluent/react';

import Modal from '../../modal/modal';
import { SuccessIcon } from '../../ui/icons';
import API from '../../../services/api';
import { RequestedLanguages } from '../../../stores/requested-languages';
import StateTree from '../../../stores/tree';
import * as Languages from '../../../stores/languages';
import { User } from '../../../stores/user';
import PrivacyInfo from '../../privacy-info';
import { Button, Hr, LabeledInput } from '../../ui/ui';
import { ModalOptions } from './languages';

import './get-involved-modal.css';
interface PropsFromState {
  api: API;
  user: User.State;
  languages: Languages.State;
}

interface PropsFromDispatch {
  createLanguageRequest: typeof RequestedLanguages.actions.create;
  updateUser: typeof User.actions.update;
}

interface Props extends ModalOptions, PropsFromState, PropsFromDispatch {
  onRequestClose: () => void;
}

interface State {
  email: string;
  isSubmitted: boolean;
  sendEmails: boolean;
}

class GetInvolvedModal extends React.Component<Props, State> {
  state: State = {
    email: this.props.user.email || '',
    isSubmitted: false,
    sendEmails: this.props.user.sendEmails,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    } as any);
  };

  private save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { api, createLanguageRequest, locale, updateUser, user, languages } =
      this.props;
    const { email, sendEmails } = this.state;
    if (languages.nativeNames) {
      createLanguageRequest(languages.nativeNames[locale]);
    }
    updateUser({ email, sendEmails });
    this.setState({ isSubmitted: true });
    if (!user.sendEmails && sendEmails) {
      await api.subscribeToNewsletter(email);
    }
  };

  render() {
    const { locale, onRequestClose, l10n, languages } = this.props;
    const { email, isSubmitted, sendEmails } = this.state;

    const nativeName = languages.nativeNames[locale] || locale;

    return (
      <LocalizationProvider l10n={l10n}>
        <Modal
          innerClassName="get-involved-modal"
          onRequestClose={onRequestClose}>
          <br />
          <Localized id="get-involved-title" vars={{ lang: nativeName }}>
            {/* Localized injects content into child tag */}
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h2 />
          </Localized>
          <br />
          <Localized
            id="get-involved-text"
            vars={{ lang: nativeName }}
            elems={{ lineBreak: <br /> }}>
            <p />
          </Localized>
          <br />
          <div className="title-and-action">
            {!isSubmitted && (
              <Localized
                id="get-involved-form-title"
                vars={{ lang: nativeName }}>
                {/* Localized injects content into child tag */}
                {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                <h4 />
              </Localized>
            )}
          </div>
          {isSubmitted ? (
            <div className="signup-success">
              <SuccessIcon />

              <Localized
                id="get-involved-success-title"
                vars={{ language: nativeName }}>
                {/* Localized injects content into child tag */}
                {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                <h2 />
              </Localized>

              <br />

              <Localized id="get-involved-success-text">
                <p className="small" />
              </Localized>

              <br />

              <Localized id="get-involved-return-to-languages">
                <Button rounded onClick={onRequestClose} />
              </Localized>
            </div>
          ) : (
            <form onSubmit={this.save}>
              <br />

              <Localized id="get-involved-email" attrs={{ label: true }}>
                <LabeledInput
                  label="Email"
                  name="email"
                  required
                  type="email"
                  value={email}
                  onChange={this.update}
                />
              </Localized>

              <label className="opt-in">
                <input
                  name="sendEmails"
                  type="checkbox"
                  checked={sendEmails}
                  onChange={this.update}
                />
                <Localized id="get-involved-opt-in">
                  <span />
                </Localized>
              </label>

              <Hr />

              <div className="center">
                <Localized id="get-involved-submit">
                  <Button
                    disabled={!email || !sendEmails}
                    type="submit"
                    rounded
                  />
                </Localized>
                <div />
              </div>

              <br />

              <PrivacyInfo localizedPrefix="get-involved-" />
            </form>
          )}
        </Modal>
      </LocalizationProvider>
    );
  }
}

const mapStateToProps = ({ api, user, languages }: StateTree) => ({
  api,
  user,
  languages,
});

const mapDispatchToProps = {
  createLanguageRequest: RequestedLanguages.actions.create,
  updateUser: User.actions.update,
};

export default connect<PropsFromState, any>(
  mapStateToProps,
  mapDispatchToProps
)(GetInvolvedModal) as any;
