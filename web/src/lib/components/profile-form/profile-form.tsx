import * as React from 'react';
import { ACCENTS, AGES, GENDER, default as User, UserState } from '../../user';
import Modal from '../modal/modal';
import { LabeledInput, LabeledSelect } from '../ui/ui';

interface Props {
  user: User;
  onExit?: () => any;
}

interface State {
  email: string;
  username: string;
  accent: string;
  age: string;
  gender: string;
  sendEmails: boolean;
  showClearModal: boolean;
}

export default class ProfileCard extends React.Component<Props, State> {
  state = { ...this.props.user.getState(), showClearModal: false };

  private toggleClearModal = () => {
    this.setState(state => ({ showClearModal: !state.showClearModal }));
  };

  private clear = () => {
    this.setState({
      ...(this.props.user.clear() as any),
      showClearModal: false,
    });
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  private save = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { user, onExit } = this.props;
    user.setState(this.state);
    onExit && onExit();
  };

  render() {
    const { onExit } = this.props;
    const { email, username, accent, age, gender, sendEmails } = this.state;
    const userState = this.props.user.getState();

    const isModified = [
      'email',
      'username',
      'accent',
      'age',
      'gender',
      'sendEmails',
    ].some(key => {
      const typedKey = key as keyof UserState;
      return this.state[typedKey] !== userState[typedKey];
    });

    return (
      <div id="profile-card">
        {this.state.showClearModal && (
          <Modal
            onRequestClose={this.toggleClearModal}
            buttons={{
              'Keep Data': this.toggleClearModal,
              'Delete Data': this.clear,
            }}>
            Clearing your profile data means this demographic information will
            no longer be submitted to Common Voice with your clip recordings.
          </Modal>
        )}

        <div className="title-and-action">
          <h1>Create a Profile</h1>
          <a onClick={onExit || this.toggleClearModal}>
            {onExit
              ? 'Exit Form'
              : this.props.user.hasEnteredInfo() && 'Clear Form'}
          </a>
        </div>
        <br />

        <form onSubmit={this.save}>
          <LabeledInput
            className="half-width"
            label="Email"
            name="email"
            onChange={this.update}
            type="email"
            value={email}
          />

          <LabeledInput
            className="half-width"
            label="User Name"
            name="username"
            onChange={this.update}
            type="text"
            value={username}
          />

          <label id="opt-in">
            <input
              onChange={this.update}
              name="sendEmails"
              type="checkbox"
              checked={sendEmails}
            />
            Yes, send me emails. I'd like to stay informed about the Common
            Voice Project.
          </label>

          <hr />

          <LabeledSelect
            className="half-width"
            disabled
            label="Language"
            name="language"
            tabIndex={-1}>
            <option value="">More languages coming soon!</option>
          </LabeledSelect>

          <LabeledSelect
            className="half-width"
            label="Accent"
            name="accent"
            onChange={this.update}
            value={accent}>
            {this.renderOptionsFor(ACCENTS)}
          </LabeledSelect>

          <LabeledSelect
            className="half-width"
            label="Age"
            name="age"
            onChange={this.update}
            value={age}>
            {this.renderOptionsFor(AGES)}
          </LabeledSelect>

          <LabeledSelect
            className="half-width"
            label="Gender"
            name="gender"
            onChange={this.update}
            value={gender}>
            {this.renderOptionsFor(GENDER)}
          </LabeledSelect>

          <div className="buttons">
            <button type="submit" className={isModified ? 'dark' : ''}>
              {isModified ? 'SAVE' : 'SAVED'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  private renderOptionsFor(options: any) {
    return Object.keys(options).map(key => (
      <option key={key} value={key}>
        {options[key]}
      </option>
    ));
  }
}
