import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../../stores/tree';
import { ACCENTS, AGES, GENDERS, User } from '../../stores/user';
import Modal from '../modal/modal';
import { Button, Hr, LabeledInput, LabeledSelect } from '../ui/ui';
const { Localized } = require('fluent-react');

interface EditableUser {
  email: string;
  username: string;
  accent: string;
  age: string;
  gender: string;
  sendEmails: boolean;
}

const userFormFields = [
  'email',
  'username',
  'accent',
  'age',
  'gender',
  'sendEmails',
];

const filterUserFields = (data: any) =>
  pick(data, userFormFields) as EditableUser;

interface PropsFromState {
  user: EditableUser;
  hasEnteredInfo: boolean;
}

interface PropsFromDispatch {
  clear: () => void;
  updateUser: (state: any) => void;
}

interface Props extends PropsFromState, PropsFromDispatch {
  onExit?: () => any;
}

interface State extends EditableUser {
  showClearModal: boolean;
}

class ProfileForm extends React.Component<Props, State> {
  state = { ...filterUserFields(this.props.user), showClearModal: false };

  private toggleClearModal = () => {
    this.setState(state => ({ showClearModal: !state.showClearModal }));
  };

  private clear = () => {
    this.props.clear();
    // We have to use setTimeout here because the new user-props will only be available after the next tick
    setTimeout(() => {
      this.setState({
        ...filterUserFields(this.props.user),
        showClearModal: false,
      });
    });
  };

  private update = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  private save = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { updateUser, onExit } = this.props;
    updateUser(filterUserFields(this.state));

    onExit && onExit();
  };

  render() {
    const { hasEnteredInfo, onExit, user } = this.props;
    const { email, username, accent, age, gender, sendEmails } = this.state;

    const isModified = userFormFields.some(key => {
      const typedKey = key as keyof EditableUser;
      return this.state[typedKey] !== user[typedKey];
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
          <a
            href="javascript:void(0)"
            onClick={onExit || this.toggleClearModal}>
            {onExit ? 'Exit Form' : hasEnteredInfo && 'Delete Profile'}
          </a>
        </div>
        <br />

        <form onSubmit={this.save}>
          <Localized id="email-input" attrs={{ label: true }}>
            <LabeledInput
              className="half-width"
              label="Email"
              name="email"
              onChange={this.update}
              type="email"
              value={email}
            />
          </Localized>

          <Localized id="profile-form-username" attrs={{ label: true }}>
            <LabeledInput
              className="half-width"
              label="User Name"
              name="username"
              onChange={this.update}
              type="text"
              value={username}
            />
          </Localized>

          <label className="opt-in">
            <input
              onChange={this.update}
              name="sendEmails"
              type="checkbox"
              checked={sendEmails}
            />
            <Localized id="yes-receive-emails">
              <span />
            </Localized>
          </label>

          <Hr />

          <Localized id="profile-form-language" attrs={{ label: true }}>
            <LabeledSelect
              className="half-width"
              disabled
              label="Language"
              name="language"
              tabIndex={-1}>
              <Localized id="profile-form-more-languages">
                <option value="" />
              </Localized>
            </LabeledSelect>
          </Localized>

          <Localized id="profile-form-accent" attrs={{ label: true }}>
            <LabeledSelect
              className="half-width"
              label="Accent"
              name="accent"
              onChange={this.update}
              value={accent}>
              {this.renderOptionsFor(ACCENTS)}
            </LabeledSelect>
          </Localized>

          <Localized id="profile-form-age" attrs={{ label: true }}>
            <LabeledSelect
              className="half-width"
              label="Age"
              name="age"
              onChange={this.update}
              value={age}>
              {this.renderOptionsFor(AGES)}
            </LabeledSelect>
          </Localized>

          <Localized id="profile-form-gender" attrs={{ label: true }}>
            <LabeledSelect
              className="half-width"
              label="Gender"
              name="gender"
              onChange={this.update}
              value={gender}>
              {this.renderOptionsFor(GENDERS)}
            </LabeledSelect>
          </Localized>

          <div className="buttons">
            <Localized
              id={'profile-form-submit-' + (isModified ? 'save' : 'saved')}>
              <Button type="submit" outline={!isModified} />
            </Localized>
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

const mapStateToProps = ({ user }: StateTree) => ({
  user,
  hasEnteredInfo: User.selectors.hasEnteredInfo(user),
});

const mapDispatchToProps = (dispatch: any) => ({
  clear: () => dispatch(User.actions.clear()),
  updateUser: (state: any) => dispatch(User.actions.update(state)),
});

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm);
