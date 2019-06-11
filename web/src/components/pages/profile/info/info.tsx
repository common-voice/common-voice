import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
const pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
const { Tooltip } = require('react-tippy');
import { RouteComponentProps, withRouter } from 'react-router';
import API from '../../../../services/api';
import { NATIVE_NAMES } from '../../../../services/localization';
import { trackProfile } from '../../../../services/tracker';
import { ACCENTS, AGES, SEXES } from '../../../../stores/demographics';
import { Locale } from '../../../../stores/locale';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import TermsModal from '../../../terms-modal';
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
  locale: Locale.State;
  user: User.State;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
  addUploads: typeof Uploads.actions.add;
  saveAccount: typeof User.actions.saveAccount;
}

interface Props
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

type Locales = { locale: string; accent: string }[];

interface State {
  username: string;
  visible: number | string;
  age: string;
  gender: string;
  locales: Locales;
  sendEmails: boolean;

  isSaving: boolean;
  isSubmitted: boolean;
  privacyAgreed: boolean;
  showDemographicInfo: boolean;
  termsStatus: null | 'show' | 'agreed';
}

class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);

    const { account, userClients } = props.user;

    if (!account && userClients.length == 0) {
      props.history.push('/');
    }

    let locales: Locales = [];
    if (!account) {
      locales = userClients.reduce(
        (locales, u) => locales.concat(u.locales || []),
        []
      );
      locales = locales.filter(
        (l1, i) => i == locales.findIndex(l2 => l2.locale == l1.locale)
      );
    }

    this.state = {
      sendEmails: account && Boolean(account.basket_token),
      visible: 0,
      locales,
      ...pick(props.user, 'age', 'username', 'gender'),
      ...(account
        ? pick(account, 'age', 'username', 'gender', 'locales', 'visible')
        : {
            age: userClients.reduce((init, u) => u.age || init, ''),
            gender: userClients.reduce((init, u) => u.gender || init, ''),
          }),

      isSaving: false,
      isSubmitted: false,
      privacyAgreed: Boolean(account) || props.user.privacyAgreed,
      showDemographicInfo: false,
      showTermsModal: false,
    };
  }

  toggleDemographicInfo = () => {
    this.setState({
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
      locale,
      user,
      saveAccount,
    } = this.props;
    if (!user.account) {
      trackProfile('create', locale);

      if (this.state.termsStatus == null) {
        this.setState({ termsStatus: 'show' });
        return;
      }
    }
    this.setState(
      { isSaving: true, isSubmitted: true, termsStatus: 'agreed' },
      () => {
        addUploads([
          async () => {
            if (
              !(user.account && user.account.basket_token) &&
              this.state.sendEmails
            ) {
              await api.subscribeToNewsletter(user.userClients[0].email);
            }
            saveAccount({
              ...pick(this.state, 'username', 'age', 'gender'),
              locales: this.state.locales.filter(l => l.locale),
              visible: JSON.parse(this.state.visible.toString()),
              client_id: user.userId,
            });
            this.setState({ isSaving: false });
            addNotification(getString('profile-form-submit-saved'));
          },
        ]);
      }
    );
  };

  render() {
    const { getString, locale, user } = this.props;
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
      termsStatus,
    } = this.state;

    if (!user.account && user.userClients.length == 0) {
      return null;
    }

    return (
      <div className="profile-info">
        {termsStatus == 'show' && (
          <TermsModal
            onAgree={this.submit}
            onDisagree={() => this.setState({ termsStatus: null })}
          />
        )}
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
            <LabeledSelect
              value={visible.toString()}
              onChange={this.handleChangeFor('visible')}>
              <Localized id="hidden">
                <option value={0} />
              </Localized>
              <Localized id="visible">
                <option value={1} />
              </Localized>
            </LabeledSelect>
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
              <Localized
                id={
                  i == 0
                    ? 'profile-form-native-language'
                    : 'profile-form-additional-language'
                }
                attrs={{ label: true }}>
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

        <Button className="add-language" outline onClick={this.addLocale}>
          <Localized id="add-language">
            <span />
          </Localized>
          <span>+</span>
        </Button>

        <Hr />

        {!(user.account && user.account.basket_token) && (
          <React.Fragment>
            <div className="signup-section">
              <Tooltip
                arrow
                html={getString('change-email-setings')}
                theme="grey-tooltip">
                <Localized id="email-input" attrs={{ label: true }}>
                  <LabeledInput value={user.userClients[0].email} disabled />
                </Localized>
              </Tooltip>

              <div className="checkboxes">
                <LabeledCheckbox
                  label={
                    <Localized id="email-opt-in-info">
                      <span />
                    </Localized>
                  }
                  onChange={this.handleChangeFor('sendEmails')}
                  checked={sendEmails}
                />

                {!user.account && !isSubmitted && (
                  <React.Fragment>
                    <LabeledCheckbox
                      label={
                        <Localized
                          id="accept-privacy"
                          privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
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

export default connect<PropsFromState, any>(
  ({ api, locale, user }: StateTree) => ({
    api,
    locale,
    user,
  }),
  {
    addUploads: Uploads.actions.add,
    addNotification: Notifications.actions.addPill,
    saveAccount: User.actions.saveAccount,
  }
)(withLocalization(withRouter(ProfilePage)));
