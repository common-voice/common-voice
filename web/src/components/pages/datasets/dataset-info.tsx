import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { ACCENTS, AGES } from '../../../stores/demographics';
import {
  localeConnector,
  LocalePropsFromState,
  LocalizedGetAttribute,
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

import './dataset-info.css';

const languages = Object.keys(stats.locales).length;
const globalStats = {
  total: stats.totalHrs,
  valid: stats.totalValidHrs,
  languages,
};

const DEFAULT_CATEGORY_COUNT = 2;

const Splits = ({
  category,
  values,
  locale,
}: {
  category: string;
  values: { [key: string]: number };
  locale: string;
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
                  ACCENTS[locale] ? (
                    ACCENTS[locale][key]
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

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

type State = {
  locale: string;
  showIntroTextMdDown: boolean;
  hideEmailForm: boolean;
  email: string;
  confirmSize: boolean;
  confirmNoIdentify: boolean;
};

class DatasetInfo extends React.Component<Props, State> {
  emailInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      locale: (stats.locales as any)[props.locale] ? props.locale : 'en',
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
    const { email, locale } = this.state;
    console.log(
      Object.keys(stats.locales)
        .map(locale => stats.bundleURLTemplate.replace('{locale}', locale))
        .join(' ')
    );
    await this.props.api.forLocale(locale).saveHasDownloaded(email);
  };

  render() {
    const { getString } = this.props;
    const {
      locale,
      showIntroTextMdDown,
      hideEmailForm,
      email,
      confirmSize,
      confirmNoIdentify,
    } = this.state;
    const localeStats = stats.locales[locale as keyof typeof stats.locales];
    const megabytes = Math.floor(localeStats.size / 1024 / 1024);
    const size =
      megabytes > 1024
        ? Math.floor(megabytes / 1024) + ' ' + getString('size-gigabyte')
        : megabytes + ' ' + getString('size-megabyte');
    const totalHours = Math.floor(localeStats.totalHrs);

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
                value={locale}
                onChange={(event: any) =>
                  this.setState({ locale: event.target.value })
                }>
                {Object.keys(stats.locales).map(locale => (
                  <Localized key={locale} id={locale}>
                    <option value={locale} />
                  </Localized>
                ))}
              </LabeledSelect>
              <ul className="facts">
                {Object.entries({
                  size,
                  'dataset-version': (
                    <div className="version">
                      {[locale, localeStats.totalHrs + 'h', stats.date].join(
                        '_'
                      )}
                    </div>
                  ),
                  'validated-hr-total': Math.floor(
                    localeStats.validHrs
                  ).toLocaleString(),
                  'overall-hr-total': totalHours.toLocaleString,
                  'cv-license': 'CC-0',
                  'number-of-voices': localeStats.users.toLocaleString(),
                  'audio-format': 'MP3',
                  splits: Object.entries(localeStats.splits)
                    .filter(([, values]) => Object.keys(values).length > 1)
                    .map(([category, values]) => (
                      <Splits
                        key={category}
                        {...{ category, values, locale }}
                      />
                    )),
                }).map(([id, value]) => (
                  <li key={id}>
                    <Localized id={id}>
                      <span className="label" />
                    </Localized>
                    <span className="value">{value}</span>
                  </li>
                ))}
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
                  <Localized id="why-email" b={<b />}>
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
                      <Localized id="confirm-size" b={<b />} $size={size}>
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
                      <Localized id="confirm-no-identify" b={<b />}>
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
                        ? stats.bundleURLTemplate.replace('{locale}', locale)
                        : null
                    }
                    onClick={this.saveHasDownloaded}
                    rounded
                    className="download-language"
                    style={{ minWidth: 300 }}>
                    <Localized
                      id="download-language"
                      $language={getString(locale)}>
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
              b={<b />}
              {...Object.entries(globalStats).reduce(
                (obj: any, [key, value]) => {
                  obj['$' + key] = value;
                  return obj;
                },
                {}
              )}>
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
  withLocalization(connect<PropsFromState>(mapStateToProps)(DatasetInfo))
);
