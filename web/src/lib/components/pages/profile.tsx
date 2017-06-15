import { h, Component } from 'preact';
import User from '../../user';

interface Props {
  user: User;
  active: string;
}

interface State {

}

export default class Home extends Component<Props, State> {
  render() {
    return <div id="profile-container" className={this.props.active}>
      <h2>Profile Data</h2>
      <div className="input-and-button">
        <label for="email">Your email address</label>
        <input id="email" type="email" />
        <button>Save</button>
      </div>
      <div id="opt-in">
        <input id="send-emails" type="checkbox" />
        <label for="send-emails">Send me emails</label>
        <p id="email-explanation">
          I'd like to stay informed about the Common Voice Project.
        </p>
      </div>
      <hr />
      <h2>Demographic Data</h2>
      <label for="profile-accent">Your English accent</label>
      <select id="profile-accent">
        <option>--</option>
        <option>United States</option>
        <option>England</option>
        <option>Scotland</option>
        <option>Wales</option>
        <option>Ireland</option>
        <option>Canada</option>
        <option>
          West Indies and Bermuda (Bahamas, Bermuda, Jamaica, Trinidad)
        </option>
        <option>Australia</option>
        <option>New Zealand</option>
        <option>South Atlantic (Falkland Islands, Saint Helena, )</option>
        <option>Southern Africa (South Africa, Zimbabwe, Namibia)</option>
        <option>Philippines</option>
        <option>Hong Kong</option>
        <option>Malaysia</option>
        <option>Singapore</option>
      </select>
      <label for="profile-age">Your age</label>
      <select id="profile-age">
        <option>--</option>
        <option>&lt; 19</option>
        <option>19 - 29</option>
        <option>30 - 39</option>
        <option>40 - 49</option>
        <option>50 - 59</option>
        <option>60 - 69</option>
        <option>70 - 79</option>
        <option>80 - 89</option>
        <option>&gt; 89</option>
      </select>
      <label for="profile-gender">Your gender</label>
      <select id="profile-gender">
        <option>--</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>;
  }
}
