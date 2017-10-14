import { h, Component } from 'preact';
import { ACCENTS, AGES, GENDER, default as User } from '../../user';

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
  constructor(props: Props) {
    super(props);

    let user = this.props.user.getState();
    this.state = {
      email: user.email,
      accent: user.accent,
      age: user.age,
      gender: user.gender,
    };

    this.saveEmail = this.saveEmail.bind(this);
    this.configSendEmails = this.configSendEmails.bind(this);
    this.saveDemographics = this.saveDemographics.bind(this);
    this.update = this.update.bind(this);
  }

  private saveEmail() {
    let el = document.getElementById('email') as HTMLInputElement;
    let email = el.value;
    this.props.user.setEmail(email);

    this.setState({
      email: email,
    });

    this.render();
  }

  private configSendEmails(e: Event) {
    let el = e.currentTarget as HTMLInputElement;
    this.props.user.setSendEmails(el.checked);
  }

  private saveDemographics() {
    let el = document.getElementById('profile-accent') as HTMLSelectElement;
    let accent = el.options[el.selectedIndex].value;
    this.props.user.setAccent(accent);

    el = document.getElementById('profile-age') as HTMLSelectElement;
    let age = el.options[el.selectedIndex].value;
    this.props.user.setAge(age);

    el = document.getElementById('profile-gender') as HTMLSelectElement;
    let gender = el.options[el.selectedIndex].value;
    this.props.user.setGender(gender);

    this.setState({
      accent: accent,
      age: age,
      gender: gender,
    });

    this.render();
  }

  private update() {
    let user = this.props.user.getState();

    let el = document.getElementById('email') as HTMLInputElement;
    let email = el.value;
    let select = document.getElementById('profile-accent') as HTMLSelectElement;
    let accent = select.options[select.selectedIndex].value;
    select = document.getElementById('profile-age') as HTMLSelectElement;
    let age = select.options[select.selectedIndex].value;
    select = document.getElementById('profile-gender') as HTMLSelectElement;
    let gender = select.options[select.selectedIndex].value;

    this.setState({
      email: email,
      accent: accent,
      age: age,
      gender: gender,
    });
  }

  render() {
    let user = this.props.user.getState();

    // Check for modified form fields.
    let emailModified = this.state.email !== user.email;
    let accentModified = this.state.accent !== user.accent;
    let ageModified = this.state.age !== user.age;
    let genderModified = this.state.gender !== user.gender;

    let accentOptions: any[] = [];
    Object.keys(ACCENTS).forEach(accent => {
      accentOptions.push(
        <option value={accent} selected={this.state.accent === accent}>
          {ACCENTS[accent]}
        </option>
      );
    });

    let ageOptions: any[] = [];
    Object.keys(AGES).forEach(age => {
      ageOptions.push(
        <option value={age} selected={this.state.age === age}>
          {AGES[age]}
        </option>
      );
    });

    let genderOptions: any[] = [];
    Object.keys(GENDER).forEach(gender => {
      genderOptions.push(
        <option value={gender} selected={this.state.gender === gender}>
          {GENDER[gender]}
        </option>
      );
    });

    return (
      <div id="profile-container" className={this.props.active}>
        <h2>Profile Data</h2>
        <label for="email">Your email address</label>
        <div className="input-and-button">
          <input
            onKeyUp={this.update}
            className={emailModified ? 'unsaved' : ''}
            id="email"
            type="email"
            name="email"
            tabIndex={1}
            value={this.state.email}
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
          className={accentModified ? 'unsaved' : ''}>
          {accentOptions}
        </select>
        <label for="profile-age">Your age</label>
        <select
          onChange={this.update}
          id="profile-age"
          tabIndex={5}
          className={ageModified ? 'unsaved' : ''}>
          {ageOptions}
        </select>
        <label for="profile-gender">Your gender</label>
        <select
          onChange={this.update}
          id="profile-gender"
          tabIndex={6}
          className={genderModified ? 'unsaved' : ''}>
          {genderOptions}
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
}
