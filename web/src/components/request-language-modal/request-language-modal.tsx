import { Localized } from 'fluent-react';
import ISO6391 from 'iso-639-1';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import { Button, Hr, LabeledInput, LabeledSelect } from '../ui/ui';
import { RequestedLanguages } from '../../stores/requested-languages';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import PrivacyInfo from '../privacy-info';
import LanguageAutocomplete from './language-autocomplete';
import LanguageRequestSuccess from './language-request-success';

const languageOptions = ISO6391.getAllCodes()
  .filter(code => code != 'en')
  .map(code => ({
    nativeName: ISO6391.getNativeName(code),
    name: ISO6391.getName(code),
  }));

interface PropsFromState {
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
    language: ISO6391.getName(
      navigator.languages.find(lang => lang.split('-')[0] !== 'en')
    ),
    otherLanguage: '',
    sendEmails: this.props.user.sendEmails,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  private updateOtherLanguage = (otherLanguage: string) => {
    this.setState({ otherLanguage });
  };

  private save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, language, otherLanguage, sendEmails } = this.state;
    this.props.createLanguageRequest(
      language == 'other' ? otherLanguage : language
    );
    this.props.updateUser({ email, sendEmails });
    this.setState({ isSubmitted: true });
  };

  render() {
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
        }>
        {isSubmitted ? (
          <LanguageRequestSuccess onRequestClose={this.props.onRequestClose} />
        ) : (
          <form onSubmit={this.save}>
            <div className="title-and-action">
              <Localized id="request-language-title">
                <h2 />
              </Localized>
              <Localized id="request-language-cancel">
                <a
                  href="javascript:void(0)"
                  onClick={this.props.onRequestClose}
                />
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
                <option value="">Select a Language...</option>
                {languageOptions.map(({ nativeName, name }) => (
                  <option key={name} value={name}>
                    {nativeName} ({name})
                  </option>
                ))}
                <option value="other">Other</option>
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

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
});

const mapDispatchToProps = {
  createLanguageRequest: RequestedLanguages.actions.create,
  updateUser: User.actions.update,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(RequestLanguageModal);
