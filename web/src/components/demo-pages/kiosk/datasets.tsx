import * as React from 'react';
import {
  getStats,
  renderStats,
  mapStateToProps,
  PropsFromState,
} from '../../pages/datasets/dataset-info';
import stats from '../../pages/datasets/stats';
import {
  Localized,
  LocalizationProps,
  withLocalization,
} from 'fluent-react/compat';
import {
  LinkButton,
  LabeledSelect,
  LabeledInput,
  LabeledCheckbox,
  TextButton,
} from '../../ui/ui';
import { CloudIcon, ChevronRight, ArrowRight } from '../../ui/icons';
import urls from '../../../urls';
import CircleStats from '../../pages/datasets/circle-stats';
import {
  PageContentType,
  DownloadFormProps,
  SubscribeFormProps,
} from './types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  useLocale,
  localeConnector,
  LocalePropsFromState,
} from '../../locale-helpers';
import KioskCard from './kiosk-card';

const DownloadForm = ({
  getString,
  size,
  bundleLocale,
  api,
}: DownloadFormProps) => {
  const emailRef = React.useRef<HTMLInputElement>();
  const [formState, setFormState] = React.useState({
    email: '',
    confirmNoIdentify: false,
    confirmSize: false,
  });

  const handleInputChange = ({ target }: any) => {
    setFormState(prev => ({
      ...prev,
      [target.name]: target.checked,
    }));
  };

  return (
    <>
      <LabeledInput
        required={true}
        type="email"
        ref={emailRef}
        onChange={handleInputChange}
        value={formState.email}
        label={getString('demo-email-input')}
        id="download__sub--form-email"
      />
      <LabeledCheckbox
        className="demo-datasets--download__sub-checkbox"
        onChange={handleInputChange}
        checked={formState.confirmSize}
        label={
          <Localized id="confirm-size" b={<b />} $size={size}>
            <span />
          </Localized>
        }
        name="confirmSize"
      />
      <LabeledCheckbox
        className="demo-datasets--download__sub-checkbox"
        onChange={handleInputChange}
        checked={formState.confirmNoIdentify}
        label={
          <Localized id="confirm-no-identify" b={<b />}>
            <span />
          </Localized>
        }
        name="confirmNoIdentify"
      />
      <LinkButton
        rounded={true}
        id="demo--download__sub-download-button"
        href={
          emailRef.current &&
          emailRef.current.checkValidity() &&
          formState.confirmNoIdentify &&
          formState.confirmSize
            ? stats.bundleURLTemplate.replace('{locale}', bundleLocale)
            : null
        }
        onClick={() => {
          api.forLocale(bundleLocale).saveHasDownloaded(formState.email);
        }}>
        <span>
          <Localized id="download-language" $language={getString(bundleLocale)}>
            <span />
          </Localized>
        </span>
        <CloudIcon />
      </LinkButton>
    </>
  );
};

const SubscribeForm = ({ getString, api }: SubscribeFormProps) => {
  const [_, toLocaleRoute] = useLocale();
  const [formState, setFormState] = React.useState({
    email: '',
    confirmNoIdentify: false,
  });
  const emailRef = React.useRef<HTMLInputElement>();

  const handleInputChange = ({ target }: any) => {
    setFormState(prev => ({
      ...prev,
      [target.name]: target.type === 'email' ? target.value : target.checked,
    }));
  };
  return (
    <div className="demo-datasets--subscribe">
      <Localized id="demo-subscribe">
        <h2 id="demo-subscribe__header" />
      </Localized>
      <form id="demo-dataset--subscribe__form">
        <div id="subscribe__form--email-container">
          <LabeledInput
            onChange={handleInputChange}
            ref={emailRef}
            type="email"
            id="subscribe__form--email"
            label={getString('demo-email-input')}
          />
          <TextButton
            disabled={
              !formState.email ||
              !emailRef.current ||
              !emailRef.current.checkValidity() ||
              !formState.confirmNoIdentify
            }
            type="submit"
            id="subscribe__form--submit">
            <ArrowRight />
          </TextButton>
        </div>
        <LabeledCheckbox
          onChange={handleInputChange}
          value={formState.confirmNoIdentify}
          label={
            <Localized id="confirm-no-identify" b={<b />}>
              <span />
            </Localized>
          }
          name="confirmNoIdentify"
        />
        <Link to={toLocaleRoute(urls.PRIVACY)} id="subscribe__form--privacy">
          Privacy Policy
        </Link>
      </form>
    </div>
  );
};

