import * as React from 'react';
import { getStats, renderStats } from '../../pages/datasets/dataset-info';
import stats from '../../pages/datasets/stats';
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react';
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
import { PageContentType, DownloadFormProps } from './types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  useLocale,
  localeConnector,
  LocalePropsFromState,
} from '../../locale-helpers';
import KioskCard from './kiosk-card';
import {
  SubscribeProps,
  SubscribePropsFromState,
  SubscribePropsFromDispatch,
  SubscribeMapStateToProps,
  SubscribeMapDispatchToProps,
  DatasetPropsFromState,
} from '../../pages/datasets/types';
import './demo-datasets.css';

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
    downloadLink: null,
  });

  const handleInputChange = ({ target }: any) => {
    let downloadLink =
      emailRef.current?.checkValidity() &&
      formState.confirmNoIdentify &&
      formState.confirmSize
        ? stats.bundleURLTemplate.replace('{locale}', bundleLocale)
        : null;
    setFormState(prev => ({
      ...prev,
      [target.name]: target.type === 'email' ? target.value : target.checked,
      downloadLink,
    }));
  };

  return (
    <div id="demo-datasets--download__form">
      <Localized id="email-input" attrs={{ label: true }}>
        <LabeledInput
          required
          type="email"
          ref={emailRef}
          onChange={handleInputChange}
          value={formState.email}
          id="download__sub--form-email"
        />
      </Localized>
      <LabeledCheckbox
        className="demo-datasets--download__sub-checkbox"
        onChange={handleInputChange}
        checked={formState.confirmSize}
        label={
          <Localized id="confirm-size" elems={{ b: <b /> }} vars={{ size }}>
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
          <Localized id="confirm-no-identify" elems={{ b: <b /> }}>
            <span />
          </Localized>
        }
        name="confirmNoIdentify"
      />
      <LinkButton
        rounded={true}
        id="demo--download__sub-download-button"
        href={formState.downloadLink}
        onClick={() => {
          api.forLocale(bundleLocale).saveHasDownloaded(formState.email);
        }}>
        <Localized
          id="download-language"
          vars={{ language: getString(bundleLocale) }}>
          <span />
        </Localized>
        <CloudIcon />
      </LinkButton>
    </div>
  );
};

const SubscribeForm = ({ api, account, addNotification }: SubscribeProps) => {
  const [_, toLocaleRoute] = useLocale();
  const [formState, setFormState] = React.useState({
    email: '',
    confirmNoIdentify: false,
    submitStatus: null,
  });
  const emailRef = React.useRef<HTMLInputElement>();
  const isEditable = formState.submitStatus === null;
  const handleInputChange = ({ target }: any) => {
    setFormState(prev => ({
      ...prev,
      [target.name]: target.type === 'email' ? target.value : target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState(prev => ({
      ...prev,
      submitStatus: 'submitting',
    }));
    try {
      await api.subscribeToNewsletter(
        account ? account.email : formState.email
      );
      addNotification(
        <Localized id="profile-form-submit-saved">
          <span />
        </Localized>
      );
      setFormState(prev => ({
        ...prev,
        submitStatus: 'submitted',
      }));
    } catch (e) {
      addNotification('Subscription failed', 'error');
      console.log('something failed', e);
      setFormState(prev => ({
        ...prev,
        submitStatus: null,
      }));
    }
  };

  return (
    <div className="demo-datasets--subscribe">
      <Localized id="demo-subscribe">
        <h2 id="demo-subscribe__header" />
      </Localized>
      <form id="demo-dataset--subscribe__form" onSubmit={handleSubmit}>
        <div id="subscribe__form--email-container">
          <Localized id="email-input">
            <LabeledInput
              onChange={handleInputChange}
              value={formState.email}
              disabled={!isEditable || account}
              ref={emailRef}
              type="email"
              id="subscribe__form--email"
            />
          </Localized>
          <TextButton
            disabled={
              !isEditable ||
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
            <Localized id="confirm-no-identify">
              <span />
            </Localized>
          }
          name="confirmNoIdentify"
        />
        <Localized id="accept-privacy-title">
          <Link
            to={toLocaleRoute(urls.PRIVACY)}
            id="subscribe__form--privacy"
          />
        </Localized>
      </form>
    </div>
  );
};

const ConnectedSubscribeForm = connect<
  SubscribePropsFromState,
  SubscribePropsFromDispatch
>(
  SubscribeMapStateToProps,
  SubscribeMapDispatchToProps
)(SubscribeForm);

const ConnectedDownloadForm = connect<DatasetPropsFromState>(
  SubscribeMapStateToProps
)(DownloadForm);

type ContentProps = LocalePropsFromState & WithLocalizationProps;
interface CardProps extends WithLocalizationProps {}

const getDatasetsComponents = (): PageContentType => {
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
    const [showDetails, toggleDetails] = React.useState(false);

    return (
      <div id="demo-datasets-content-container">
        <div className="grey-bg">
          <div className="demo-datasets--download">
            <Localized id="demo-download-dataset">
              <h1 id="demo-datasets--download__header" />
            </Localized>
            <div className="demo-datasets--download--box">
              <Localized id="datasets-headline">
                <h1 id="demo-datasets--download--box__header" />
              </Localized>
              <Localized id="demo-datasets-body">
                <p id="demo-datasets-body--box__body" />
              </Localized>
              <Localized id="demo-datasets-box-link">
                <button
                  id="demo-datasets-body--box__link"
                  className={!showDetails ? '' : 'hide'}
                  onClick={() => toggleDetails(true)}
                />
              </Localized>
              <Localized id="datasets-positioning">
                <p
                  id="datasets-positioning"
                  className={showDetails ? '' : 'hide'}
                />
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
              elems={{ b: <b /> }}
              vars={{
                ...Object.entries(globalStats).reduce(
                  (obj: any, [key, value]) => {
                    obj[key] = value;
                    return obj;
                  },
                  {}
                ),
              }}>
              <p className="demo-datasets--eofy__body" />
            </Localized>
          </div>
        </div>
        <ConnectedSubscribeForm />
      </div>
    );
  };

  const CardComponent = ({ getString }: CardProps) => (
    <>
      <KioskCard.Top>
        <div id="inner-circle" className="demo-datasets-kiosk-top-icon-circle">
          <CloudIcon />
        </div>
        <div
          id="outer-circle"
          className="demo-datasets-kiosk-top-icon-circle"></div>
      </KioskCard.Top>
      <KioskCard.Body>
        <div id="demo-datasets--card__body">
          <Localized id="demo-language-select-card-header">
            <h2 />
          </Localized>
          <LabeledSelect
            label={getString('demo-language-select-label')}></LabeledSelect>
          <Localized id="demo-language-select-card-body">
            <p id="kiosk-card--body_p" />
          </Localized>
        </div>
      </KioskCard.Body>
      <KioskCard.Bottom>
        <LinkButton
          id="demo-datasets-card--next-button"
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

export default getDatasetsComponents;
