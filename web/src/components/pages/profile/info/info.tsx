import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { NATIVE_NAMES } from '../../../../services/localization';
import { ACCENTS, AGES, SEXES } from '../../../../stores/demographics';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import { Button, LabeledInput, LabeledSelect } from '../../../ui/ui';

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

interface State {
  username: string;
  visible: boolean;
  age: string;
  gender: string;
  locales: { locale: string; accent: string }[];
}

class ProfilePage extends React.Component<PropsFromState, State> {
  constructor(props: PropsFromState, context: any) {
    super(props, context);

    const { account, userClients } = props.user;

    this.state = {
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
    };
  }

  handleChangeFor = (field: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    this.setState({ [field]: event.target.value } as any);
  };

  addLocale = () => {
    const { locales } = this.state;
    if (!locales[locales.length - 1].locale) {
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

  submit = async () => {
    const { api, user } = this.props;
    await api.saveAccount({
      ...pick(this.state, 'username', 'visible', 'age', 'gender', 'locales'),
      client_id: user.userId,
    });
  };

  render() {
    const { user } = this.props;
    const { username, visible, age, gender, locales } = this.state;
    return (
      <div>
        {!user.account && (
          <Localized id="thanks-for-account">
            <h2 />
          </Localized>
        )}
        <Localized id="why-profile-text">
          <p />
        </Localized>

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
          <React.Fragment key={locale}>
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
            <Localized
              id="profile-form-accent"
              attrs={this.handleAccentChangeFor(i)}>
              <LabeledSelect value={accent} onChange={() => true}>
                <option value="" />
                {ACCENTS[locale] && <Options>{ACCENTS[locale]}</Options>}
              </LabeledSelect>
            </Localized>
          </React.Fragment>
        ))}
        <Button outline onClick={this.addLocale}>
          Add Language
        </Button>

        <Localized id="profile-form-submit-save">
          <Button rounded onClick={this.submit} />
        </Localized>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api, user }: StateTree) => ({
  api,
  user,
}))(ProfilePage);
