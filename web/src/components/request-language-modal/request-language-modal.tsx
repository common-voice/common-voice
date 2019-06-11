import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import { Button, Hr, LabeledInput, LabeledSelect } from '../ui/ui';
import API from '../../services/api';
import { NATIVE_NAMES } from '../../services/localization';
import { RequestedLanguages } from '../../stores/requested-languages';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import PrivacyInfo from '../privacy-info';
import LanguageAutocomplete from './language-autocomplete';
import LanguageRequestSuccess from './language-request-success';

interface PropsFromState {
  api: API;
  user: User.State;
}

interface PropsFromDispatch {
  createLanguageRequest: typeof RequestedLanguages.actions.create;
  updateUser: typeof User.actions.update;
}

interface Props extends PropsFromState, PropsFromDispatch {
  onRequestClose: () => void;
}

interface State {
  email: string;
  isSubmitted: boolean;
  language: string;
  otherLanguage: string;
  sendEmails: boolean;
}

class RequestLanguageModal extends React.Component<Props, State> {
  state: State = {
    email: this.props.user.email,
    isSubmitted: false,
    language:
      NATIVE_NAMES[
        navigator.languages.find(lang => lang.split('-')[0] !== 'en')
      ],
    otherLanguage: '',
    sendEmails: this.props.user.sendEmails,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    } as any);
  };

  private updateOtherLanguage = (otherLanguage: string) => {
    this.setState({ otherLanguage });
  };

  private save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { api, createLanguageRequest, updateUser, user } = this.props;
    const { email, language, otherLanguage, sendEmails } = this.state;

    createLanguageRequest(language == 'other' ? otherLanguage : language);
    if (!user.sendEmails && sendEmails) {
      await api.subscribeToNewsletter(email);
    }
    updateUser({ email, sendEmails });
    this.setState({ isSubmitted: true });
  };

  render() {
    const { onRequestClose } = this.props;
    const {
      email,
      language,
      otherLanguage,
      isSubmitted,
      sendEmails,
    } = this.state;
    return (
      <Modal
        innerClassName={
          'request-language-modal ' + (isSubmitted ? '' : 'left-align')
        }
        onRequestClose={onRequestClose}>
        {isSubmitted ? (
          <LanguageRequestSuccess onRequestClose={onRequestClose} />
        ) : (
          <form onSubmit={this.save}>
            <div className="title-and-action">
              <Localized id="request-language-title">
                <h2 />
              </Localized>
            </div>

            <br />

            <Localized
              id="request-language-form-language"
              attrs={{ label: true }}>
              <LabeledSelect
                name="language"
                required
                value={language}
                onChange={this.update}>
                <Localized id="select-language">
                  <option value="" />
                </Localized>
                {Object.entries(NATIVE_NAMES).map(([code, name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <Localized id="other">
                  <option value="other" />
                </Localized>
              </LabeledSelect>
            </Localized>

            {language == 'other' && (
              <LanguageAutocomplete onChange={this.updateOtherLanguage} />
            )}

            <Localized id="email-input" attrs={{ label: true }}>
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
              <Localized id="yes-receive-emails">
                <span />
              </Localized>
            </label>

            <Hr />

            <div className="actions">
              <Localized id="submit-form-action">
                <Button
                  disabled={
                    !email || (language == 'other' ? !otherLanguage : !language)
                  }
                  type="submit"
                  rounded
                />
              </Localized>
              <div />
            </div>

            <br />

            <PrivacyInfo />
          </form>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = ({ api, user }: StateTree) => ({
  api,
  user,
});

const mapDispatchToProps = {
  createLanguageRequest: RequestedLanguages.actions.create,
  updateUser: User.actions.update,
};

export default connect<PropsFromState, any>(
  mapStateToProps,
  mapDispatchToProps
)(RequestLanguageModal) as any;
