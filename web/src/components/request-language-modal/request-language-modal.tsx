const { Localized } = require('fluent-react');
import ISO6391 from 'iso-639-1';
import * as React from 'react';
import Modal from '../modal/modal';
import { SuccessIcon } from '../ui/icons';
import { Button, Hr, LabeledInput, LabeledSelect } from '../ui/ui';

const languageOptions = ISO6391.getAllCodes()
  .filter(code => code != 'en')
  .map(code => ({
    code,
    nativeName: ISO6391.getNativeName(code),
    name: ISO6391.getName(code),
  }));

interface Props {
  onRequestClose: () => void;
}

interface State {
  email: string;
  isSubmitted: boolean;
  language: string;
  sendEmails: boolean;
}

const LanguageRequestSuccess = ({ onRequestClose }: Props) => (
  <React.Fragment>
    <div className="title-and-action">
      <div />
      <Localized id="request-language-cancel">
        <a href="javascript:void(0)" onClick={onRequestClose} />
      </Localized>
    </div>

    <br />

    <SuccessIcon />

    <Localized id="request-language-success-title">
      <h2 />
    </Localized>

    <br />

    <Localized id="request-language-success-text">
      <p className="small" />
    </Localized>

    <br />

    <Localized id="return-to-cv">
      <a
        href="javascript:void(0)"
        onClick={onRequestClose}
        className="small"
        style={{ fontWeight: 'bold', color: 'black' }}
      />
    </Localized>

    <br />
    <br />
  </React.Fragment>
);

export default class RequestLanguageModal extends React.Component<
  Props,
  State
> {
  state: State = {
    email: '',
    isSubmitted: false,
    language:
      navigator.languages.find(lang => lang.split('-')[0] !== 'en') || '',
    sendEmails: false,
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  render() {
    const { email, language, isSubmitted, sendEmails } = this.state;
    return (
      <Modal
        innerClassName={
          'request-language-modal ' + (isSubmitted ? '' : 'left-align')
        }>
        {isSubmitted ? (
          <LanguageRequestSuccess onRequestClose={this.props.onRequestClose} />
        ) : (
          <React.Fragment>
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
                {languageOptions.map(({ code, nativeName, name }) => (
                  <option key={code} value={code}>
                    {nativeName} ({name})
                  </option>
                ))}
              </LabeledSelect>
            </Localized>

            <Localized id="request-language-form-email" attrs={{ label: true }}>
              <LabeledInput
                label="Email"
                name="email"
                required
                type="text"
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
              <Localized id="request-language-submit">
                <Button
                  type="button"
                  onClick={() => this.setState({ isSubmitted: true })}
                />
              </Localized>
              <div />
            </div>

            <br />

            <Localized id="stayintouch">
              <p className="small" />
            </Localized>
            <br />

            <Localized
              id="privacy-info"
              privacyLink={
                <a href="/privacy" target="__blank" rel="noopener noreferrer" />
              }>
              <p className="small" />
            </Localized>
          </React.Fragment>
        )}
      </Modal>
    );
  }
}
