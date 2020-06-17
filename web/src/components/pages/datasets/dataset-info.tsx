import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import StateTree from '../../../stores/tree';
import { ACCENTS, AGES } from '../../../stores/demographics';
import {
  localeConnector,
  LocalePropsFromState,
  LocalizedGetAttribute,
  LocaleLink,
} from '../../locale-helpers';
import { CloudIcon } from '../../ui/icons';
import {
  Button,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
  LinkButton,
  TextButton,
} from '../../ui/ui';
import CircleStats from './circle-stats';
import stats from './stats';
import { DatasetPropsFromState } from './types';
import './dataset-info.css';
import URLS from '../../../urls';

const languages = Object.keys(stats.locales).length;
const globalStats = {
  total: stats.totalHrs,
  valid: stats.totalValidHrs,
  languages,
};

const DEFAULT_CATEGORY_COUNT = 2;

export const Splits = ({
  category,
  values,
  bundleLocale,
}: {
  category: string;
  values: { [key: string]: number };
  bundleLocale: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const categories = Object.entries(values).filter(
    ([key, value]) => key && key != 'other' && value > 0
  );
  return (
    <div key={category} className="splits">
      <LocalizedGetAttribute id={'profile-form-' + category} attribute="label">
        {label => <h5>{label}</h5>}
      </LocalizedGetAttribute>
      <ol onClick={() => setExpanded(!expanded)} tabIndex={0} role="button">
        {categories
          .sort((a, b) => (a[1] < b[1] ? 1 : -1))
          .slice(0, expanded ? categories.length : DEFAULT_CATEGORY_COUNT)
          .map(([key, value]) => (
            <li key={key}>
              <b>{Math.round(value * 100)}%</b>
              <span> </span>
              <div className="ellipsis">
                {category == 'gender' ? (
                  <Localized id={key}>
                    <span />
                  </Localized>
                ) : category == 'accent' ? (
                  ACCENTS[bundleLocale] ? (
                    ACCENTS[bundleLocale][key]
                  ) : (
                    key
                  )
                ) : category == 'age' ? (
                  (AGES as any)[key]
                ) : (
                  key
                )}
              </div>
            </li>
          ))}
        {!expanded && categories.length > DEFAULT_CATEGORY_COUNT && (
          <li key="more">...</li>
        )}
      </ol>
    </div>
  );
};

type Props = LocalePropsFromState &
  WithLocalizationProps &
  DatasetPropsFromState;

type State = {
  bundleLocale: string;
  showIntroTextMdDown: boolean;
  hideEmailForm: boolean;
  email: string;
  confirmSize: boolean;
  confirmNoIdentify: boolean;
};

export function getStats(localeStats: any, getString: Function) {
  const megabytes = localeStats.size / 1024 / 1024;
  const size =
    megabytes < 1
      ? Math.floor(megabytes * 100) / 100 + ' ' + getString('size-megabyte')
      : megabytes > 1024
      ? Math.floor(megabytes / 1024) + ' ' + getString('size-gigabyte')
      : Math.floor(megabytes) + ' ' + getString('size-megabyte');

  const totalHours =
    localeStats.totalHrs < 1
      ? Math.floor(localeStats.totalHrs * 100) / 100
      : Math.floor(localeStats.totalHrs);

  const validHours =
    localeStats.validHrs < 1
      ? Math.floor(localeStats.validHrs * 100) / 100
      : Math.floor(localeStats.validHrs);

  return {
    size,
    totalHours,
    validHours,
  };
}

export function renderStats(
  size: string,
  bundleLocale: string,
  totalHours: number,
  validHours: number
) {
  const localeStats = stats.locales[bundleLocale as keyof typeof stats.locales];
  return Object.entries({
    size,
    'dataset-version': (
      <div className="version">
        {[bundleLocale, totalHours + 'h', stats.date].join('_')}
      </div>
    ),
    'validated-hr-total': validHours.toLocaleString(),
    'overall-hr-total': totalHours.toLocaleString(),
    'cv-license': 'CC-0',
    'number-of-voices': localeStats.users.toLocaleString(),
    'audio-format': 'MP3',
    splits: Object.entries(localeStats.splits)
      .filter(([, values]) => Object.keys(values).length > 1)
      .map(([category, values]) => (
        <Splits key={category} {...{ category, values, bundleLocale }} />
      )),
  }).map(([id, value]) => (
    <li key={id}>
      <Localized id={id}>
        <span className="label" />
      </Localized>
      <span className="value">{value}</span>
    </li>
  ));
}

class DatasetInfo extends React.Component<Props, State> {
  emailInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      bundleLocale: (stats.locales as any)[props.locale] ? props.locale : 'en',
      showIntroTextMdDown: false,
      hideEmailForm: true,
      email: '',
      confirmSize: false,
      confirmNoIdentify: false,
    };
  }

  showEmailForm = () => this.setState({ hideEmailForm: false });

  handleInputChange = ({ target }: any) => {
    this.setState({
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    } as any);
  };

  saveHasDownloaded = async () => {
    // @TODO - why are we awaiting??
    const { email, bundleLocale } = this.state;
    console.log(
      Object.keys(stats.locales)
        .map(locale =>
          stats.bundleURLTemplate.replace('{locale}', bundleLocale)
        )
        .join(' ')
    );
    await this.props.api.forLocale(bundleLocale).saveHasDownloaded(email);
  };

  render() {
    const { getString } = this.props;
    const {
      bundleLocale,
      showIntroTextMdDown,
      hideEmailForm,
      email,
      confirmSize,
      confirmNoIdentify,
    } = this.state;
    const localeStats =
      stats.locales[bundleLocale as keyof typeof stats.locales];
    const { size, totalHours, validHours } = getStats(localeStats, getString);

    return (
      <div className="dataset-info">
        <div className="top">
          <div className="cloud-circle">
            <CloudIcon />
          </div>
          <div className="intro">
            <Localized id="datasets-headline">
              <h1 />
            </Localized>

            {!showIntroTextMdDown && (
              <Localized id="show-wall-of-text">
                <TextButton
                  className="hidden-lg-up"
                  onClick={() => {
                    this.setState({ showIntroTextMdDown: true });
                  }}
                />
              </Localized>
            )}

            <Localized id="datasets-positioning">
              <p className={showIntroTextMdDown ? '' : 'hidden-md-down'} />
            </Localized>
          </div>
          <div className="info">
            <div className="inner">
              <LabeledSelect
                label={getString('language')}
                name="bundle-locale"
                value={bundleLocale}
                onChange={(event: any) =>
                  this.setState({ bundleLocale: event.target.value })
                }>
                {Object.keys(stats.locales).map(locale => (
                  <Localized key={locale} id={locale}>
                    <option value={locale} />
                  </Localized>
                ))}
              </LabeledSelect>
              <ul className="facts">
                {renderStats(size, bundleLocale, totalHours, validHours)}
              </ul>
              {hideEmailForm ? (
                <>
                  <Button
                    className="show-email-form"
                    rounded
                    onClick={this.showEmailForm}>
                    <Localized id="email-to-download">
                      <span />
                    </Localized>
                    <CloudIcon />
                  </Button>
                  <Localized id="why-email" elems={{ b: <b /> }}>
                    <p className="why-email" />
                  </Localized>
                </>
              ) : (
                <>
                  <Localized id="email-input" attrs={{ label: true }}>
                    <LabeledInput
                      name="email"
                      onChange={this.handleInputChange}
                      ref={this.emailInputRef}
                      type="email"
                    />
                  </Localized>
                  <LabeledCheckbox
                    label={
                      <Localized
                        id="confirm-size"
                        elems={{ b: <b /> }}
                        vars={{ size }}>
                        <span />
                      </Localized>
                    }
                    name="confirmSize"
                    checked={confirmSize}
                    onChange={this.handleInputChange}
                    style={{ marginBottom: 40 }}
                  />
                  <LabeledCheckbox
                    label={
                      <Localized id="confirm-no-identify" elems={{ b: <b /> }}>
                        <span />
                      </Localized>
                    }
                    name="confirmNoIdentify"
                    checked={confirmNoIdentify}
                    onChange={this.handleInputChange}
                    style={{ marginBottom: 20 }}
                  />
                  <LinkButton
                    href={
                      confirmSize &&
                      confirmNoIdentify &&
                      email &&
                      this.emailInputRef.current.checkValidity()
                        ? stats.bundleURLTemplate.replace(
                            '{locale}',
                            bundleLocale
                          )
                        : null
                    }
                    onClick={this.saveHasDownloaded}
                    rounded
                    className="download-language"
                    style={{ minWidth: 300 }}>
                    <Localized
                      id="download-language"
                      vars={{ language: getString(bundleLocale) }}>
                      <span />
                    </Localized>
                    <CloudIcon />
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="description">
          <CircleStats {...globalStats} className="hidden-md-down" />
          <div className="text">
            <div className="line" />
            <Localized id="whats-inside">
              <h1 />
            </Localized>
            <CircleStats {...globalStats} className="hidden-lg-up" />
            <Localized
              id="dataset-description-hours"
              vars={globalStats}
              elems={{
                b: <b />,
                languagesLink: <LocaleLink to={URLS.LANGUAGES}></LocaleLink>,
              }}>
              <p />
            </Localized>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default localeConnector(
  withLocalization(connect<DatasetPropsFromState>(mapStateToProps)(DatasetInfo))
);
