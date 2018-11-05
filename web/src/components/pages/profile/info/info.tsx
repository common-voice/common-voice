import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import API from '../../../../services/api';
import { NATIVE_NAMES } from '../../../../services/localization';
import { ACCENTS, AGES, SEXES } from '../../../../stores/demographics';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import { DownIcon } from '../../../ui/icons';
import {
  Button,
  Hr,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
} from '../../../ui/ui';

import './info.css';

const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & LocalizationProps) => (
    <React.Fragment>
      {Object.entries(children).map(([key, value]) => (
        <option key={key} value={key}>
          {getString(key, null, value)}
        </option>
      ))}
    </React.Fragment>
  )
);

interface PropsFromState {
  api: API;
  user: User.State;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.add;
  addUploads: typeof Uploads.actions.add;
  refreshUser: typeof User.actions.refresh;
}

interface Props
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface State {
  username: string;
  visible: boolean;
  age: string;
  gender: string;
  locales: { locale: string; accent: string }[];
  sendEmails: boolean;

  isSaving: boolean;
  isSubmitted: boolean;
  privacyAgreed: boolean;
  showDemographicInfo: boolean;
}

class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);

    const { account, userClients } = props.user;

    if (!account && userClients.length == 0) {
      props.history.push('/');
    }

    this.state = {
      sendEmails: account ? Boolean(account.basket_token) : true,
      visible: false,
      locales: [],
      ...pick(props.user, 'age', 'username', 'gender'),
      ...(account
        ? pick(account, 'age', 'username', 'gender', 'locales', 'visible')
        : {
            age: userClients.reduce((init, u) => u.age || init, ''),
            gender: userClients.reduce((init, u) => u.gender || init, ''),
            locales: userClients.reduce(
              (locales, u) => locales.concat(u.locales || []),
              []
            ),
          }),

      isSaving: false,
      isSubmitted: false,
      privacyAgreed: Boolean(account) || props.user.privacyAgreed,
      showDemographicInfo: false,
    };
  }

  toggleDemographicInfo = () => {
    return this.setState({
      showDemographicInfo: !this.state.showDemographicInfo,
    });
  };

  handleChangeFor = (field: keyof State) => ({
    target,
  }: React.ChangeEvent<any>) => {
    this.setState({
      [field]: target.type == 'checkbox' ? target.checked : target.value,
    } as any);
  };

  addLocale = () => {
    const { locales } = this.state;
    if (locales.length && !locales[locales.length - 1].locale) {
      return;
    }
    this.setState({
      locales: locales.concat({ locale: '', accent: '' }),
    });
  };

  handleLocaleChangeFor = (i: number) => ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const locales = this.state.locales.slice();
    locales[i] = { locale: value, accent: '' };
    if (!value) {
      locales.splice(i, 1);
    }
    this.setState({
      locales: locales.filter(({ locale }, i2) => i2 === i || locale !== value),
    });
  };

  handleAccentChangeFor = (i: number) => ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const locales = this.state.locales.slice();
    locales[i].accent = value;
    this.setState({ locales });
  };

  submit = () => {
    const {
      addNotification,
      addUploads,
      api,
      getString,
      refreshUser,
      user,
    } = this.props;
    this.setState({ isSaving: true, isSubmitted: true }, () => {
      addUploads([
        async () => {
          await Promise.all([
            api.saveAccount({
              ...pick(
                this.state,
                'username',
                'visible',
                'age',
                'gender',
                'locales'
              ),
              client_id: user.userId,
            }),
            !(user.account && user.account.basket_token) &&
              this.state.sendEmails &&
              api.subscribeToNewsletter(user.userClients[0].email),
          ]);
          refreshUser();
          this.setState({ isSaving: false });
          addNotification(getString('profile-form-submit-saved'));
        },
      ]);
    });
  };

  render() {
    const { user } = this.props;
    const {
      username,
      sendEmails,
      visible,
      age,
      gender,
      locales,

      isSaving,
      isSubmitted,
      privacyAgreed,
      showDemographicInfo,
    } = this.state;

    if (!user.account && user.userClients.length == 0) {
      return null;
    }

    return (
      <div className="profile-info">
        {!user.account && (
          <Localized id="thanks-for-account">
            <h2 />
          </Localized>
        )}
        <Localized id="why-profile-text">
          <p />
        </Localized>

        <div
          className={
            'demographic-info ' + (showDemographicInfo ? 'expanded' : '')
          }>
          <button type="button" onClick={this.toggleDemographicInfo}>
            <Localized id="why-demographic">
              <span />
            </Localized>

            <DownIcon />
          </button>
          <Localized id="why-demographic-explanation">
            <div className="explanation" />
          </Localized>
        </div>

        <div className="form-fields">
          <Localized id="profile-form-username" attrs={{ label: true }}>
            <LabeledInput
              value={username}
              onChange={this.handleChangeFor('username')}
            />
          </Localized>
          <Localized id="leaderboard-visibility" attrs={{ label: true }}>
            <LabeledInput />
          </Localized>
          <Localized id="profile-form-age" attrs={{ label: true }}>
            <LabeledSelect value={age} onChange={this.handleChangeFor('age')}>
              <Options>{AGES}</Options>
            </LabeledSelect>
          </Localized>
          <Localized id="profile-form-gender" attrs={{ label: true }}>
            <LabeledSelect
              value={gender}
              onChange={this.handleChangeFor('gender')}>
              <Options>{SEXES}</Options>
            </LabeledSelect>
          </Localized>

          {locales.map(({ locale, accent }, i) => (
            <React.Fragment key={i}>
              <Localized id="profile-form-language" attrs={{ label: true }}>
                <LabeledSelect
                  value={locale}
                  onChange={this.handleLocaleChangeFor(i)}>
                  <option value="" />
                  {Object.entries(NATIVE_NAMES).map(([locale, name]) => (
                    <option key={locale} value={locale}>
                      {name}
                    </option>
                  ))}
                </LabeledSelect>
              </Localized>
              <Localized id="profile-form-accent" attrs={{ label: true }}>
                <LabeledSelect
                  value={accent}
                  onChange={this.handleAccentChangeFor(i)}>
                  <option value="" />
                  {ACCENTS[locale] && <Options>{ACCENTS[locale]}</Options>}
                </LabeledSelect>
              </Localized>
            </React.Fragment>
          ))}
        </div>

        <Button outline onClick={this.addLocale}>
          Add Language
        </Button>

        <Hr />

        {!(user.account && user.account.basket_token) && (
          <React.Fragment>
            <div className="signup-section">
              <Localized id="email-input" attrs={{ label: true }}>
                <LabeledInput value={user.userClients[0].email} disabled />
              </Localized>

              <div className="checkboxes">
                <Localized id="keep-me-posted" attrs={{ label: true }}>
                  <LabeledCheckbox
                    onChange={this.handleChangeFor('sendEmails')}
                    checked={sendEmails}
                  />
                </Localized>

                {!user.account &&
                  !isSubmitted && (
                    <React.Fragment>
                      <LabeledCheckbox
                        label={
                          <Localized
                            id="accept-privacy"
                            privacyLink={
                              <LocaleLink to={URLS.PRIVACY} blank />
                            }>
                            <span />
                          </Localized>
                        }
                        checked={privacyAgreed}
                        onChange={this.handleChangeFor('privacyAgreed')}
                      />

                      <Localized id="read-terms-q">
                        <LocaleLink to={URLS.TERMS} className="terms" blank />
                      </Localized>
                    </React.Fragment>
                  )}
              </div>
            </div>

            <Hr />
          </React.Fragment>
        )}

        <Localized id="profile-form-submit-save">
          <Button
            className="save"
            rounded
            disabled={isSaving || !privacyAgreed}
            onClick={this.submit}
          />
        </Localized>
      </div>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ api, user }: StateTree) => ({
    api,
    user,
  }),
  {
    addUploads: Uploads.actions.add,
    addNotification: Notifications.actions.add,
    refreshUser: User.actions.refresh,
  }
)(withLocalization(withRouter(ProfilePage)));