const ConnectedSubscribeForm = connect<PropsFromState>(mapStateToProps)(
  SubscribeForm
);
const ConnectedDownloadForm = connect<PropsFromState>(mapStateToProps)(
  DownloadForm
);

type ContentProps = LocalePropsFromState & LocalizationProps;
interface CardProps extends LocalizationProps {}

export const datasets = (): PageContentType => {
  const ContentComponent = ({ getString, locale }: ContentProps) => {
    const [bundleLocale, setBundleLocale] = React.useState(
      (stats.locales as any)[locale] ? locale : 'en'
    );
    const localeStats =
      stats.locales[bundleLocale as keyof typeof stats.locales];
    const data = getStats(localeStats, getString);
    const { size, totalHours, validHours } = data;
    const languages = Object.keys(stats.locales).length;
    const globalStats = {
      total: stats.totalHrs,
      valid: stats.totalValidHrs,
      languages,
    };
    return (
      <div id="demo-datasets-content-container">
        <div className="grey-bg">
          <div className="demo-datasets--download">
            <Localized id="demo-download-dataset">
              <h1 id="demo-datasets--download__header" />
            </Localized>
            <div className="demo-datasets--download--box">
              <Localized id="demo-datasets-building">
                <h1 id="demo-datasets--download--box__header" />
              </Localized>
              <Localized id="demo-datasets-body">
                <p id="demo-datasets-body--box__body" />
              </Localized>
              <Localized id="demo-datasets-box-link">
                {/*TODO: set href for this*/}
                <a id="demo-datasets-body--box__link" href="#" />
              </Localized>
            </div>
          </div>
          <div className="demo-datasets--download__sub">
            <LabeledSelect
              label={getString('demo-dataset-download-lang-select')}
              id="demo-datasets-lang-select"
              onChange={(event: any) => {
                setBundleLocale(event.target.value);
              }}
              value={bundleLocale}>
              {Object.keys(stats.locales).map(locale => (
                <Localized key={locale} id={locale}>
                  <option value={locale} />
                </Localized>
              ))}
            </LabeledSelect>
            <ul className="facts">
              {renderStats(size, bundleLocale, totalHours, validHours)}
            </ul>
            <ConnectedDownloadForm
              getString={getString}
              size={size}
              bundleLocale={bundleLocale}
            />
          </div>
        </div>
        <div className="white-bg">
          <div className="demo-datasets--eofyr">
            <hr id="hr-gradient-fill" />
            <Localized id="demo-eofy-header">
              <h1 id="demo-datasets--eofyr__header" />
            </Localized>
            <Localized id="demo-eofy-sub_header">
              <p id="demo-datasets--eofyr__subheader" />
            </Localized>
            <div className="demo-datasets-stats">
              <CircleStats {...globalStats} />
            </div>
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
              <p className="demo-datasets--eofy__body" />
            </Localized>
          </div>
        </div>
        <ConnectedSubscribeForm {...{ getString }} />
      </div>
    );
  };

  const CardComponent = ({ getString }: CardProps) => (
    <>
      <KioskCard.Top>
        <div id="demo-datasets--button">
          <div id="language-select-card--cloud-ui-inner-circle">
            <CloudIcon />
          </div>
          <div id="language-select-card--cloud-ui-circle"></div>
        </div>
      </KioskCard.Top>
      <KioskCard.Body>
        <div id="demo-datasets--card__body">
          <Localized id="demo-language-select-card-header">
            <h2 />
          </Localized>
          <LabeledSelect
            label={getString('demo-language-select-label')}
            id="language-select-card--select"></LabeledSelect>
          <Localized id="demo-language-select-card-body">
            <p id="card-body" />
          </Localized>
        </div>
      </KioskCard.Body>
      <KioskCard.Bottom>
        <LinkButton
          id="language-select-card--next-button"
          to={urls.DEMO_DASHBOARD}
          rounded>
          <Localized id="demo-language-select-card-button">
            <span />
          </Localized>
          <ChevronRight />
        </LinkButton>
      </KioskCard.Bottom>
    </>
  );

  return {
    Content: localeConnector(withLocalization(ContentComponent)),
    Card: withLocalization(CardComponent),
  };
};
