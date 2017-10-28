import { h, Component } from 'preact';
import { ACCENTS, AGES, GENDER, default as User } from '../../../user';

interface Props {
  user: User;
  active: string;
}

interface State {
  email: string;
  accent: string;
  age: string;
  gender: string;
}

export default class Profile extends Component<Props, State> {
  private email: HTMLInputElement;
  private profileAccent: HTMLSelectElement;
  private profileAge: HTMLSelectElement;
  private profileGender: HTMLSelectElement;

  constructor(props: Props) {
    super(props);

    const { email, accent, age, gender } = this.props.user.getState();
    this.state = {
      email,
      accent,
      age,
      gender,
    };

    this.saveEmail = this.saveEmail.bind(this);
    this.configSendEmails = this.configSendEmails.bind(this);
    this.saveDemographics = this.saveDemographics.bind(this);
    this.update = this.update.bind(this);
  }

  private saveEmail() {
    const email = this.email.value;
    this.props.user.setEmail(email);

    this.setState({
      email,
    });
  }

  private configSendEmails(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    this.props.user.setSendEmails(el.checked);
  }

  private saveDemographics() {
    const { accent, age, gender } = this.update();

    this.props.user.setAccent(accent);
    this.props.user.setAge(age);
    this.props.user.setGender(gender);

    this.setState({
      accent,
      age,
      gender,
    });
  }

  private update() {
    const data = {
      email: this.email.value,
      accent: this.profileAccent.value,
      age: this.profileAge.value,
      gender: this.profileGender.value,
    };
    this.setState(data);
    return data;
  }

  render() {
    const { email, accent, age, gender } = this.state;
    const user = this.props.user.getState();

    // Check for modified form fields.
    const emailModified = email !== user.email;
    const accentModified = accent !== user.accent;
    const ageModified = age !== user.age;
    const genderModified = gender !== user.gender;

    return (
      <div id="profile-container" className={this.props.active}>
        <h2>Profile Data</h2>
        <label for="email">Your email address</label>
        <div className="input-and-button">
          <input
            onKeyUp={this.update}
            className={emailModified ? 'unsaved' : ''}
            type="email"
            name="email"
            tabIndex={1}
            value={email}
            ref={input => {
              this.email = input as HTMLInputElement;
            }}
          />
          <button
            onClick={this.saveEmail}
            tabIndex={3}
            className={emailModified ? 'highlight' : ''}>
            Save
          </button>
        </div>
        <div id="opt-in">
          <input
            onClick={this.configSendEmails}
            id="send-emails"
            type="checkbox"
            tabIndex={2}
            checked={user.sendEmails}
          />
          <label for="send-emails">Send me emails</label>
          <p id="email-explanation">
            I'd like to stay informed about the Common Voice Project.
          </p>
        </div>
        <hr />
        <h2>Demographic Data</h2>
        <label for="profile-accent">Your English accent</label>
        <select
          onChange={this.update}
          id="profile-accent"
          tabIndex={4}
          className={accentModified ? 'unsaved' : ''}
          ref={select => {
            this.profileAccent = select as HTMLSelectElement;
          }}>
          {this.renderOptionsFor(ACCENTS, accent)}
        </select>
        <label for="profile-age">Your age</label>
        <select
          onChange={this.update}
          id="profile-age"
          tabIndex={5}
          className={ageModified ? 'unsaved' : ''}
          ref={select => {
            this.profileAge = select as HTMLSelectElement;
          }}>
          {this.renderOptionsFor(AGES, age)}
        </select>
        <label for="profile-gender">Your gender</label>
        <select
          onChange={this.update}
          id="profile-gender"
          tabIndex={6}
          className={genderModified ? 'unsaved' : ''}
          ref={select => {
            this.profileGender = select as HTMLSelectElement;
          }}>
          {this.renderOptionsFor(GENDER, gender)}
        </select>
        <button
          id="save-demos"
          onClick={this.saveDemographics}
          tabIndex={7}
          className={
            accentModified || ageModified || genderModified
              ? 'dark highlight'
              : 'dark'
          }>
          Save changes
        </button>
      </div>
    );
  }

  private renderOptionsFor(options: any, selected: string) {
    return Object.keys(options).map(key => (
      <option value={key} selected={key === selected}>
        {options[key]}
      </option>
    ));
  }
}
