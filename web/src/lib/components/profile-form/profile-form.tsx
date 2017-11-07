import * as React from 'react';
import { ACCENTS, AGES, GENDER, default as User } from '../../user';

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
}

const CLEAR_MODAL_TEXT =
  'Clearing your profile data means this demographic information will no longer be submitted to Common Voice with' +
  'your clip recordings.';

export default class ProfileCard extends React.Component<Props, State> {
  state = this.props.user.getState();

  private clear = () => {
    if (!confirm(CLEAR_MODAL_TEXT)) return;

    const emptyState: State = {
      email: '',
      username: '',
      accent: '',
      age: '',
      gender: '',
      sendEmails: false,
    };
    this.setState(emptyState);
    this.props.user.setState(emptyState);
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
    const user = this.props.user.getState();

    const isModified = [
      'email',
      'username',
      'accent',
      'age',
      'gender',
      'sendEmails',
    ].some(key => {
      const typedKey = key as keyof State;
      return this.state[typedKey] !== user[typedKey];
    });

    return (
      <div id="profile-card">
        <div className="card-head">
          <h1>Create a Profile</h1>
          <a onClick={onExit || this.clear}>
            {onExit ? 'Exit Form' : 'Clear Form'}
          </a>
        </div>
        <br />

        <form onSubmit={this.save}>
          <label className="half-width">
            Email
            <input
              onChange={this.update}
              type="email"
              name="email"
              tabIndex={1}
              value={email}
            />
          </label>

          <label className="half-width">
            User Name
            <input
              onChange={this.update}
              type="text"
              name="username"
              tabIndex={1}
              value={username}
            />
          </label>

          <label id="opt-in">
            <input
              onChange={this.update}
              name="sendEmails"
              type="checkbox"
              tabIndex={3}
              checked={sendEmails}
            />
            Yes, send me emails. I'd like to stay informed about the Common
            Voice Project.
          </label>

          <hr />

          <label className="half-width">
            Language
            <select name="language" tabIndex={-1} disabled>
              <option value="">More languages coming soon!</option>
            </select>
          </label>

          <label className="half-width">
            Accent
            <select
              name="accent"
              onChange={this.update}
              tabIndex={4}
              value={accent}>
              {this.renderOptionsFor(ACCENTS)}
            </select>
          </label>

          <label className="half-width">
            Age
            <select name="age" onChange={this.update} tabIndex={5} value={age}>
              {this.renderOptionsFor(AGES)}
            </select>
          </label>

          <label className="half-width">
            Gender
            <select
              name="gender"
              onChange={this.update}
              tabIndex={6}
              value={gender}>
              {this.renderOptionsFor(GENDER)}
            </select>
          </label>

          <div className="buttons">
            <button
              type="submit"
              tabIndex={7}
              className={isModified ? 'dark' : ''}>
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
