import { Localized } from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import { Button, LabeledInput, LabeledTextArea } from '../ui/ui';
import API from '../../services/api';
import StateTree from '../../stores/tree';

interface PropsFromState {
  api: API;
}

interface OwnProps {
  onRequestClose: () => void;
}

interface Props extends PropsFromState, OwnProps {}

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface State {
  email: string;
  name: string;
  message: string;
  status: Status;
}

class ContactModal extends React.Component<Props, State> {
  state: State = {
    email: '',
    name: '',
    message: '',
    status: 'idle',
  };

  private update = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [target.name]: target.value } as Pick<State, 'email' | 'name' | 'message'>);
  };

  private submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { api } = this.props;
    const { email, name, message } = this.state;

    this.setState({ status: 'submitting' });
    try {
      await api.sendContact({ email, name: name || undefined, message });
      this.setState({ status: 'success' });
    } catch {
      this.setState({ status: 'error' });
    }
  };

  render() {
    const { onRequestClose } = this.props;
    const { email, name, message, status } = this.state;

    return (
      <Modal innerClassName="contact-modal" onRequestClose={onRequestClose}>
        {status === 'success' ? (
          <div className="title-and-action">
            <Localized id="contact-title">
              <h1 />
            </Localized>
            <Localized id="contact-form-success">
              <p />
            </Localized>
            <Button onClick={onRequestClose}>
              <Localized id="close" />
            </Button>
          </div>
        ) : (
          <form onSubmit={this.submit}>
            <div className="title-and-action">
              <Localized id="contact-title">
                <h1 />
              </Localized>
            </div>

            <br />

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

            <Localized id="contact-form-name" attrs={{ label: true }}>
              <LabeledInput
                label="Name"
                name="name"
                type="text"
                value={name}
                onChange={this.update}
              />
            </Localized>

            <Localized id="contact-form-message" attrs={{ label: true }}>
              <LabeledTextArea
                label="Message"
                name="message"
                required
                rows={6}
                value={message}
                onChange={this.update}
              />
            </Localized>

            {status === 'error' && (
              <Localized id="contact-form-error">
                <p className="error" />
              </Localized>
            )}

            <div className="actions">
              <Localized id="contact-required">
                <div />
              </Localized>
              <Localized id="submit-form-action">
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                />
              </Localized>
              <div />
            </div>
          </form>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({ api });

export default connect<PropsFromState, Record<string, never>, OwnProps, StateTree>(
  mapStateToProps
)(ContactModal);
