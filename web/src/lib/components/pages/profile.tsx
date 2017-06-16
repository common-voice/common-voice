import { h, Component } from 'preact';
import { ACCENTS, AGES, GENDER, default as User } from '../../user';

interface Props {
  user: User;
  active: string;
}

interface State {
}

export default class Profile extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.saveEmail = this.saveEmail.bind(this);
    this.configSendEmails = this.configSendEmails.bind(this);
    this.saveDemographics = this.saveDemographics.bind(this);
  }

  private saveEmail() {
    let el = document.getElementById('email') as HTMLInputElement;
    this.props.user.setEmail(el.value);
  }

  private configSendEmails(e) {
    let el = e.currentTarget;
    this.props.user.setSendEmails(el.checked);
  }

  private saveDemographics() {
    let el = document.getElementById('profile-accent') as HTMLSelectElement;
    this.props.user.setAccent(el.options[el.selectedIndex].value);

    el = document.getElementById('profile-age') as HTMLSelectElement;
    this.props.user.setAge(el.options[el.selectedIndex].value);

    el = document.getElementById('profile-gender') as HTMLSelectElement;
    this.props.user.setGender(el.options[el.selectedIndex].value);
  }

  render() {
    let user = this.props.user.getState();

    let accentOptions = [];
    Object.keys(ACCENTS).forEach(accent => {
      accentOptions.push(
        <option value={accent} selected={user.accent === accent}>
          {ACCENTS[accent]}
        </option>);
    });

    let ageOptions = [];
    Object.keys(AGES).forEach(age => {
      ageOptions.push(
        <option value={age} selected={user.age === age}>
          {AGES[age]}
        </option>);
    });

    let genderOptions = [];
    Object.keys(GENDER).forEach(gender => {
      genderOptions.push(
        <option value={gender} selected={user.gender === gender}>
          {GENDER[gender]}
        </option>);
    });
    return <div id="profile-container" className={this.props.active}>
      <h2>Profile Data</h2>
      <div className="input-and-button">
        <label for="email">Your email address</label>
        <input id="email" type="email" name="email" value={user.email}/>
        <button onClick={this.saveEmail}>Save</button> </div>
      <div id="opt-in">
        <input onClick={this.configSendEmails} id="send-emails"
               type="checkbox" checked={user.sendEmails} />
        <label for="send-emails">Send me emails</label>
        <p id="email-explanation">
          I'd like to stay informed about the Common Voice Project.
        </p>
      </div>
      <hr />
      <h2>Demographic Data</h2>
      <label for="profile-accent">Your English accent</label>
      <select id="profile-accent">
        <option value="">--</option>
        {accentOptions}
      </select>
      <label for="profile-age">Your age</label>
      <select id="profile-age">
        <option>--</option>
        {ageOptions}
      </select>
      <label for="profile-gender">Your gender</label>
      <select id="profile-gender">
        <option>--</option>
        {genderOptions}
      </select>
      <button id="save-demos" class="dark" onClick={this.saveDemographics}>
        Save changes
      </button>
    </div>;
  }
}
