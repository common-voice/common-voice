import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import { DEFAULT_LOCALE } from '../../services/localization';
import { Locale } from '../../stores/locale';
import StateTree from '../../stores/tree';
import { ACCENTS, AGES, GENDERS, User } from '../../stores/user';
import Modal from '../modal/modal';
import { Button, Hr, LabeledInput, LabeledSelect, TextButton } from '../ui/ui';
import { isContributable } from '../locale-helpers';

interface EditableUser {
  email: string;
  username: string;
  accents?: any;
  age: string;
  gender: string;
  sendEmails: boolean;
}

const userFormFields = [
  'email',
  'username',
  'age',
  'accent',
  'gender',
  'sendEmails',
];

const filterUserFields = (data: any) =>
  pick(data, userFormFields) as EditableUser;

interface PropsFromState {
  hasEnteredInfo: boolean;
  locale: Locale.State;
  user: EditableUser;
}

interface PropsFromDispatch {
  clear: () => void;
  updateUser: (state: any) => void;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {
  onExit?: () => any;
}

interface State extends EditableUser {
  accent: string;
  showClearModal: boolean;
}

class ProfileForm extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    const { locale, user } = this.props;
    this.state = {
      ...filterUserFields(user),
      accent: user.accents[isContributable(locale) ? locale : DEFAULT_LOCALE],
      showClearModal: false,
    };
  }

  componentWillReceiveProps({ locale, user }: Props) {
    if (locale !== this.props.locale) {
      this.setState({
        accent: user.accents[isContributable(locale) ? locale : DEFAULT_LOCALE],
      });
    }
  }

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
    } as any);
  };

  private save = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { locale, onExit, updateUser, user } = this.props;
    const { accent } = this.state;
    updateUser({
      ...filterUserFields(this.state),
      accents: {
        ...user.accents,
        [isContributable(locale) ? locale : DEFAULT_LOCALE]: accent,
      },
    });

    onExit && onExit();
  };

  render() {
    const { getString, hasEnteredInfo, locale, onExit, user } = this.props;
    const { email, username, accent, age, gender, sendEmails } = this.state;

    const shownLocale = isContributable(locale) ? locale : DEFAULT_LOCALE;

    const isModified =
      accent !== user.accents[shownLocale] ||
      userFormFields.filter(k => k !== 'accent').some(key => {
        const typedKey = key as keyof EditableUser;
        return this.state[typedKey] !== user[typedKey];
      });

    return (
      <div id="profile-card">
        {this.state.showClearModal && (
          <Localized id="profile-clear-modal">
            <Modal
              onRequestClose={this.toggleClearModal}
              buttons={{
                [getString('profile-keep-data')]: this.toggleClearModal,
                [getString('profile-delete-data')]: this.clear,
              }}
            />
          </Localized>
        )}

        <div className="title-and-action">
          <Localized id="profile-create">
            <h1 />
          </Localized>
          <Localized
            id={
              'profile-form-' + (onExit ? 'cancel' : hasEnteredInfo && 'delete')
            }>
            <TextButton onClick={onExit || this.toggleClearModal} />
          </Localized>
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
              <Localized id={shownLocale}>
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
              {this.renderOptionsFor({
                '': '--',
                ...ACCENTS[shownLocale],
                other: 'Other',
              })}
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
              <Button type="submit" outline={!isModified} rounded />
            </Localized>
          </div>
        </form>
      </div>
    );
  }

  private renderOptionsFor(options: any) {
    return Object.keys(options).map(key => (
      <option key={key} value={key}>
        {this.props.getString(key, null, options[key])}
      </option>
    ));
  }
}

const mapStateToProps = ({ locale, user }: StateTree) => ({
  hasEnteredInfo: User.selectors.hasEnteredInfo(user),
  locale,
  user,
});

const mapDispatchToProps = (dispatch: any) => ({
  clear: () => dispatch(User.actions.clear()),
  updateUser: (state: any) => dispatch(User.actions.update(state)),
});

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(withLocalization(ProfileForm));
